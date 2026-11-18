import { NUMBER_LESSONS } from './lessonsNumbers';
import { WORLD_LESSONS } from './lessonsWorld';
import type { SpriteGroup, Text, TopicId } from './types';

/**
 * Real teaching content shown on the Lessons page BEFORE a kid plays the quiz.
 * Each topic has a short road of modules; each module has steps, and a step may
 * carry a little picture (SpriteGroup[]) or an example line. This is deliberately
 * separate from the question bank so the Lessons page teaches, and the quiz tests.
 */

/** Interactive pictures, one kind per topic (drawn by the frontend). */
export type FigureId =
  | 'tenframe' | 'apples' | 'hopper' | 'clock' | 'week' | 'pattern' | 'corners'
  | 'mixer' | 'legs' | 'letters' | 'plate' | 'bodymap' | 'weather' | 'vehicles' | 'seesaw' | 'faces' | 'planets';

/** Small per-lesson settings for a figure, e.g. { hour: 3 } or { op: 'minus' }. */
export type FigureConfig = Record<string, string | number>;

/** "Want to know more?": one extra fact with a picture or figure. */
export interface LessonMore {
  text: Text;
  emoji?: string;
  figure?: FigureId;
  config?: FigureConfig;
}

/** "Try it yourself!": a hands-on page with an interactive figure. */
export interface LessonTry {
  figure: FigureId;
  prompt: Text;
  config?: FigureConfig;
}

export interface LessonStep {
  text: Text;
  visual?: SpriteGroup[];
  example?: Text;
  /** Big picture for the step (when there is no sprite visual). */
  emoji?: string;
  /** What "Read to me" says, if it should differ from `text` (e.g. spelled-out symbols). */
  narration?: Text;
  /** Extra detail for curious kids, behind a "Want to know more?" button. */
  more?: LessonMore;
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
  /** Hands-on page shown after the steps. */
  tryIt?: LessonTry;
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
