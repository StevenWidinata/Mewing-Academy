import { describe, expect, it } from 'vitest';
import { STREAK_GIFTS, giftsDue, nextGift, passedGifts } from './streakGifts';

describe('streak gifts', () => {
  it('gives each milestone once', () => {
    expect(giftsDue(2, [])).toEqual([]);
    expect(giftsDue(3, [])).toEqual([{ days: 3, tickets: 1 }]);
    expect(giftsDue(3, [3])).toEqual([]);
    expect(giftsDue(7, [3])).toEqual([{ days: 7, tickets: 2 }]);
  });

  it('catches up on every milestone passed at once', () => {
    expect(giftsDue(14, []).map((g) => g.days)).toEqual([3, 7, 14]);
  });

  it('points to the next milestone', () => {
    expect(nextGift([])).toEqual({ days: 3, tickets: 1 });
    expect(nextGift([3, 7])).toEqual({ days: 14, tickets: 3 });
    expect(nextGift(STREAK_GIFTS.map((g) => g.days))).toBeNull();
  });

  it('marks milestones from old saves as given', () => {
    expect(passedGifts(0)).toEqual([]);
    expect(passedGifts(8)).toEqual([3, 7]);
  });
});
