import type { Difficulty, TopicId } from '../../../shared/types';

/** One finished round, kept so grown-ups can see progress over time. */
export type SessionMode = 'quiz' | 'daily' | 'memory' | 'review';

export interface TopicTally {
  correct: number;
  total: number;
}

export interface SessionLog {
  /** ISO time the round finished. */
  at: string;
  mode: SessionMode;
  /** Level of the round; null when questions had mixed levels (Daily). */
  difficulty: Difficulty | null;
  correct: number;
  total: number;
  /** How many answers were given with the camera (hand gestures). */
  byHand: number;
  /** Per-topic breakdown (Daily mixes topics). */
  topics: Partial<Record<TopicId, TopicTally>>;
}

export interface SessionItem {
  topic: TopicId;
  difficulty: Difficulty;
  correct: boolean;
  byHand: boolean;
}

export const MAX_SESSIONS = 300;

/** Pure: turns a round's answers into a session record (without the time). */
export function buildSession(mode: SessionMode, items: SessionItem[]): Omit<SessionLog, 'at'> {
  const topics: SessionLog['topics'] = {};
  for (const it of items) {
    const t = (topics[it.topic] ??= { correct: 0, total: 0 });
    t.total += 1;
    if (it.correct) t.correct += 1;
  }
  const levels = new Set(items.map((i) => i.difficulty));
  return {
    mode,
    difficulty: levels.size === 1 ? [...levels][0] : null,
    correct: items.filter((i) => i.correct).length,
    total: items.length,
    byHand: items.filter((i) => i.byHand).length,
    topics,
  };
}
