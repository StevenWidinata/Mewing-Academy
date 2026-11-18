import { describe, expect, it } from 'vitest';
import type { Progress } from './progress';
import { ITEMS, badgeFor, canAfford, describeUnlock, handBadge, isFurUnlocked, isItemUnlocked, legacyOwned, missingFor, nextBadge, payFrom, priceOf, unlockKeys, withBuyHints } from './rewards';

const p = (stars: number, byTopic: Progress['byTopic'] = {}): Progress => ({ stars, byTopic, lastPlayed: null, streak: 0, lastDaily: null, sessions: [], mistakes: [], handAnswers: 0, levelStars: {}, playDays: [], shieldWeek: null, stickers: [], bag: {}, owned: [], buyHints: [], fixedCount: 0, lessonsDone: [], tutorQuestions: 0, purchases: 0 });

describe('rewards', () => {
  it('outfits and furs are owned only after buying (Sunny Yellow is free)', () => {
    expect(isItemUnlocked(p(50, { math: { correct: 40, total: 40 } }), 'glasses')).toBe(false);
    expect(isItemUnlocked({ ...p(0), owned: ['item:glasses'] }, 'glasses')).toBe(true);
    expect(isFurUnlocked(p(0), 'yellow')).toBe(true);
    expect(isFurUnlocked(p(100), 'orange')).toBe(false);
    expect(isFurUnlocked({ ...p(0), owned: ['fur:orange'] }, 'orange')).toBe(true);
  });

  it('keeps what the old free rules had unlocked', () => {
    expect(legacyOwned(p(26, { math: { correct: 5, total: 6 }, colors: { correct: 4, total: 4 } }))).toEqual(['item:glasses', 'fur:orange', 'fur:white']);
  });

  it('prices: tiered, every item buyable, spending works', () => {
    for (const it of ITEMS) {
      const total = Object.values(it.price).reduce((a, b) => a + (b ?? 0), 0);
      const range = { cheap: [2, 3], medium: [5, 6], special: [10, 12] }[it.tier];
      expect(total, it.id).toBeGreaterThanOrEqual(range[0]);
      expect(total, it.id).toBeLessThanOrEqual(range[1]);
    }
    expect(canAfford({ math: 3 }, { math: 3 })).toBe(true);
    expect(canAfford({ math: 2 }, { math: 3 })).toBe(false);
    expect(missingFor({ math: 1, colors: 9 }, { math: 4, colors: 4 })).toEqual({ math: 3 });
    expect(payFrom({ math: 5, ticket: 1 }, { math: 3 })).toEqual({ math: 2, ticket: 1 });
    expect(priceOf('item:crown')).toEqual({ math: 4, colors: 4, animals: 4 });
    expect(priceOf('fur:calico')).toEqual({ ticket: 6 });
  });

  it('shows a "you can buy" pop-up once per item', () => {
    const hints = withBuyHints({ bag: { math: 3 }, owned: [], buyHints: [] });
    expect(hints).toEqual(['item:glasses']);
    expect(withBuyHints({ bag: { math: 3 }, owned: [], buyHints: hints })).toBe(hints);
    expect(withBuyHints({ bag: { math: 3 }, owned: ['item:glasses'], buyHints: [] })).toEqual([]);
    expect(describeUnlock('canbuy:item:glasses', 'en')).toContain('Smart Glasses');
  });

  it('gives bronze, silver and gold badges', () => {
    expect(badgeFor(4)).toBeNull();
    expect(badgeFor(5)?.tier).toBe('bronze');
    expect(badgeFor(15)?.tier).toBe('silver');
    expect(badgeFor(30)?.tier).toBe('gold');
    expect(nextBadge(30)).toBeNull();
  });

  it('lists earned rewards as keys (used to detect new unlocks)', () => {
    const keys = unlockKeys({ ...p(10, { math: { correct: 5, total: 5 } }), owned: ['item:glasses', 'fur:orange'] });
    expect(keys).toContain('item:glasses');
    expect(keys).toContain('fur:orange');
    expect(keys).toContain('badge:math:bronze');
    expect(keys).not.toContain('fur:yellow');
  });

  it('Hand Hero: badge tiers and one pop-up per bonus star', () => {
    const keys = unlockKeys({ ...p(0), handAnswers: 12 });
    expect(keys).toContain('hand:bronze');
    expect(keys).not.toContain('hand:silver');
    expect(keys.filter((k) => k.startsWith('handbonus:'))).toEqual(['handbonus:2']);
    expect(handBadge(4)).toBeNull();
    expect(handBadge(25)?.tier).toBe('silver');
    expect(describeUnlock('handbonus:2', 'en')).toContain('+1');
  });
});
