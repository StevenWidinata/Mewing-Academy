import { NUMBER_LESSONS } from './lessonsNumbers';
import { WORLD_LESSONS } from './lessonsWorld';
import type { SpriteGroup, Text, TopicId } from './types';

/**
 * Real teaching content shown on the Lessons page BEFORE a kid plays the quiz.
 * Each topic has a short road of modules; each module has steps, and a step may
 * carry a little picture (SpriteGroup[]) or an example line. This is deliberately
 * separate from the question bank so the Lessons page teaches, and the quiz tests.
 */

export interface LessonStep {
  text: Text;
  visual?: SpriteGroup[];
  example?: Text;
  /** Big picture for the step (when there is no sprite visual). */
  emoji?: string;
  /** What "Read to me" says, if it should differ from `text` (e.g. spelled-out symbols). */
  narration?: Text;
}

/** A mix-up kids often make, shown as ❌ wrong vs ✅ right. */
export interface LessonMistake {
  wrong: Text;
  right: Text;
  why: Text;
}

/** One quick question at the end of a module. `answer` indexes `choices`. */
export interface LessonCheck {
  prompt: Text;
  choices: Text[];
  answer: number;
}

export interface LessonModule {
  id: string;
  title: Text;
  goal: Text;
  steps: LessonStep[];
  mistakes?: LessonMistake[];
  check?: LessonCheck;
}

export type LessonTopic = Exclude<TopicId, 'memory'>;

/** Every topic's lesson road: number topics + world topics. */
export const LESSONS: Record<LessonTopic, LessonModule[]> = {
  ...NUMBER_LESSONS,
  ...WORLD_LESSONS,
};

export function getLessons(topic: LessonTopic): LessonModule[] {
  return LESSONS[topic];
}
