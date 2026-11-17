import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../state/settings';
import { classify, type Classification } from '../vision/fingers';
import { LETTERS } from './ChoiceGrid';
import { HandPose } from './HandPose';
import { useVision, type VisionFrame } from '../vision/useVision';

const HOLD_MS = 1200; // how long a finger pose must be held to confirm

interface Props {
  choiceCount: number;
  /** Called once a pose is held long enough. */
  onConfirm: (index: number) => void;
  /** Pauses detection (e.g., while showing the result). */
  paused?: boolean;
  onHover?: (index: number | null, progress: number) => void;
  /** Answers are numbers (e.g. "5"): remind kids fingers pick the letter. */
  numericChoices?: boolean;
}

type Readout = Pick<Classification, 'answer' | 'pose' | 'reason'>;
const EMPTY_READOUT: Readout = { answer: null, pose: [false, false, false, false, false], reason: 'no-hand' };
const readoutKey = (r: Readout) => `${r.answer}|${r.reason}|${r.pose.map(Number).join('')}`;

export function CameraStage({ choiceCount, onConfirm, paused = false, onHover, numericChoices = false }: Props) {
  const { settings, tr } = useSettings();
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

  const handleFrame = useCallback(
    (frame: VisionFrame) => {
      if (pausedRef.current || confirmed.current) {
        onHover?.(null, 0);
        return;
      }
      const lm = frame.hand?.landmarks?.[0];
      const result = classify(lm, settings.fingerMode, choiceCount);
      const { answer } = result;
      showReadout(result);

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
    [choiceCount, onConfirm, onHover, settings.fingerMode, showReadout],
  );

  const { videoRef, status, start, stop } = useVision({ onFrame: handleFrame });

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
                      : readout.reason === 'one-finger'
                        ? tr('pointOneFinger')
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

      <div style={{ display: 'flex', gap: '0.5rem' }}>
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
