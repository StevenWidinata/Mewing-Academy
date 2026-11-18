import { describe, expect, it } from 'vitest';
import { ALL_BOSSES, BOSSES, FACE_BOSSES, bossTaunt, pickBoss, pickSecondBoss } from './bosses';

describe('Hand Quiz bosses', () => {
  it('has Muddle plus the 4 team-photo bosses', () => {
    expect(ALL_BOSSES).toEqual(['muddle', 'goat', 'nel', 'bulepotan', 'gembel']);
    expect(FACE_BOSSES).toEqual(['goat', 'nel', 'bulepotan', 'gembel']);
    for (const id of FACE_BOSSES) {
      const b = BOSSES[id];
      expect(b.photo).toMatch(/^bosses\/\w+\.webp$/);
      expect(b.taunts).toHaveLength(3);
      for (const t of [...b.taunts, b.ko, b.name]) expect(t.en && t.id).toBeTruthy();
    }
  });

  it('never repeats the main boss two rounds in a row', () => {
    for (const last of ALL_BOSSES) {
      for (let r = 0; r < 1; r += 0.05) expect(pickBoss(last, () => r)).not.toBe(last);
    }
    const seen = new Set(Array.from({ length: 20 }, (_, i) => pickBoss(null, () => i / 20)));
    expect(seen.size).toBe(5);
  });

  it('the second boss is always another face boss', () => {
    for (const main of ALL_BOSSES) {
      for (let r = 0; r < 1; r += 0.05) {
        const second = pickSecondBoss(main, () => r);
        expect(second).not.toBe(main);
        expect(FACE_BOSSES).toContain(second);
      }
    }
  });

  it("picks one of the boss's own taunts", () => {
    expect(BOSSES.goat.taunts).toContain(bossTaunt(BOSSES.goat, 0.99));
    expect(bossTaunt(BOSSES.nel, 0)).toBe(BOSSES.nel.taunts[0]);
  });
});
