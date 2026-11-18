import { WEEKLY_GOAL, playedThisWeek, shieldReady, weekDays } from '../lib/weekly';
import { today, useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

const DAY_LETTERS = { en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], id: ['S', 'S', 'R', 'K', 'J', 'S', 'M'] };

/** This week's play days, the 3-day goal and the streak shield. */
export function WeeklyGoal() {
  const { tr, settings } = useSettings();
  const p = useProgress();
  const now = today();
  const days = weekDays(p.playDays, now);
  const played = playedThisWeek(p.playDays, now);
  const reached = played >= WEEKLY_GOAL;
  const ready = shieldReady(p.shieldWeek, now);
  return (
    <div className="card weekly">
      <div className="weekly__head">
        <h2 className="weekly__title">🎯 {tr('weeklyGoal')}</h2>
        <span className="chip weekly__count">
          {Math.min(played, WEEKLY_GOAL)} / {WEEKLY_GOAL} {tr('weeklyDays')} {reached ? '✅' : ''}
        </span>
      </div>
      <ol className="weekly__days" aria-label={`${played} / ${WEEKLY_GOAL}`}>
        {days.map((d, i) => (
          <li
            key={d.day}
            className={`weekly__day${d.played ? ' is-played' : ''}${d.day === now ? ' is-today' : ''}${d.future ? ' is-future' : ''}`}
            aria-label={`${d.day}${d.played ? ' ✔' : ''}`}
          >
            <span aria-hidden="true">{DAY_LETTERS[settings.lang][i]}</span>
            <span aria-hidden="true">{d.played ? '⭐' : ''}</span>
          </li>
        ))}
      </ol>
      <p className="weekly__shield">
        🛡️ {ready ? tr('shieldReady') : tr('shieldUsed')}
      </p>
    </div>
  );
}
