import { Link } from 'react-router-dom';
import type { Question } from '../../../shared/types';
import { useSettings } from '../state/settings';
import { LETTERS } from './ChoiceGrid';

/** End-of-round list: every question with the child's answer and the right one. */
export function RoundRecap({ questions, picks, showFix = true }: { questions: Question[]; picks: number[]; showFix?: boolean }) {
  const { tr, settings } = useSettings();
  const L = settings.lang;
  const misses = questions.filter((q, i) => picks[i] !== q.answer).length;
  return (
    <details className="card recap" open>
      <summary className="recap__summary">📝 {tr('recapTitle')}</summary>
      <ol className="recap__list">
        {questions.map((q, i) => {
          const right = picks[i] === q.answer;
          const yours = q.choices[picks[i]];
          const good = q.choices[q.answer];
          return (
            <li key={q.id + i} className={`recap__item ${right ? 'is-right' : 'is-wrong'}`}>
              <span className="recap__mark" aria-label={right ? tr('correct') : tr('notQuite')}>{right ? '✅' : '❌'}</span>
              <span className="recap__body">
                <span className="recap__q">{q.prompt[L]}</span>
                {right ? (
                  <span className="recap__a">
                    {LETTERS[q.answer]}. {good.label[L]}
                  </span>
                ) : (
                  <span className="recap__a">
                    {yours && (
                      <span className="recap__yours">
                        {tr('recapYours')}: {LETTERS[picks[i]]}. {yours.label[L]}
                      </span>
                    )}{' '}
                    <span className="recap__right">
                      {tr('recapRight')}: {LETTERS[q.answer]}. {good.label[L]}
                    </span>
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      {showFix && misses > 0 && (
        <p style={{ margin: '0.75rem 0 0', textAlign: 'center' }}>
          <Link to="/review" className="btn btn--secondary">🔧 {tr('fixMistakes')}</Link>
        </p>
      )}
    </details>
  );
}
