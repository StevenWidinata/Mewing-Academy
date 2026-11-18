import type { Question } from '../../../shared/types';

/** How many missed questions are kept for "Fix my mistakes". */
export const MAX_MISTAKES = 30;

/** Questions are generated, so ids differ; the same question has the same text and choices. */
export const mistakeKey = (q: Question) => `${q.topic}|${q.prompt.en}|${q.choices.map((c) => c.label.en).join('/')}`;

/** Pure: a wrong answer moves the question to the end (newest), keeping the newest MAX_MISTAKES. */
export function addMistake(list: Question[], q: Question): Question[] {
  const key = mistakeKey(q);
  return [...list.filter((x) => mistakeKey(x) !== key), q].slice(-MAX_MISTAKES);
}

/** Pure: a right answer removes the question from the list. */
export function removeMistake(list: Question[], q: Question): Question[] {
  const key = mistakeKey(q);
  return list.some((x) => mistakeKey(x) === key) ? list.filter((x) => mistakeKey(x) !== key) : list;
}
