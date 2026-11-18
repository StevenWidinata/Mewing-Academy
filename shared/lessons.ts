import { NUMBER_LESSONS } from './lessonsNumbers';
import { MORE_LESSONS } from './moreTopics';
import type { ColorId, SpriteGroup, Text, TopicId } from './types';

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

const g = (sprite: SpriteGroup['sprite'], color: ColorId, count: number): SpriteGroup => ({ sprite, color, count });

export const LESSONS: Record<LessonTopic, LessonModule[]> = {
  colors: [
    {
      id: 'color-1',
      title: { en: '1. Name the Colors', id: '1. Mengenal Warna' },
      goal: { en: 'Learn 6 colors.', id: 'Mengenal 6 warna.' },
      steps: [
        {
          text: { en: 'These are red, blue, green, yellow, purple and orange.', id: 'Ini merah, biru, hijau, kuning, ungu, dan oranye.' },
          visual: [g('ball', 'red', 1), g('ball', 'blue', 1), g('ball', 'green', 1), g('ball', 'yellow', 1)],
        },
      ],
    },
    {
      id: 'color-2',
      title: { en: '2. Colors Around Us', id: '2. Warna di Sekitar Kita' },
      goal: { en: 'Match colors to things.', id: 'Mencocokkan warna dengan benda.' },
      steps: [
        {
          text: { en: 'Grass is green, the sun is yellow, the sky is blue.', id: 'Rumput hijau, matahari kuning, langit biru.' },
        },
      ],
    },
    {
      id: 'color-3',
      title: { en: '3. Mixing Colors', id: '3. Mencampur Warna' },
      goal: { en: 'Make new colors.', id: 'Membuat warna baru.' },
      steps: [
        {
          text: { en: 'Red + yellow = orange. Blue + yellow = green. Red + blue = purple.', id: 'Merah + kuning = oranye. Biru + kuning = hijau. Merah + biru = ungu.' },
          visual: [g('ball', 'red', 1), g('ball', 'yellow', 1), g('ball', 'orange', 1)],
        },
      ],
    },
  ],
  animals: [
    {
      id: 'animal-1',
      title: { en: '1. Animal Sounds', id: '1. Suara Hewan' },
      goal: { en: 'Match sounds to animals.', id: 'Mencocokkan suara dengan hewan.' },
      steps: [
        {
          text: { en: 'A cow says Moo 🐄. A cat says Meow 🐱. A dog says Woof 🐶.', id: 'Sapi "Moo" 🐄. Kucing "Meong" 🐱. Anjing "Guk" 🐶.' },
        },
      ],
    },
    {
      id: 'animal-2',
      title: { en: '2. Where Animals Live', id: '2. Tempat Tinggal Hewan' },
      goal: { en: 'Water, land, or sky?', id: 'Air, darat, atau langit?' },
      steps: [
        {
          text: { en: 'Fish live in water 🌊. Birds can fly in the sky 🐦. Cows live on land 🌳.', id: 'Ikan di air 🌊. Burung terbang di langit 🐦. Sapi di darat 🌳.' },
        },
      ],
    },
    {
      id: 'animal-3',
      title: { en: '3. Fun Facts', id: '3. Fakta Seru' },
      goal: { en: 'Amazing animal facts.', id: 'Fakta hewan yang menakjubkan.' },
      steps: [
        {
          text: { en: 'Spiders have 8 legs. Elephants are the biggest land animal.', id: 'Laba-laba 8 kaki. Gajah hewan darat terbesar.' },
        },
      ],
    },
  ],
  letters: [
    {
      id: 'letter-1',
      title: { en: '1. The Alphabet', id: '1. Alfabet' },
      goal: { en: '26 letters, A to Z.', id: '26 huruf, A sampai Z.' },
      steps: [
        {
          text: { en: 'The alphabet starts A, B, C, D... and ends ...X, Y, Z.', id: 'Alfabet mulai A, B, C, D... dan berakhir ...X, Y, Z.' },
        },
      ],
    },
    {
      id: 'letter-2',
      title: { en: '2. First Letters', id: '2. Huruf Awal' },
      goal: { en: 'Hear the first sound.', id: 'Mendengar bunyi pertama.' },
      steps: [
        {
          text: { en: '"Apple" starts with A. "Ball" starts with B. "Cat" starts with C.', id: '"Apple" diawali A. "Ball" diawali B. "Cat" diawali C.' },
        },
      ],
    },
    {
      id: 'letter-3',
      title: { en: '3. Vowels', id: '3. Huruf Vokal' },
      goal: { en: 'The 5 special letters.', id: '5 huruf istimewa.' },
      steps: [
        {
          text: { en: 'The vowels are A, E, I, O, U. Almost every word has one!', id: 'Huruf vokal: A, I, U, E, O. Hampir setiap kata punya satu!' },
        },
      ],
    },
  ],
  ...MORE_LESSONS,
  ...NUMBER_LESSONS,
};

export function getLessons(topic: LessonTopic): LessonModule[] {
  return LESSONS[topic];
}
