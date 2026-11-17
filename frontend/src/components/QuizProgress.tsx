import { useSettings } from '../state/settings';

interface Props {
  index: number;
  total: number;
  /** Answers so far: true = right, false = wrong. */
  results: boolean[];
  stars: number;
}

/** Solid "Question 3 / 10" badge plus one segment per question. */
export function QuizProgress({ index, total, results, stars }: Props) {
  const { tr } = useSettings();
  return (
    <div className="quiz-progress">
      <div className="quiz-progress__row">
        <span className="quiz-progress__badge">
          {tr('questionWord')} {index + 1} / {total}
        </span>
        <span className="quiz-progress__badge quiz-progress__badge--stars">⭐ {stars}</span>
      </div>
      <ol className="quiz-progress__bar" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const state = i < results.length ? (results[i] ? 'right' : 'wrong') : i === index ? 'current' : 'todo';
          return <li key={i} className={`quiz-progress__seg quiz-progress__seg--${state}`} />;
        })}
      </ol>
    </div>
  );
}
