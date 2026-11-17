import { describe, expect, it } from 'vitest';
import { buildSession, type SessionItem } from './sessions';

const item = (topic: SessionItem['topic'], correct: boolean, byHand = false, difficulty: SessionItem['difficulty'] = 1): SessionItem => ({
  topic,
  difficulty,
  correct,
  byHand,
});

describe('buildSession', () => {
  it('totals a single-topic quiz round', () => {
    const s = buildSession('quiz', [item('counting', true, true), item('counting', false), item('counting', true, true)]);
    expect(s).toEqual({
      mode: 'quiz',
      difficulty: 1,
      correct: 2,
      total: 3,
      byHand: 2,
      topics: { counting: { correct: 2, total: 3 } },
    });
  });

  it('breaks a mixed Daily round down per topic, with no single level', () => {
    const s = buildSession('daily', [item('colors', true, false, 1), item('math', false, false, 2), item('colors', false, false, 1)]);
    expect(s.difficulty).toBeNull();
    expect(s.topics).toEqual({ colors: { correct: 1, total: 2 }, math: { correct: 0, total: 1 } });
  });

  it('handles an empty round', () => {
    expect(buildSession('memory', [])).toMatchObject({ correct: 0, total: 0, byHand: 0, topics: {} });
  });
});
