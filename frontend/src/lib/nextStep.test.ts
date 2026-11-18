import { describe, expect, it } from 'vitest';
import { TOPICS } from '../../../shared/types';
import { nextStep, type NextStepInput } from './nextStep';

const base: NextStepInput = { byTopic: {}, lastDaily: null, mistakes: 0, levelStars: {}, today: '2026-11-18' };

describe('what to do next', () => {
  it('sends a brand-new player to the first lesson', () => {
    expect(nextStep(base)).toMatchObject({ kind: 'first', to: '/lessons/counting' });
  });

  it('puts 3+ mistakes before the daily challenge', () => {
    const played = { ...base, byTopic: { math: { correct: 1, total: 4 } } };
    expect(nextStep({ ...played, mistakes: 3 }).kind).toBe('mistakes');
    expect(nextStep({ ...played, mistakes: 2 }).kind).toBe('daily');
  });

  it('then the weakest unfinished topic', () => {
    const r = nextStep({
      ...base,
      lastDaily: base.today,
      byTopic: { math: { correct: 4, total: 5 }, colors: { correct: 1, total: 5 } },
    });
    expect(r).toMatchObject({ kind: 'continue', to: '/quiz?topic=colors' });
    expect(r.text.en).toContain('4 more');
  });

  it('then a missing level star, then a new island', () => {
    const done = { ...base, lastDaily: base.today, byTopic: { math: { correct: 9, total: 10 } } };
    expect(nextStep({ ...done, levelStars: { math: [1] } })).toMatchObject({ kind: 'level', to: '/quiz?topic=math' });
    expect(nextStep({ ...done, levelStars: { math: [1, 2, 3] } })).toMatchObject({ kind: 'island', to: '/lessons/counting' });
  });

  it('suggests Memory once every star is won', () => {
    const all = Object.fromEntries(TOPICS.map((t) => [t.id, { correct: 30, total: 30 }]));
    const stars = Object.fromEntries(TOPICS.map((t) => [t.id, [1, 2, 3]]));
    expect(nextStep({ ...base, lastDaily: base.today, byTopic: all, levelStars: stars }).kind).toBe('memory');
  });
});
