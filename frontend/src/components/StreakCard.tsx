import { nextGift } from '../lib/streakGifts';
import { nextStreak } from '../lib/weekly';
import { today, useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** Home: today's day streak, whether it is safe yet, and the next streak gift. */
export function StreakCard() {
  const { tr } = useSettings();
  const p = useProgress();
  const now = today();
  const playedToday = p.lastPlayed === now;
  // Playing today would continue the streak (yesterday played, or the shield covers a missed day).
  const alive = playedToday || (p.streak > 0 && nextStreak(p, now).streak > p.streak);
  const days = alive ? p.streak : 0;
  const gift = nextGift(p.streakGifts);
  const status = playedToday ? tr('streakPlayedToday') : alive ? tr('streakPlayToday') : tr('streakStart');
  return (
    <div className={`card streak-card${playedToday ? ' is-safe' : ''}`}>
      <span className="streak-card__flame" aria-hidden="true">🔥</span>
      <div className="streak-card__body">
        <strong className="streak-card__count">
          {days} {tr('progressStreak')}
        </strong>
        <span className="streak-card__status">{status}</span>
        <span className="streak-card__gift">
          {gift ? tr('streakNextGift').replace('{n}', String(gift.days)).replace('{t}', String(gift.tickets)) : tr('streakAllGifts')}
        </span>
      </div>
      {playedToday && <span className="streak-card__check" aria-hidden="true">✅</span>}
    </div>
  );
}
