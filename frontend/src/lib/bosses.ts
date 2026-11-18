import type { Text } from '../../../shared/types';
import { TAUNTS } from './boss';

/** The 5 Hand Quiz bosses: Muddle the slime and the 4 team-photo bosses. */

export type BossId = 'muddle' | 'goat' | 'nel' | 'bulepotan' | 'gembel';

export interface BossInfo {
  id: BossId;
  name: Text;
  /** Photo path under the app base; Muddle is drawn as pixel art instead. */
  photo?: string;
  /** Where the eyes are in the photo (fractions), for the 😎 shades. */
  eyes?: { x: number; y: number; w: number };
  taunts: Text[];
  /** What the boss says when knocked out. */
  ko: Text;
}

const T = (en: string, id: string): Text => ({ en, id });

export const BOSSES: Record<BossId, BossInfo> = {
  muddle: {
    id: 'muddle',
    name: T('Muddle Slime', 'Slime Bingung'),
    taunts: TAUNTS,
    ko: T('Blub blub... the slime melts away!', 'Blub blub... slimenya meleleh!'),
  },
  goat: {
    id: 'goat',
    name: T('AI Goat', 'AI Goat'),
    photo: 'bosses/goat.webp',
    eyes: { x: 0.53, y: 0.5, w: 0.42 },
    taunts: [
      T('Beep boop! My AI says try again!', 'Bip bup! AI-ku bilang coba lagi!'),
      T('The GOAT is still standing!', 'Sang GOAT masih berdiri!'),
      T('Calculating... nope, missed me!', 'Menghitung... nggak kena!'),
    ],
    ko: T('Error 404: GOAT not found... you win!', 'Error 404: GOAT tidak ditemukan... kamu menang!'),
  },
  nel: {
    id: 'nel',
    name: T('son of nel', 'son of nel'),
    photo: 'bosses/nel.webp',
    eyes: { x: 0.5, y: 0.31, w: 0.62 },
    taunts: [
      T('Son of nel says: not today!', 'Son of nel bilang: belum hari ini!'),
      T('Hehe, too slow, buddy!', 'Hehe, kurang cepat, kawan!'),
      T('Nel taught me how to dodge!', 'Nel mengajariku menghindar!'),
    ],
    ko: T("I'm telling Nel you beat me!", 'Aku lapor Nel kamu mengalahkanku!'),
  },
  bulepotan: {
    id: 'bulepotan',
    name: T('orang bulepotan', 'orang bulepotan'),
    photo: 'bosses/bulepotan.webp',
    eyes: { x: 0.52, y: 0.45, w: 0.72 },
    taunts: [
      T("I'm messy, but I'm still strong!", 'Aku belepotan, tapi masih kuat!'),
      T('Splat! Missed me!', 'Ciprat! Nggak kena!'),
      T('Wipe your eyes and try again!', 'Lap matamu dan coba lagi!'),
    ],
    ko: T("Now I'm even messier... you win!", 'Sekarang aku makin belepotan... kamu menang!'),
  },
  gembel: {
    id: 'gembel',
    name: T('gembel jalanan', 'gembel jalanan'),
    photo: 'bosses/gembel.webp',
    eyes: { x: 0.57, y: 0.34, w: 0.66 },
    taunts: [
      T('My pockets are empty, but you missed!', 'Kantongku kosong, tapi kamu meleset!'),
      T('Street smarts win this time!', 'Pintar jalanan menang kali ini!'),
      T("Try again, I'm not going anywhere!", 'Coba lagi, aku nggak ke mana-mana!'),
    ],
    ko: T("Okay okay, I'm going home now!", 'Oke oke, aku pulang sekarang!'),
  },
};

export const ALL_BOSSES = Object.keys(BOSSES) as BossId[];
export const FACE_BOSSES = ALL_BOSSES.filter((id) => BOSSES[id].photo);

const pick = <T,>(list: T[], rng: () => number) => list[Math.min(list.length - 1, Math.floor(rng() * list.length))];

/** The main boss of a round: any of the 5, never the same as last round. */
export function pickBoss(last: BossId | null, rng: () => number = Math.random): BossId {
  return pick(
    ALL_BOSSES.filter((id) => id !== last),
    rng,
  );
}

/** The boss that jumps in after an early knock-out: always another face boss. */
export function pickSecondBoss(main: BossId, rng: () => number = Math.random): BossId {
  return pick(
    FACE_BOSSES.filter((id) => id !== main),
    rng,
  );
}

/** One of this boss's taunts, chosen by the answer's saved random roll. */
export const bossTaunt = (boss: BossInfo, roll: number) => pick(boss.taunts, () => roll);

// ---- remember the last main boss so the next round is different ----
const LAST_KEY = 'mewing.lastBoss';

export function readLastBoss(): BossId | null {
  try {
    const v = localStorage.getItem(LAST_KEY) as BossId | null;
    return v && v in BOSSES ? v : null;
  } catch {
    return null;
  }
}

export function saveLastBoss(id: BossId) {
  try {
    localStorage.setItem(LAST_KEY, id);
  } catch {
    /* private mode: fine */
  }
}
