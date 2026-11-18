import type { Text } from '../../../shared/types';

/** Mewy grows up with the child's best day streak ever (it never shrinks again). */

export type StageId = 'baby' | 'kitten' | 'teen' | 'adult' | 'legend';

export interface Stage {
  id: StageId;
  /** Best streak needed. */
  min: number;
  emoji: string;
  name: Text;
  /** Drawing size compared with today's kitten. */
  scale: number;
}

export const STAGES: Stage[] = [
  { id: 'baby', min: 0, emoji: '🍼', name: { en: 'Baby Kitten', id: 'Bayi Kucing' }, scale: 0.82 },
  { id: 'kitten', min: 3, emoji: '🐱', name: { en: 'Kitten', id: 'Anak Kucing' }, scale: 1 },
  { id: 'teen', min: 7, emoji: '😺', name: { en: 'Teen Cat', id: 'Kucing Remaja' }, scale: 1.08 },
  { id: 'adult', min: 14, emoji: '🐈', name: { en: 'Grown-up Cat', id: 'Kucing Dewasa' }, scale: 1.16 },
  { id: 'legend', min: 30, emoji: '✨', name: { en: 'Legend Cat', id: 'Kucing Legenda' }, scale: 1.24 },
];

export function stageFor(bestStreak: number): Stage {
  let s = STAGES[0];
  for (const st of STAGES) if (bestStreak >= st.min) s = st;
  return s;
}

export function nextStage(bestStreak: number): Stage | null {
  return STAGES.find((st) => bestStreak < st.min) ?? null;
}
