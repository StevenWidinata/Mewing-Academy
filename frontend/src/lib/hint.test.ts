import { describe, expect, it } from 'vitest';
import type { Question } from '../../../shared/types';
import { pickHiddenChoice } from './hint';

const q = (choices: number, answer: number): Question => ({
  id: 'q',
  topic: 'colors',
  difficulty: 1,
  prompt: { en: 'Q', id: 'Q' },
  choices: Array.from({ length: choices }, (_, i) => ({ label: { en: `${i}`, id: `${i}` } })),
  answer,
});

describe('pickHiddenChoice', () => {
  it('never hides the right answer', () => {
    for (let answer = 0; answer < 4; answer++) {
      for (const roll of [0, 0.2, 0.34, 0.5, 0.67, 0.99, 1]) {
        const hidden = pickHiddenChoice(q(4, answer), roll);
        expect(hidden).not.toBe(answer);
        expect(hidden).toBeGreaterThanOrEqual(0);
        expect(hidden).toBeLessThan(4);
      }
    }
  });

  it('can hide every wrong choice', () => {
    const seen = new Set([0, 0.4, 0.8].map((roll) => pickHiddenChoice(q(4, 1), roll)));
    expect([...seen].sort()).toEqual([0, 2, 3]);
  });

  it('gives no hint with two choices, so it never shows the answer', () => {
    expect(pickHiddenChoice(q(2, 0), 0.5)).toBeNull();
  });
});
