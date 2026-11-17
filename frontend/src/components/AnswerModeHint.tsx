import { useSettings } from '../state/settings';

/** One line above the answer cards saying how to answer right now. */
export function AnswerModeHint({ tapEnabled }: { tapEnabled: boolean }) {
  const { tr } = useSettings();
  return (
    <p
      aria-live="polite"
      className={tapEnabled ? 'answer-hint answer-hint--tap' : 'answer-hint'}
      style={{ fontFamily: 'var(--font-read)', fontWeight: 700, textAlign: 'center', margin: '0 auto 0.75rem', padding: '0.35rem 0.75rem', maxWidth: 640 }}
    >
      {tapEnabled ? tr('cameraNudge') : tr('answerWithFingers')}
    </p>
  );
}
