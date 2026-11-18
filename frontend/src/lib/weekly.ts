/**
 * Weekly goal and streak shield. Days are YYYY-MM-DD strings (the same UTC
 * days the progress store already uses). Pure, so it is unit tested.
 */

/** Days to play each week (Monday to Sunday). */
export const WEEKLY_GOAL = 3;
/** Play days kept for the weekly goal. */
export const MAX_PLAY_DAYS = 28;

const toDate = (day: string) => new Date(`${day}T00:00:00Z`);
const toDay = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(day: string, n: number): string {
  const d = toDate(day);
  d.setUTCDate(d.getUTCDate() + n);
  return toDay(d);
}

/** The Monday of the week that contains `day`. */
export function weekStart(day: string): string {
  const dow = (toDate(day).getUTCDay() + 6) % 7; // Monday = 0
  return addDays(day, -dow);
}

export interface StreakState {
  lastPlayed: string | null;
  streak: number;
  /** Week (its Monday) whose one free missed day was already used. */
  shieldWeek: string | null;
}

/** Streak after playing on `today`. One missed day per week is forgiven by the shield. */
export function nextStreak(prev: StreakState, today: string): StreakState & { shielded: boolean } {
  if (prev.lastPlayed === today) return { ...prev, shielded: false };
  const yesterday = addDays(today, -1);
  if (prev.lastPlayed === yesterday) return { ...prev, lastPlayed: today, streak: prev.streak + 1, shielded: false };
  const missedWeek = weekStart(yesterday);
  if (prev.lastPlayed === addDays(today, -2) && prev.streak > 0 && prev.shieldWeek !== missedWeek) {
    return { lastPlayed: today, streak: prev.streak + 1, shieldWeek: missedWeek, shielded: true };
  }
  return { ...prev, lastPlayed: today, streak: 1, shielded: false };
}

/** Adds today to the list of play days (unique, newest last, capped). */
export function addPlayDay(days: string[], today: string): string[] {
  return days.includes(today) ? days : [...days, today].slice(-MAX_PLAY_DAYS);
}

/** Which days of this week (Monday first) were played. */
export function weekDays(days: string[], today: string): { day: string; played: boolean; future: boolean }[] {
  const monday = weekStart(today);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i);
    return { day, played: days.includes(day), future: day > today };
  });
}

/** Played days this week (Monday to today). */
export const playedThisWeek = (days: string[], today: string) => weekDays(days, today).filter((d) => d.played).length;

/** True while this week's shield is unused. */
export const shieldReady = (shieldWeek: string | null, today: string) => shieldWeek !== weekStart(today);
