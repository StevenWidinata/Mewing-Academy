import { TOPICS, type Text, type TopicId } from '../../../shared/types';
import type { LevelStars } from './levelStars';

/** One clear suggestion for the Home page. Pure, so it is unit tested. */
export interface NextStep {
  kind: 'first' | 'mistakes' | 'daily' | 'continue' | 'level' | 'island' | 'memory';
  to: string;
  emoji: string;
  title: Text;
  text: Text;
}

export interface NextStepInput {
  byTopic: Partial<Record<TopicId, { correct: number; total: number }>>;
  lastDaily: string | null;
  mistakes: number;
  levelStars: LevelStars;
  today: string;
}

/** Right answers that clear an island (the bronze badge). */
const CLEAR_AT = 5;
/** Enough misses to make fixing them the best next step. */
const MISTAKES_FIRST = 3;
const LEVEL_NAME: Record<1 | 2 | 3, Text> = {
  1: { en: 'Easy', id: 'Mudah' },
  2: { en: 'Medium', id: 'Sedang' },
  3: { en: 'Hard', id: 'Sulit' },
};

export function nextStep({ byTopic, lastDaily, mistakes, levelStars, today }: NextStepInput): NextStep {
  const started = TOPICS.filter((t) => (byTopic[t.id]?.total ?? 0) > 0);

  if (started.length === 0 && !byTopic.memory) {
    const first = TOPICS[0];
    return {
      kind: 'first',
      to: `/lessons/${first.id}`,
      emoji: first.emoji,
      title: { en: `Start with ${first.title.en}!`, id: `Mulai dengan ${first.title.id}!` },
      text: { en: 'A short lesson, then a game. Mewy will help!', id: 'Pelajaran singkat, lalu main. Mewy akan membantu!' },
    };
  }

  if (mistakes >= MISTAKES_FIRST) {
    return {
      kind: 'mistakes',
      to: '/review',
      emoji: '🔧',
      title: { en: 'Fix your mistakes', id: 'Perbaiki kesalahanmu' },
      text: { en: `${mistakes} questions are waiting for a second try.`, id: `${mistakes} soal menunggu dicoba lagi.` },
    };
  }

  if (lastDaily !== today) {
    return {
      kind: 'daily',
      to: '/daily',
      emoji: '📅',
      title: { en: "Today's Daily Challenge", id: 'Tantangan Harian hari ini' },
      text: { en: '5 quick questions for +2 bonus stars.', id: '5 soal cepat untuk +2 bintang bonus.' },
    };
  }

  // Started but not cleared yet: the one with the lowest score needs the most help.
  const unfinished = started
    .filter((t) => (byTopic[t.id]?.correct ?? 0) < CLEAR_AT)
    .sort((a, b) => score(byTopic, a.id) - score(byTopic, b.id));
  if (unfinished.length) {
    const t = unfinished[0];
    const left = CLEAR_AT - (byTopic[t.id]?.correct ?? 0);
    return {
      kind: 'continue',
      to: `/quiz?topic=${t.id}`,
      emoji: t.emoji,
      title: { en: `Keep going: ${t.title.en}`, id: `Lanjutkan: ${t.title.id}` },
      text: { en: `${left} more right answers to plant your flag 🚩`, id: `${left} jawaban benar lagi untuk menancapkan bendera 🚩` },
    };
  }

  // A cleared island with a level star still to win.
  for (const t of started) {
    const have = levelStars[t.id] ?? [];
    const level = ([1, 2, 3] as const).find((d) => !have.includes(d));
    if (level && have.length > 0) {
      return {
        kind: 'level',
        to: `/quiz?topic=${t.id}`,
        emoji: '⭐',
        title: { en: `Win the ${LEVEL_NAME[level].en} star in ${t.title.en}`, id: `Raih bintang ${LEVEL_NAME[level].id} di ${t.title.id}` },
        text: { en: 'Score 80% or more in one round.', id: 'Dapatkan nilai 80% atau lebih dalam satu ronde.' },
      };
    }
  }

  const fresh = TOPICS.find((t) => !started.includes(t));
  if (fresh) {
    return {
      kind: 'island',
      to: `/lessons/${fresh.id}`,
      emoji: fresh.emoji,
      title: { en: `New island: ${fresh.title.en}`, id: `Pulau baru: ${fresh.title.id}` },
      text: { en: fresh.blurb.en, id: fresh.blurb.id },
    };
  }

  // Everything cleared: keep the brain warm with a level star or Memory.
  for (const t of TOPICS) {
    const level = ([1, 2, 3] as const).find((d) => !(levelStars[t.id] ?? []).includes(d));
    if (level) {
      return {
        kind: 'level',
        to: `/quiz?topic=${t.id}`,
        emoji: '⭐',
        title: { en: `Win the ${LEVEL_NAME[level].en} star in ${t.title.en}`, id: `Raih bintang ${LEVEL_NAME[level].id} di ${t.title.id}` },
        text: { en: 'Score 80% or more in one round.', id: 'Dapatkan nilai 80% atau lebih dalam satu ronde.' },
      };
    }
  }
  return {
    kind: 'memory',
    to: '/memory',
    emoji: '🧠',
    title: { en: 'Train your memory', id: 'Latih ingatanmu' },
    text: { en: 'You have every star! Can you beat Memory on Hard?', id: 'Kamu punya semua bintang! Bisakah kamu menang di Ingatan tingkat Sulit?' },
  };
}

function score(byTopic: NextStepInput['byTopic'], t: TopicId): number {
  const s = byTopic[t];
  return s && s.total ? s.correct / s.total : 0;
}
