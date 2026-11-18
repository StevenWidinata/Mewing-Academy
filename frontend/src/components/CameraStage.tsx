import { useCallback, useEffect, useRef, useState } from 'react';
import { sfx } from '../lib/sound';
import { useSettings } from '../state/settings';
import { classify, poseFor, type Classification } from '../vision/fingers';
import { LETTERS } from './ChoiceGrid';
import { HandPose } from './HandPose';
import { useVision, type VisionFrame, type VisionStatus } from '../vision/useVision';

const HOLD_MS = 1200; // how long a finger pose must be held to confirm
/** First-time camera practice: show 1, 2, 3, then 4 fingers. */
const TUTORIAL_STEPS = 4;

interface Props {
  choiceCount: number;
  /** Called once a pose is held long enough. */
  onConfirm: (index: number) => void;
  /** Pauses detection (e.g., while showing the result). */
  paused?: boolean;
  onHover?: (index: number | null, progress: number) => void;
  /** Answers are numbers (e.g. "5"): remind kids fingers pick the letter. */
  numericChoices?: boolean;
  /** Lets the page switch tapping off while the camera is running. */
  onStatusChange?: (status: VisionStatus) => void;
}

type Readout = Pick<Classification, 'answer' | 'pose' | 'reason'>;
const EMPTY_READOUT: Readout = { answer: null, pose: [false, false, false, false, false], reason: 'no-hand' };
const readoutKey = (r: Readout) => `${r.answer}|${r.reason}|${r.pose.map(Number).join('')}`;

export function CameraStage({ choiceCount, onConfirm, paused = false, onHover, numericChoices = false, onStatusChange }: Props) {
  const { tr, settings, set } = useSettings();
  // null = no practice; 0..3 = the finger count being practised; 4 = finished.
  const [tutorial, setTutorial] = useState<number | null>(null);
  const tutorialRef = useRef<number | null>(null);
  const [tutorialProgress, setTutorialProgress] = useState(0);
  const soundRef = useRef(settings.sound);
  useEffect(() => {
    soundRef.current = settings.sound;
  }, [settings.sound]);
  // Only re-render when what we show changes, not on every camera frame.
  const [readout, setReadout] = useState<Readout>(EMPTY_READOUT);
  const lastKey = useRef(readoutKey(EMPTY_READOUT));
  const showReadout = useCallback((r: Readout) => {
    const key = readoutKey(r);
    if (key === lastKey.current) return;
    lastKey.current = key;
    setReadout({ answer: r.answer, pose: r.pose, reason: r.reason });
  }, []);

  // Hold tracking lives in refs so the rAF loop doesn't re-render every frame.
  const candidate = useRef<number | null>(null);
  const holdStart = useRef(0);
  const confirmed = useRef(false);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) confirmed.current = false;
  }, [paused]);

  // After practice, wait for the hand to drop once so a held pose is not taken as an answer.
  const needsRelease = useRef(false);
  const finishTutorial = useCallback(() => {
    needsRelease.current = true;
    tutorialRef.current = null;
    setTutorial(null);
    set('cameraTutorialDone', true);
  }, [set]);

  const handleFrame = useCallback(
    (frame: VisionFrame) => {
      const step = tutorialRef.current;
      if (step != null) {
        // Practice mode: answers do not count yet.
        onHover?.(null, 0);
        const result = classify(frame.hand?.landmarks?.[0], TUTORIAL_STEPS);
        showReadout(result);
        if (step >= TUTORIAL_STEPS) return;
        if (result.answer !== step) {
          candidate.current = null;
          setTutorialProgress(0);
          return;
        }
        if (candidate.current !== step) {
          candidate.current = step;
          holdStart.current = performance.now();
        }
        const progress = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS);
        setTutorialProgress(Math.round(progress * 10) / 10);
        if (progress >= 1) {
          candidate.current = null;
          setTutorialProgress(0);
          tutorialRef.current = step + 1;
          setTutorial(step + 1);
          if (step + 1 >= TUTORIAL_STEPS) {
            sfx.star(soundRef.current);
            window.setTimeout(finishTutorial, 1800);
          } else {
            sfx.correct(soundRef.current);
          }
        }
        return;
      }
      if (pausedRef.current || confirmed.current) {
        onHover?.(null, 0);
        return;
      }
      const lm = frame.hand?.landmarks?.[0];
      const result = classify(lm, choiceCount);
      const { answer } = result;
      showReadout(result);

      if (needsRelease.current) {
        if (answer == null) needsRelease.current = false;
        onHover?.(null, 0);
        return;
      }
      if (answer == null) {
        candidate.current = null;
        onHover?.(null, 0);
        return;
      }
      if (candidate.current !== answer) {
        candidate.current = answer;
        holdStart.current = performance.now();
      }
      const held = performance.now() - holdStart.current;
      const progress = Math.min(1, held / HOLD_MS);
      onHover?.(answer, progress);
      if (progress >= 1) {
        confirmed.current = true;
        candidate.current = null;
        onConfirm(answer);
      }
    },
    [choiceCount, onConfirm, onHover, showReadout, finishTutorial],
  );

  const { videoRef, status, start, stop } = useVision({ onFrame: handleFrame });
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Start the practice the first time the camera works on this device.
  useEffect(() => {
    if (status === 'running' && !settings.cameraTutorialDone && tutorialRef.current == null) {
      tutorialRef.current = 0;
      setTutorial(0);
    }
    if (status !== 'running' && tutorialRef.current != null) {
      tutorialRef.current = null;
      setTutorial(null);
    }
  }, [status, settings.cameraTutorialDone]);

  return (
    <div className="pixel-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 360, aspectRatio: '4 / 3', background: '#000', border: '4px solid var(--ink)' }}>
        {/* Mirror the video so raising your right hand feels natural. */}
        <video
          ref={videoRef}
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: status === 'running' ? 'block' : 'none' }}
        />
        {status !== 'running' && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '1rem', fontFamily: 'var(--font-read)' }}>
            {status === 'loading'
              ? tr('cameraLoading')
              : status === 'denied'
                ? tr('cameraDenied')
                : status === 'insecure'
                  ? tr('cameraInsecure')
                  : status === 'nocamera'
                    ? tr('cameraNoDevice')
                    : status === 'busy'
                      ? tr('cameraBusy')
                      : status === 'error'
                        ? tr('cameraError')
                        : tr('answerWithHand')}
          </div>
        )}
        {status === 'running' && tutorial != null && (
          <div className="cam-tutorial" role="status" aria-live="polite">
            {tutorial < TUTORIAL_STEPS ? (
              <>
                <p className="cam-tutorial__title">
                  {tutorial === 0 ? tr('camTutorialStart') : tr('camTutorialNow')} {tutorial + 1}{' '}
                  {tutorial === 0 ? tr('camTutorialFinger') : tr('camTutorialFingers')}
                </p>
                <HandPose pose={poseFor(tutorial)} size={56} />
                <span className="cam-tutorial__bar" aria-hidden="true">
                  <span style={{ width: `${tutorialProgress * 100}%` }} />
                </span>
                <ol className="cam-tutorial__dots" aria-label={`${tutorial + 1} / ${TUTORIAL_STEPS}`}>
                  {Array.from({ length: TUTORIAL_STEPS }, (_, i) => (
                    <li key={i} className={i < tutorial ? 'is-done' : i === tutorial ? 'is-now' : undefined} />
                  ))}
                </ol>
              </>
            ) : (
              <p className="cam-tutorial__title">🎉 {tr('camTutorialDone')}</p>
            )}
          </div>
        )}
        {status === 'running' && (
          <div
            aria-live="polite"
            style={{
              position: 'absolute',
              left: 6,
              right: 6,
              bottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: readout.answer != null ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontFamily: 'var(--font-read)',
              fontSize: '0.8rem',
              padding: '4px 8px',
            }}
          >
            {readout.reason === 'no-hand' || readout.reason === 'fist' ? (
              tr('showFingers')
            ) : (
              <>
                <HandPose pose={readout.pose} size={26} />
                {readout.answer != null ? (
                  <strong style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--yellow)' }}>
                    → {LETTERS[readout.answer]}
                  </strong>
                ) : (
                  <span>
                    {readout.reason === 'open-hand'
                      ? tr('handOpen')
                      : tr('handTooMany')}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {numericChoices && (
        <p
          role="note"
          style={{ margin: 0, padding: '4px 10px', background: 'var(--yellow)', color: 'var(--ink)', fontFamily: 'var(--font-read)', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}
        >
          {tr('fingersPickLetter')}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {status === 'running' && tutorial != null && tutorial < TUTORIAL_STEPS && (
          <button type="button" className="btn btn--ghost" onClick={finishTutorial}>
            {tr('camTutorialSkip')}
          </button>
        )}
        {status === 'running' ? (
          <button type="button" className="btn btn--ghost" onClick={stop}>
            {tr('cameraStop')}
          </button>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={start} disabled={status === 'loading'}>
            {status === 'loading' ? tr('loading') : tr('cameraStart')}
          </button>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-read)', fontSize: '0.75rem', textAlign: 'center', margin: 0, opacity: 0.85 }}>{tr('cameraPrivacy')}</p>
    </div>
  );
}
