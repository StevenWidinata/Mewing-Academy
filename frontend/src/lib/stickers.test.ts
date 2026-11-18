import { describe, expect, it } from 'vitest';
import type { Progress } from '../state/progress';
import { STICKERS, hasLightningRun, timeSticker, withEarnedStickers } from './stickers';

const empty: Progress = {
  stars: 0,
  byTopic: {},
  lastPlayed: null,
  streak: 0,
  lastDaily: null,
  sessions: [],
  mistakes: [],
  handAnswers: 0,
  levelStars: {},
  playDays: [],
  shieldWeek: null,
  stickers: [],
  bag: {},
  owned: [],
  buyHints: [],
  fixedCount: 0,
  lessonsDone: [],
  tutorQuestions: 0,
  purchases: 0,
  bestStreak: 0,
};

describe('sticker book', () => {
  it('has unique ids and bilingual names', () => {
    expect(new Set(STICKERS.map((s) => s.id)).size).toBe(STICKERS.length);
    for (const s of STICKERS) expect(s.name.en && s.name.id && s.how.en && s.how.id).toBeTruthy();
  });

  it('earns stickers from progress and keeps the same array when nothing is new', () => {
    expect(withEarnedStickers(empty)).toBe(empty.stickers);
    const p = { ...empty, stars: 1, streak: 3, playDays: ['2026-11-16', '2026-11-17', '2026-11-18'] };
    expect(withEarnedStickers(p)).toEqual(['first-star', 'streak-3', 'weekly']);
  });

  it('detects a perfect round and a Hard star', () => {
    const p: Progress = {
      ...empty,
      sessions: [{ at: '2026-11-18T09:00:00Z', mode: 'quiz', difficulty: 3, correct: 5, total: 5, byHand: 0, topics: {} }],
      levelStars: { math: [3] },
    };
    expect(withEarnedStickers(p)).toEqual(expect.arrayContaining(['perfect', 'hard-star']));
  });

  it('never re-adds or drops an earned sticker', () => {
    const p = { ...empty, stars: 5, stickers: ['boss-ko', 'first-star'] as Progress['stickers'] };
    expect(withEarnedStickers(p)).toBe(p.stickers);
  });

  it('topic-group prodigies need 85% over 30 answers', () => {
    const nums = { counting: { correct: 13, total: 15 }, math: { correct: 13, total: 15 } };
    expect(withEarnedStickers({ ...empty, byTopic: nums })).toContain('number-prodigy');
    expect(withEarnedStickers({ ...empty, byTopic: { math: { correct: 26, total: 29 } } })).not.toContain('number-prodigy');
    expect(withEarnedStickers({ ...empty, byTopic: { animals: { correct: 20, total: 30 }, space: { correct: 0, total: 0 } } })).not.toContain('nature-explorer');
  });

  it('Early Bird before 8, Night Owl only 18:00-19:59', () => {
    expect(timeSticker(7)).toBe('early-bird');
    expect(timeSticker(12)).toBeNull();
    expect(timeSticker(18)).toBe('night-owl');
    expect(timeSticker(20)).toBeNull();
  });

  it('Lightning Fingers needs 5 quick right answers in a row', () => {
    const q = { correct: true, ms: 2000 };
    expect(hasLightningRun([q, q, q, q, q])).toBe(true);
    expect(hasLightningRun([q, q, { correct: true, ms: 6000 }, q, q, q])).toBe(false);
    expect(hasLightningRun([q, q, q, q, { correct: false, ms: 100 }])).toBe(false);
  });

  it('counter badges', () => {
    const got = withEarnedStickers({ ...empty, fixedCount: 10, lessonsDone: Array.from({ length: 10 }, (_, i) => `l${i}`), tutorQuestions: 20, purchases: 1 });
    expect(got).toEqual(expect.arrayContaining(['comeback', 'bookworm', 'curious-cat', 'shopper']));
  });
});
