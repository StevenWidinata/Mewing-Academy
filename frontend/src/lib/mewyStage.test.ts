import { describe, expect, it } from 'vitest';
import { STAGES, nextStage, stageFor } from './mewyStage';

describe('Mewy growing up', () => {
  it('has 5 stages at 0, 3, 7, 14 and 30 days', () => {
    expect(STAGES.map((s) => s.min)).toEqual([0, 3, 7, 14, 30]);
  });

  it('picks the stage from the best streak', () => {
    expect(stageFor(0).id).toBe('baby');
    expect(stageFor(2).id).toBe('baby');
    expect(stageFor(3).id).toBe('kitten');
    expect(stageFor(13).id).toBe('teen');
    expect(stageFor(14).id).toBe('adult');
    expect(stageFor(99).id).toBe('legend');
  });

  it('knows the next stage, or none at the top', () => {
    expect(nextStage(5)?.id).toBe('teen');
    expect(nextStage(30)).toBeNull();
  });
});
