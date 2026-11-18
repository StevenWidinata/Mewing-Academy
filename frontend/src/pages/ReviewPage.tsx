import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../../../shared/types';
import { MewyBuddy } from '../components/MewyBuddy';
import { QuizRunner } from '../components/QuizRunner';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** Questions per "Fix my mistakes" round. */
const REVIEW_ROUND = 10;

export function ReviewPage() {
  const { tr } = useSettings();
  const progress = useProgress();
  const [round, setRound] = useState<Question[] | null>(null);
  const [n, setN] = useState(0);
  const left = progress.mistakes.length;

  // Oldest misses first; the list is a snapshot so it does not change mid-round.
  const start = () => {
    setRound(progress.mistakes.slice(0, REVIEW_ROUND));
    setN((x) => x + 1);
  };

  if (!round) {
    return (
      <section style={{ textAlign: 'center' }}>
        <h1>🔧 {tr('fixMistakes')}</h1>
        {left === 0 ? (
          <>
            <MewyBuddy mood="happy" text={tr('reviewEmpty')} />
            <Link to="/quiz" className="btn">▶ {tr('heroPlay')}</Link>
          </>
        ) : (
          <>
            <MewyBuddy mood="think" text={tr('reviewIntro')} />
            <p className="chip" style={{ fontFamily: 'var(--font-read)', fontWeight: 700 }}>
              {left} {tr('reviewToFix')}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button type="button" className="btn" onClick={start} style={{ fontSize: '0.9rem', padding: '1em 1.6em' }}>
                ▶ {tr('start')}
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <QuizRunner
      key={n}
      questions={round}
      mode="review"
      renderDone={(correct, total) => (
        <>
          <MewyBuddy mood={correct >= total / 2 ? 'happy' : 'sad'} />
          <h1>⭐ {correct}/{total}</h1>
          <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem' }}>
            {progress.mistakes.length === 0 ? tr('reviewAllFixed') : `${progress.mistakes.length} ${tr('reviewToFix')}`}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            {progress.mistakes.length > 0 && (
              <button type="button" className="btn" onClick={start}>{tr('playAgain')}</button>
            )}
            <Link to="/" className="btn btn--ghost">{tr('navHome')}</Link>
          </div>
        </>
      )}
    />
  );
}
