import { describe, expect, it } from 'vitest';
import { BAG_ITEMS, BAG_KINDS, addToBag, amountFor, describeBag, itemsForSession, welcomeGift } from './bag';

const session = (mode: 'quiz' | 'daily' | 'memory' | 'review', correct: number, total: number, topics: Record<string, { correct: number; total: number }>) => ({
  mode,
  correct,
  total,
  topics,
});

describe('bag items', () => {
  it('has one item per topic plus crystals and tickets, in both languages', () => {
    expect(BAG_KINDS).toHaveLength(18);
    for (const k of BAG_KINDS) expect(BAG_ITEMS[k].name.en && BAG_ITEMS[k].name.id && BAG_ITEMS[k].emoji).toBeTruthy();
    expect(BAG_ITEMS.math.emoji).toBe('🧮');
  });

  it('gives 1 for finishing, 2 for 80%+, 3 for perfect', () => {
    expect(amountFor(0, 5)).toBe(1);
    expect(amountFor(3, 5)).toBe(1);
    expect(amountFor(4, 5)).toBe(2);
    expect(amountFor(5, 5)).toBe(3);
    expect(amountFor(0, 0)).toBe(0);
  });

  it('pays each mode in its own item', () => {
    expect(itemsForSession(session('quiz', 4, 5, { math: { correct: 4, total: 5 } }))).toEqual({ math: 2 });
    expect(itemsForSession(session('daily', 5, 5, { math: { correct: 2, total: 2 }, colors: { correct: 3, total: 3 } }))).toEqual({ ticket: 3 });
    expect(itemsForSession(session('memory', 1, 2, { memory: { correct: 1, total: 2 } }))).toEqual({ memory: 1 });
  });

  it('pays one item per fixed question in review, at most 3', () => {
    expect(itemsForSession(session('review', 2, 4, { math: { correct: 1, total: 2 }, time: { correct: 1, total: 2 } }))).toEqual({ math: 1, time: 1 });
    expect(itemsForSession(session('review', 6, 6, { math: { correct: 4, total: 4 }, time: { correct: 2, total: 2 } }))).toEqual({ math: 3 });
    expect(itemsForSession(session('review', 0, 3, { math: { correct: 0, total: 3 } }))).toEqual({});
  });

  it('adds up and describes the bag', () => {
    expect(addToBag({ math: 1 }, { math: 2, ticket: 1 })).toEqual({ math: 3, ticket: 1 });
    expect(describeBag({ math: 2 }, 'en')).toBe('+2 🧮 Calculator');
  });

  it('turns old progress into a fair welcome gift', () => {
    expect(welcomeGift({ math: { correct: 7 }, colors: { correct: 40 }, time: { correct: 2 } }, 5)).toEqual({ math: 2, colors: 5, ticket: 2 });
  });
});
