/**
 * Streak gifts: Golden Tickets for reaching a day streak, once each, ever.
 * The milestones match Mewy's growth stages (3, 7, 14, 30 days).
 */

export const STREAK_GIFTS: { days: number; tickets: number }[] = [
  { days: 3, tickets: 1 },
  { days: 7, tickets: 2 },
  { days: 14, tickets: 3 },
  { days: 30, tickets: 5 },
];

/** Milestones reached by `streak` that have not been given yet. */
export function giftsDue(streak: number, given: number[]): { days: number; tickets: number }[] {
  return STREAK_GIFTS.filter((g) => streak >= g.days && !given.includes(g.days));
}

/** The next milestone not given yet, or null when all are given. */
export function nextGift(given: number[]): { days: number; tickets: number } | null {
  return STREAK_GIFTS.find((g) => !given.includes(g.days)) ?? null;
}

/** Old saves: milestones already passed count as given (no surprise pile of tickets). */
export const passedGifts = (bestStreak: number) => STREAK_GIFTS.filter((g) => bestStreak >= g.days).map((g) => g.days);
