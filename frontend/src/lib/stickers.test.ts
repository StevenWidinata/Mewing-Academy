import { describe, expect, it } from 'vitest';
import type { Progress } from '../state/progress';
import { STICKERS, withEarnedStickers } from './stickers';

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
});
