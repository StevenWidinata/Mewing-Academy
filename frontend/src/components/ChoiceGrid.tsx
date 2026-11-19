import type { Choice } from '../../../shared/types';
import { useSettings } from '../state/settings';
import { poseFor } from '../vision/fingers';
import { HandPose } from './HandPose';
import { ColorSwatch } from './Sprite';

const LETTERS = ['A', 'B', 'C', 'D'];

function fingerHintLabel(i: number, lang: 'en' | 'id'): string {
  const n = i + 1;
  return lang === 'en' ? `${n} finger${n > 1 ? 's' : ''}` : `${n} jari`;
}

interface Props {
  choices: Choice[];
  /** Which choice the camera is currently "hovering" (0..3) or null. */
  hovered?: number | null;
  /** 0..1 fill of the hold-to-confirm bar on the hovered choice. */
  holdProgress?: number;
  /** Set after an answer: the chosen index. */
  picked?: number | null;
  /** The correct index, revealed after picking. */
  answer?: number;
  onPick: (index: number) => void;
  disabled?: boolean;
  /** Draw the hand pose that picks each answer with the camera. */
  showFingerHint?: boolean;
  /**
   * False while the camera is running: the cards only light up from hand
   * gestures, so the camera stays the main way to play.
   */
  tapEnabled?: boolean;
  /** A wrong choice the 💡 hint crossed out. It keeps its place so fingers still match A-D. */
  hiddenChoice?: number | null;
}

export function ChoiceGrid({ choices, hovered, holdProgress = 0, picked, answer, onPick, disabled, showFingerHint = true, tapEnabled = true, hiddenChoice = null }: Props) {
  const { settings } = useSettings();
  const revealed = picked != null && answer != null;

  return (
    <div
      role="group"
      aria-label="Answer choices"
      style={{ display: 'grid', gridTemplateColumns: choices.length > 2 ? '1fr 1fr' : '1fr', gap: '1rem', maxWidth: 640, margin: '0 auto', width: '100%' }}
    >
      {choices.map((c, i) => {
        const isHidden = hiddenChoice === i;
        const isHover = hovered === i && !revealed && !isHidden;
        const isPicked = picked === i;
        const isCorrect = revealed && i === answer;
        const isWrong = revealed && isPicked && i !== answer;
        const bg = isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : isHidden ? 'var(--btn-ghost)' : isHover ? 'var(--cyan)' : 'var(--yellow)';
        return (
          <button
            key={i}
            type="button"
            className={`btn choice-btn${tapEnabled ? '' : ' choice-btn--camera'}${isHidden ? ' choice-btn--hidden' : ''}`}
            onClick={() => tapEnabled && !disabled && !revealed && !isHidden && onPick(i)}
            disabled={disabled || revealed || isHidden}
            aria-disabled={!tapEnabled || undefined}
            aria-pressed={isPicked}
            style={{ background: bg, position: 'relative', overflow: 'hidden', fontSize: '1rem', padding: '1.2em 1em', minHeight: 72 }}
          >
            {/* hold-to-confirm fill */}
            {isHover && holdProgress > 0 && !settings.reduceMotion && (
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.45)', transformOrigin: 'left', transform: `scaleX(${holdProgress})`, transition: 'transform 0.05s linear' }} />
            )}
            {/* Wraps on narrow cards instead of clipping the label */}
            <span style={{ position: 'relative', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6, maxWidth: '100%' }}>
              <strong style={{ fontFamily: 'var(--font-pixel)', marginRight: showFingerHint ? 2 : 8 }}>{LETTERS[i]}</strong>
              {showFingerHint && (
                <span
                  title={fingerHintLabel(i, settings.lang)}
                  style={{ marginRight: 8, padding: 2, borderRadius: 4, background: 'rgba(0,0,0,0.12)' }}
                >
                  <HandPose pose={poseFor(i)} size={22} label={fingerHintLabel(i, settings.lang)} />
                </span>
              )}
              {c.color && <ColorSwatch color={c.color} />}
              <span style={{ fontFamily: 'var(--font-read)', fontWeight: 700, textDecoration: isHidden ? 'line-through 3px' : undefined }}>{c.label[settings.lang]}</span>
              {isHidden && <span className="sr-only">{settings.lang === 'en' ? '(crossed out by the hint)' : '(dicoret oleh petunjuk)'}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { LETTERS };
