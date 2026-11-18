import { useSyncExternalStore } from 'react';
import type { Question, TopicId } from '../../../shared/types';
import { addToBag, itemsForSession, welcomeGift, type Bag } from '../lib/bag';
import { addLevelStars, levelStarsFrom, type LevelStars } from '../lib/levelStars';
import { addMistake, removeMistake } from '../lib/mistakes';
import { MAX_SESSIONS, type SessionLog } from '../lib/sessions';
import { withEarnedStickers, type StickerId } from '../lib/stickers';
import { addPlayDay, nextStreak } from '../lib/weekly';
import { HAND_BONUS_EVERY, unlockKeys } from './rewards';

export interface Progress {
  stars: number;
  byTopic: Partial<Record<TopicId, { correct: number; total: number }>>;
  lastPlayed: string | null; // YYYY-MM-DD
  streak: number;
  lastDaily: string | null; // YYYY-MM-DD of the last finished Daily Challenge
  /** Finished rounds, newest last (for the parent dashboard). */
  sessions: SessionLog[];
  /** Missed questions to practise again in "Fix my mistakes" (oldest first). */
  mistakes: Question[];
  /** Right answers given with the camera (Hand Hero). */
  handAnswers: number;
  /** World map: levels cleared with 80%+ per topic. */
  levelStars: LevelStars;
  /** Days with at least one answer (newest last), for the weekly goal. */
  playDays: string[];
  /** Monday of the week whose streak shield was used. */
  shieldWeek: string | null;
  /** Sticker book achievements earned, in order. */
  stickers: StickerId[];
  /** Items earned by finishing rounds, spent in the closet shop. */
  bag: Bag;
}

const KEY = 'mewing.progress.v1';
const EMPTY: Progress = { stars: 0, byTopic: {}, lastPlayed: null, streak: 0, lastDaily: null, sessions: [], mistakes: [], handAnswers: 0, levelStars: {}, playDays: [], shieldWeek: null, stickers: [], bag: {} };

/** Set when an older save got its one-time welcome gift on this load (shown as a pop-up). */
let gotWelcomeGift = false;

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Progress>;
      const merged = { ...EMPTY, ...saved };
      // Saves from before level stars existed: rebuild them from the history.
      if (!saved.levelStars) merged.levelStars = levelStarsFrom(merged.sessions);
      // ...and play days for the weekly goal.
      if (!saved.playDays) {
        merged.playDays = merged.sessions.reduce<string[]>((days, s) => addPlayDay(days, s.at.slice(0, 10)), []);
        if (merged.lastPlayed) merged.playDays = addPlayDay(merged.playDays, merged.lastPlayed);
      }
      // ...and stickers already earned (quietly, without a pop-up for each).
      if (!saved.stickers) merged.stickers = withEarnedStickers({ ...merged, stickers: [] });
      // ...and a welcome gift of bag items for play from before the shop existed.
      if (!saved.bag) {
        merged.bag = welcomeGift(merged.byTopic, merged.sessions.filter((s) => s.mode === 'daily').length);
        gotWelcomeGift = Object.keys(merged.bag).length > 0;
      }
      return merged;
    }
  } catch {
    /* ignore */
  }
  return EMPTY;
}

let current = read();
const listeners = new Set<() => void>();

// Queue of newly earned rewards, shown one by one as pop-ups.
let toasts: string[] = gotWelcomeGift ? ['welcome:gift'] : [];
if (gotWelcomeGift) {
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}
const toastListeners = new Set<() => void>();

function write(raw: Progress) {
  const next = { ...raw, stickers: withEarnedStickers(raw) };
  const before = new Set(unlockKeys(current));
  current = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
  const fresh = unlockKeys(next).filter((k) => !before.has(k));
  if (fresh.length) {
    toasts = [...toasts, ...fresh];
    toastListeners.forEach((l) => l());
  }
}

export const today = () => new Date().toISOString().slice(0, 10);

export function recordAnswer(topic: TopicId, correct: boolean, byHand = false) {
  const prev = current;
  // Hand Hero: every HAND_BONUS_EVERY right camera answers earn 1 bonus star.
  const handAnswers = prev.handAnswers + (correct && byHand ? 1 : 0);
  const handBonus = handAnswers > prev.handAnswers && handAnswers % HAND_BONUS_EVERY === 0 ? 1 : 0;
  const topicStats = prev.byTopic[topic] ?? { correct: 0, total: 0 };
  const now = today();
  const { streak, shieldWeek } = nextStreak(prev, now);
  write({
    ...prev,
    stars: prev.stars + (correct ? 1 : 0) + handBonus,
    handAnswers,
    byTopic: { ...prev.byTopic, [topic]: { correct: topicStats.correct + (correct ? 1 : 0), total: topicStats.total + 1 } },
    lastPlayed: now,
    streak,
    shieldWeek,
    playDays: addPlayDay(prev.playDays, now),
  });
}

/** Saves a finished round (keeps the newest MAX_SESSIONS) and returns the bag items it earned. */
export function recordSession(session: Omit<SessionLog, 'at'>): Bag {
  if (!session.total) return {};
  const entry: SessionLog = { ...session, at: new Date().toISOString() };
  const loot = itemsForSession(entry);
  write({
    ...current,
    sessions: [...current.sessions, entry].slice(-MAX_SESSIONS),
    levelStars: addLevelStars(current.levelStars, entry),
    bag: addToBag(current.bag, loot),
  });
  return loot;
}

/** Wrong answers are kept to practise later; a right answer clears that question. */
export function trackMistake(q: Question, correct: boolean) {
  const next = correct ? removeMistake(current.mistakes, q) : addMistake(current.mistakes, q);
  if (next !== current.mistakes) write({ ...current, mistakes: next });
}

/** Stickers earned by an event rather than by saved progress (e.g. beating the boss). */
export function earnSticker(id: StickerId) {
  if (current.stickers.includes(id)) return;
  write({ ...current, stickers: [...current.stickers, id] });
}

export const DAILY_BONUS = 2;

/** Marks today's Daily Challenge as done. Bonus stars only once per day. */
export function completeDaily(): boolean {
  if (current.lastDaily === today()) return false;
  write({ ...current, stars: current.stars + DAILY_BONUS, lastDaily: today() });
  return true;
}

export function resetProgress() {
  write(EMPTY);
}

export function dismissToast() {
  toasts = toasts.slice(1);
  toastListeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const subscribeToasts = (cb: () => void) => {
  toastListeners.add(cb);
  return () => {
    toastListeners.delete(cb);
  };
};

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => current);
}

export function useToasts(): string[] {
  return useSyncExternalStore(subscribeToasts, () => toasts);
}
