import { describe, expect, it } from 'vitest';
import { addPlayDay, nextStreak, playedThisWeek, shieldReady, weekDays, weekStart } from './weekly';

// 2026-11-18 is a Wednesday.
const WED = '2026-11-18';

describe('weekly goal', () => {
  it('finds the Monday of the week', () => {
    expect(weekStart(WED)).toBe('2026-11-16');
    expect(weekStart('2026-11-16')).toBe('2026-11-16');
    expect(weekStart('2026-11-22')).toBe('2026-11-16'); // Sunday
  });

  it('counts played days this week only', () => {
    const days = ['2026-11-14', '2026-11-16', WED];
    expect(playedThisWeek(days, WED)).toBe(2);
    const week = weekDays(days, WED);
    expect(week).toHaveLength(7);
    expect(week[0]).toEqual({ day: '2026-11-16', played: true, future: false });
    expect(week[6].future).toBe(true);
  });

  it('keeps play days unique', () => {
    expect(addPlayDay([WED], WED)).toEqual([WED]);
    expect(addPlayDay(['2026-11-17'], WED)).toEqual(['2026-11-17', WED]);
  });
});

describe('streak shield', () => {
  it('grows the streak on the next day', () => {
    expect(nextStreak({ lastPlayed: '2026-11-17', streak: 4, shieldWeek: null }, WED)).toMatchObject({ streak: 5, shielded: false });
  });

  it('forgives one missed day per week', () => {
    const r = nextStreak({ lastPlayed: '2026-11-16', streak: 4, shieldWeek: null }, WED);
    expect(r).toMatchObject({ streak: 5, shielded: true, shieldWeek: '2026-11-16' });
    expect(shieldReady(r.shieldWeek, WED)).toBe(false);
    // A second miss in the same week breaks the streak.
    expect(nextStreak({ ...r, lastPlayed: '2026-11-18' }, '2026-11-20')).toMatchObject({ streak: 1, shielded: false });
  });

  it('does not save a streak after 2 missed days', () => {
    expect(nextStreak({ lastPlayed: '2026-11-15', streak: 9, shieldWeek: null }, WED)).toMatchObject({ streak: 1 });
  });

  it('does nothing when already played today', () => {
    const s = { lastPlayed: WED, streak: 3, shieldWeek: null };
    expect(nextStreak(s, WED)).toMatchObject(s);
  });
});
