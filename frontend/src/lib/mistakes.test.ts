import { describe, expect, it } from 'vitest';
import type { Question } from '../../../shared/types';
import { addMistake, MAX_MISTAKES, removeMistake } from './mistakes';

const q = (n: number, id = `id-${n}`): Question => ({
  id,
  topic: 'math',
  difficulty: 1,
  prompt: { en: `${n} + 1 = ?`, id: `${n} + 1 = ?` },
  choices: [{ label: { en: String(n + 1), id: String(n + 1) } }, { label: { en: '0', id: '0' } }],
  answer: 0,
});

describe('fix my mistakes list', () => {
  it('adds misses once, newest last, even with a new random id', () => {
    let list = addMistake([], q(1));
    list = addMistake(list, q(2));
    list = addMistake(list, q(1, 'other-id'));
    expect(list.map((x) => x.prompt.en)).toEqual(['2 + 1 = ?', '1 + 1 = ?']);
  });

  it(`keeps only the newest ${MAX_MISTAKES}`, () => {
    let list: Question[] = [];
    for (let i = 0; i < MAX_MISTAKES + 5; i++) list = addMistake(list, q(i));
    expect(list).toHaveLength(MAX_MISTAKES);
    expect(list[0].prompt.en).toBe('5 + 1 = ?');
  });

  it('removes a question once it is answered right', () => {
    const list = addMistake(addMistake([], q(1)), q(2));
    expect(removeMistake(list, q(1, 'x')).map((x) => x.prompt.en)).toEqual(['2 + 1 = ?']);
    expect(removeMistake(list, q(9))).toBe(list);
  });
});
