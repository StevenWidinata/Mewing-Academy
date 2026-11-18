import { describe, expect, it } from 'vitest';
import { addLevelStars, levelStarsFrom } from './levelStars';
import type { SessionLog } from './sessions';

const s = (difficulty: SessionLog['difficulty'], correct: number, total: number, topic = 'math'): SessionLog => ({
  at: '2026-11-18T10:00:00Z',
  mode: 'quiz',
  difficulty,
  correct,
  total,
  byHand: 0,
  topics: { [topic]: { correct, total } },
});

describe('level stars on the world map', () => {
  it('earns a star for a round of 80% or better at that level', () => {
    expect(addLevelStars({}, s(1, 4, 5))).toEqual({ math: [1] });
    expect(addLevelStars({}, s(2, 3, 5))).toEqual({});
  });

  it('needs at least 5 questions and a single level', () => {
    expect(addLevelStars({}, s(1, 3, 3))).toEqual({});
    expect(addLevelStars({}, s(null, 5, 5))).toEqual({});
  });

  it('keeps stars sorted, without duplicates, and returns the same object when nothing changes', () => {
    const one = addLevelStars({}, s(3, 10, 10));
    const two = addLevelStars(one, s(1, 5, 5));
    expect(two).toEqual({ math: [1, 3] });
    expect(addLevelStars(two, s(1, 5, 5))).toBe(two);
  });

  it('rebuilds from history', () => {
    expect(levelStarsFrom([s(1, 5, 5), s(2, 9, 10, 'colors'), s(3, 1, 5)])).toEqual({ math: [1], colors: [2] });
  });
});
