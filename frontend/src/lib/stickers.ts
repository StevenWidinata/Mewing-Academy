import { TOPICS, type Text } from '../../../shared/types';
import type { Progress } from '../state/progress';
import { WEEKLY_GOAL, weekStart } from './weekly';

/** Sticker book achievements. Earned stickers are kept even if the history that earned them rolls off. */

export type StickerId =
  | 'first-star'
  | 'boss-ko'
  | 'double-win'
  | 'perfect'
  | 'streak-3'
  | 'streak-7'
  | 'hand-10'
  | 'hand-50'
  | 'explorer'
  | 'world'
  | 'hard-star'
  | 'daily-5'
  | 'weekly'
  | 'stars-100';

export interface Sticker {
  id: StickerId;
  emoji: string;
  name: Text;
  how: Text;
  /** Earned from saved progress; stickers without it are earned by an event (e.g. beating the boss). */
  check?: (p: Progress) => boolean;
}

const T = (en: string, id: string): Text => ({ en, id });
const playedTopics = (p: Progress) => TOPICS.filter((t) => (p.byTopic[t.id]?.total ?? 0) > 0).length;

export const STICKERS: Sticker[] = [
  { id: 'first-star', emoji: '🌟', name: T('First Star', 'Bintang Pertama'), how: T('Get your first right answer.', 'Jawab benar untuk pertama kali.'), check: (p) => p.stars >= 1 },
  { id: 'boss-ko', emoji: '👊', name: T('Boss Buster', 'Penakluk Bos'), how: T('Knock out a boss in the Hand Quiz.', 'Kalahkan bos di Kuis Tangan.') },
  { id: 'double-win', emoji: '🏆', name: T('Double Win', 'Menang Ganda'), how: T('Beat 2 bosses in one round.', 'Kalahkan 2 bos dalam satu ronde.') },
  {
    id: 'perfect',
    emoji: '💯',
    name: T('Perfect Round', 'Ronde Sempurna'),
    how: T('Get every answer right in a round of 5 or more.', 'Jawab benar semua dalam satu ronde berisi 5 soal atau lebih.'),
    check: (p) => p.sessions.some((s) => s.total >= 5 && s.correct === s.total),
  },
  { id: 'streak-3', emoji: '🔥', name: T('On Fire', 'Membara'), how: T('Play 3 days in a row.', 'Main 3 hari berturut-turut.'), check: (p) => p.streak >= 3 },
  { id: 'streak-7', emoji: '☄️', name: T('Super Streak', 'Beruntun Super'), how: T('Play 7 days in a row.', 'Main 7 hari berturut-turut.'), check: (p) => p.streak >= 7 },
  { id: 'hand-10', emoji: '✋', name: T('Hand Helper', 'Tangan Cekatan'), how: T('Answer 10 questions right with your fingers.', 'Jawab benar 10 soal dengan jarimu.'), check: (p) => p.handAnswers >= 10 },
  { id: 'hand-50', emoji: '🖐️', name: T('Hand Hero', 'Pahlawan Tangan'), how: T('Answer 50 questions right with your fingers.', 'Jawab benar 50 soal dengan jarimu.'), check: (p) => p.handAnswers >= 50 },
  { id: 'explorer', emoji: '🧭', name: T('Explorer', 'Penjelajah'), how: T('Play 8 different topics.', 'Mainkan 8 topik berbeda.'), check: (p) => playedTopics(p) >= 8 },
  { id: 'world', emoji: '🌍', name: T('World Traveler', 'Keliling Dunia'), how: T('Play all 16 topics.', 'Mainkan semua 16 topik.'), check: (p) => playedTopics(p) >= TOPICS.length },
  {
    id: 'hard-star',
    emoji: '⭐',
    name: T('Hard Star', 'Bintang Sulit'),
    how: T('Win a Hard star on any island.', 'Raih bintang Sulit di pulau mana saja.'),
    check: (p) => Object.values(p.levelStars).some((levels) => levels?.includes(3)),
  },
  {
    id: 'daily-5',
    emoji: '📅',
    name: T('Daily Champ', 'Juara Harian'),
    how: T('Finish 5 Daily Challenges.', 'Selesaikan 5 Tantangan Harian.'),
    check: (p) => p.sessions.filter((s) => s.mode === 'daily').length >= 5,
  },
  {
    id: 'weekly',
    emoji: '🎯',
    name: T('Goal Getter', 'Pencapai Target'),
    how: T(`Play on ${WEEKLY_GOAL} days in one week.`, `Main ${WEEKLY_GOAL} hari dalam satu minggu.`),
    check: (p) => {
      const per = new Map<string, number>();
      for (const d of p.playDays) per.set(weekStart(d), (per.get(weekStart(d)) ?? 0) + 1);
      return [...per.values()].some((n) => n >= WEEKLY_GOAL);
    },
  },
  { id: 'stars-100', emoji: '💫', name: T('Star Collector', 'Kolektor Bintang'), how: T('Collect 100 stars.', 'Kumpulkan 100 bintang.'), check: (p) => p.stars >= 100 },
];

/** Pure: the sticker list after adding any that `p` has now earned. Same array if nothing new. */
export function withEarnedStickers(p: Progress): StickerId[] {
  const fresh = STICKERS.filter((s) => s.check?.(p) && !p.stickers.includes(s.id)).map((s) => s.id);
  return fresh.length ? [...p.stickers, ...fresh] : p.stickers;
}
