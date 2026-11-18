import type { Difficulty, TopicId } from '../../../shared/types';
import type { SessionLog } from './sessions';

/** A level star needs one round at that level with at least this score... */
export const LEVEL_STAR_AT = 0.8;
/** ...and at least this many questions of the topic in that round. */
export const LEVEL_STAR_MIN = 5;

/** Per topic: which levels (1 Easy, 2 Medium, 3 Hard) have a star. */
export type LevelStars = Partial<Record<TopicId, Difficulty[]>>;

/** Pure: adds the stars a finished round earned. Returns the same object if nothing changed. */
export function addLevelStars(stars: LevelStars, session: Pick<SessionLog, 'difficulty' | 'topics'>): LevelStars {
  const d = session.difficulty;
  if (d == null) return stars; // mixed levels (Daily) do not count
  let next = stars;
  for (const [topic, tally] of Object.entries(session.topics) as [TopicId, { correct: number; total: number }][]) {
    if (tally.total < LEVEL_STAR_MIN || tally.correct / tally.total < LEVEL_STAR_AT) continue;
    const have = next[topic] ?? [];
    if (have.includes(d)) continue;
    next = { ...next, [topic]: [...have, d].sort() };
  }
  return next;
}

/** Pure: rebuilds stars from a play history (for saves made before stars existed). */
export function levelStarsFrom(sessions: SessionLog[]): LevelStars {
  return sessions.reduce<LevelStars>((acc, s) => addLevelStars(acc, s), {});
}
