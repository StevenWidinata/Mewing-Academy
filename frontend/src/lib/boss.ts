import type { Difficulty } from '../../../shared/types';

/**
 * Boss battle maths (pure, so it is unit tested and replays identically on
 * every render). A right answer deals damage:
 *
 *   base (by difficulty) x combo x quick x luck
 *
 * Boss HP is 70% of the round's total base damage, so a kid needs most
 * answers right. If the boss is knocked out before the last question, a
 * smaller "Mini Muddle" jumps out with HP sized to the questions left, so
 * there is always something to hit.
 */

export const BASE_DAMAGE: Record<Difficulty, number> = { 1: 10, 2: 15, 3: 20 };
export const COMBO_AT = 3; // right answers in a row for a critical hit
export const COMBO_X = 1.5;
export const QUICK_MS = 5000; // answer faster than this for a quick bonus
export const QUICK_X = 1.25;
export const LUCK_MIN = 0.8; // random spread: 0.8x .. 1.2x
export const LUCK_SPAN = 0.4;
export const HP_SHARE = 0.7;

/** What happened on one question. `roll` is a 0..1 random number saved at answer time. */
export interface Answer {
  correct: boolean;
  ms: number;
  roll: number;
  /** Answered with a hand gesture (camera) rather than a tap/key. */
  byHand?: boolean;
}

export interface Hit {
  damage: number;
  crit: boolean;
  quick: boolean;
}

export interface BossState {
  /** 1 = Muddle Slime, 2 = Mini Muddle. */
  phase: 1 | 2;
  hp: number;
  maxHp: number;
  /** Max HP of the big boss (phase 1), for showing its KO. */
  bigMaxHp: number;
  /** True once the boss of the current phase has 0 HP and no phase follows. */
  defeated: boolean;
  /** True if the big boss was knocked out (phase 2 reached or won outright). */
  bigBossBeaten: boolean;
  /** The last answer's hit, if it was right. */
  lastHit: Hit | null;
  /** The last answer knocked out the big boss (show the KO, then Mini Muddle). */
  koOnLast: boolean;
}

export function hitFor(difficulty: Difficulty, streak: number, answer: Answer): Hit {
  const crit = streak >= COMBO_AT;
  const quick = answer.ms < QUICK_MS;
  const luck = LUCK_MIN + LUCK_SPAN * Math.min(1, Math.max(0, answer.roll));
  const raw = BASE_DAMAGE[difficulty] * (crit ? COMBO_X : 1) * (quick ? QUICK_X : 1) * luck;
  return { damage: Math.max(1, Math.round(raw)), crit, quick };
}

/** HP for a boss that has these questions left to be fought with. */
export function hpFor(difficulties: Difficulty[]): number {
  const total = difficulties.reduce((sum, d) => sum + BASE_DAMAGE[d], 0);
  // Integer maths: 45 x 0.7 is 31.4999... in floating point, we want 32.
  return Math.max(1, Math.round((total * Math.round(HP_SHARE * 100)) / 100));
}

export function bossState(difficulties: Difficulty[], answers: Answer[]): BossState {
  let phase: 1 | 2 = 1;
  const bigMaxHp = hpFor(difficulties);
  let maxHp = bigMaxHp;
  let hp = maxHp;
  let defeated = false;
  let bigBossBeaten = false;
  let streak = 0;
  let lastHit: Hit | null = null;
  let koOnLast = false;

  answers.forEach((a, i) => {
    lastHit = null;
    koOnLast = false;
    if (!a.correct) {
      streak = 0;
      return;
    }
    streak += 1;
    const hit = hitFor(difficulties[i] ?? 1, streak, a);
    lastHit = hit;
    if (defeated) return; // victory lap: hits still show, nothing left to beat
    hp = Math.max(0, hp - hit.damage);
    if (hp > 0) return;
    if (phase === 1) {
      bigBossBeaten = true;
      koOnLast = true;
      const left = difficulties.slice(i + 1);
      if (left.length) {
        phase = 2;
        maxHp = hpFor(left);
        hp = maxHp;
        return;
      }
    }
    defeated = true;
  });

  return { phase, hp, maxHp, bigMaxHp, defeated, bigBossBeaten, lastHit, koOnLast };
}

/** Gentle, playful lines the slime says after a wrong answer (never mean). */
export const TAUNTS: { en: string; id: string }[] = [
  { en: 'Hehe, missed me! 😏', id: 'Hihi, nggak kena~ 😏' },
  { en: 'Come on, you can do better!', id: 'Ayo, kamu pasti bisa lebih baik!' },
  { en: 'So close!', id: 'Meleset sedikit!' },
  { en: "I'm still strong~", id: 'Aku masih kuat lho~' },
  { en: 'Think once more!', id: 'Coba pikir sekali lagi!' },
  { en: 'Almost!', id: 'Hampir saja!' },
  { en: 'Hehe, I dodged it!', id: 'Hehe, aku lolos!' },
  { en: "Don't give up!", id: 'Jangan menyerah ya!' },
  { en: "Your attack didn't reach me~", id: 'Seranganmu belum sampai~' },
  { en: 'This round is mine! 😝', id: 'Ronde ini punyaku! 😝' },
];

export const tauntFor = (roll: number) => TAUNTS[Math.min(TAUNTS.length - 1, Math.floor(roll * TAUNTS.length))];
