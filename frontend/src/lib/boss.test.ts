import { describe, expect, it } from 'vitest';
import type { Difficulty } from '../../../shared/types';
import { TAUNTS, bossState, hitFor, hpFor, tauntFor, type Answer } from './boss';

const right = (ms = 8000, roll = 0.5): Answer => ({ correct: true, ms, roll });
const wrong = (roll = 0.5): Answer => ({ correct: false, ms: 8000, roll });
const easy = (n: number): Difficulty[] => Array.from({ length: n }, () => 1 as Difficulty);

describe('hitFor', () => {
  it('scales base damage by difficulty', () => {
    expect(hitFor(1, 1, right()).damage).toBe(10);
    expect(hitFor(2, 1, right()).damage).toBe(15);
    expect(hitFor(3, 1, right()).damage).toBe(20);
  });

  it('crits on a 3+ combo and adds a quick bonus under 5 s', () => {
    expect(hitFor(1, 3, right())).toEqual({ damage: 15, crit: true, quick: false });
    expect(hitFor(1, 1, right(3000))).toEqual({ damage: 13, crit: false, quick: true });
    expect(hitFor(2, 4, right(1000)).damage).toBe(28); // 15 x 1.5 x 1.25
  });

  it('luck spreads damage between 80% and 120%', () => {
    expect(hitFor(3, 1, right(8000, 0)).damage).toBe(16);
    expect(hitFor(3, 1, right(8000, 1)).damage).toBe(24);
  });
});

describe('hpFor', () => {
  it('is 70% of the total base damage', () => {
    expect(hpFor(easy(5))).toBe(35);
    expect(hpFor([1, 2, 3])).toBe(32); // 45 x 0.7 = 31.5
  });
});

describe('bossState', () => {
  it('starts at full HP', () => {
    expect(bossState(easy(5), [])).toMatchObject({ phase: 1, hp: 35, maxHp: 35, defeated: false });
  });

  it('wrong answers do no damage and reset the combo', () => {
    const s = bossState(easy(5), [right(), right(), wrong(), right()]);
    expect(s.hp).toBe(35 - 30);
    expect(s.lastHit).toEqual({ damage: 10, crit: false, quick: false });
  });

  it('spawns Mini Muddle when the big boss falls early', () => {
    // 10 easy questions: HP 70. Fast perfect play knocks it out early.
    const answers = Array.from({ length: 6 }, () => right(1000));
    const s = bossState(easy(10), answers);
    expect(s.bigBossBeaten).toBe(true);
    expect(s.phase).toBe(2);
    expect(s.hp).toBeGreaterThan(0);
    expect(s.hp).toBeLessThanOrEqual(s.maxHp);
  });

  it('flags the KO on the answer that knocked the big boss out', () => {
    const d = easy(10);
    let ko = -1;
    const answers: Answer[] = [];
    for (let i = 0; i < 10 && ko < 0; i++) {
      answers.push(right(1000));
      if (bossState(d, answers).koOnLast) ko = i;
    }
    expect(ko).toBeGreaterThan(0);
    const after = bossState(d, [...answers, right(1000)]);
    expect(after.koOnLast).toBe(false);
    expect(after.phase).toBe(2);
  });

  it('a KO on the last question wins without a phase 2', () => {
    // HP 35; two misses, then 10 + 10 + 15 (combo crit) = 35 on the final answer.
    const s = bossState(easy(5), [wrong(), wrong(), right(), right(), right()]);
    expect(s).toMatchObject({ phase: 1, hp: 0, defeated: true, bigBossBeaten: true, koOnLast: true });
  });

  it('too many wrong answers let the boss get away', () => {
    const s = bossState(easy(5), [right(), wrong(), wrong(), right(), wrong()]);
    expect(s.bigBossBeaten).toBe(false);
    expect(s.hp).toBe(15);
  });
});

describe('taunts', () => {
  it('has 10 gentle lines in both languages', () => {
    expect(TAUNTS).toHaveLength(10);
    for (const t of TAUNTS) expect(t.en && t.id).toBeTruthy();
  });

  it('picks a line from the saved roll', () => {
    expect(tauntFor(0)).toBe(TAUNTS[0]);
    expect(tauntFor(0.999)).toBe(TAUNTS[9]);
    expect(tauntFor(1)).toBe(TAUNTS[9]);
  });
});
