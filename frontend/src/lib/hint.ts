import type { Question } from '../../../shared/types';

/** Hints a kid gets in one quiz round. */
export const HINTS_PER_ROUND = 1;

/**
 * The wrong choice a hint crosses out, picked by a 0..1 roll. Null when a hint
 * would give the answer away (two choices or fewer).
 */
export function pickHiddenChoice(question: Question, roll: number): number | null {
  if (question.choices.length <= 2) return null;
  const wrong = question.choices.map((_, i) => i).filter((i) => i !== question.answer);
  return wrong[Math.min(wrong.length - 1, Math.floor(Math.max(0, roll) * wrong.length))];
}
