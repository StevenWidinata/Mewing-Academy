import { TOPICS, type Text, type TopicId } from '../../../shared/types';
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
  | 'stars-100'
  | 'number-prodigy'
  | 'word-wizard'
  | 'nature-explorer'
  | 'color-artist'
  | 'early-bird'
  | 'night-owl'
  | 'lightning'
  | 'sharpshooter'
  | 'comeback'
  | 'bookworm'
  | 'curious-cat'
  | 'shopper';

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

/** Topic-group prodigies: 85%+ over at least 30 answers in the group. */
export const PRODIGY_AT = 0.85;
export const PRODIGY_MIN = 30;
export const TOPIC_GROUPS: Record<'numbers' | 'words' | 'nature' | 'art', TopicId[]> = {
  numbers: ['counting', 'math', 'skipcount', 'patterns', 'time'],
  words: ['letters', 'opposites', 'feelings'],
  nature: ['animals', 'weather', 'space', 'food'],
  art: ['colors', 'shapes', 'body', 'transport'],
};
function groupStrong(p: Progress, group: keyof typeof TOPIC_GROUPS): boolean {
  let correct = 0;
  let total = 0;
  for (const t of TOPIC_GROUPS[group]) {
    correct += p.byTopic[t]?.correct ?? 0;
    total += p.byTopic[t]?.total ?? 0;
  }
  return total >= PRODIGY_MIN && correct / total >= PRODIGY_AT;
}

/** Early Bird / Night Owl from the hour a round ends (Night Owl stops at 8 pm on purpose). */
export function timeSticker(hour: number): StickerId | null {
  if (hour < 8) return 'early-bird';
  if (hour >= 18 && hour < 20) return 'night-owl';
  return null;
}

/** Lightning Fingers: 5 right answers in a row, each under 5 seconds. */
export function hasLightningRun(answers: { correct: boolean; ms: number }[], run = 5, ms = 5000): boolean {
  let n = 0;
  for (const a of answers) {
    n = a.correct && a.ms < ms ? n + 1 : 0;
    if (n >= run) return true;
  }
  return false;
}

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
  {
    id: 'number-prodigy',
    emoji: '🔢',
    name: T('Number Prodigy', 'Jenius Angka'),
    how: T('Get 85% right over 30 answers in counting, plus & minus, skip counting, patterns and time.', 'Benar 85% dari 30 jawaban di berhitung, tambah & kurang, hitung loncat, pola, dan jam.'),
    check: (p) => groupStrong(p, 'numbers'),
  },
  {
    id: 'word-wizard',
    emoji: '🔤',
    name: T('Word Wizard', 'Penyihir Kata'),
    how: T('Get 85% right over 30 answers in letters, opposites and feelings.', 'Benar 85% dari 30 jawaban di huruf, lawan kata, dan perasaan.'),
    check: (p) => groupStrong(p, 'words'),
  },
  {
    id: 'nature-explorer',
    emoji: '🌿',
    name: T('Nature Explorer', 'Penjelajah Alam'),
    how: T('Get 85% right over 30 answers in animals, weather, space and fruits & veggies.', 'Benar 85% dari 30 jawaban di hewan, cuaca, luar angkasa, dan buah & sayur.'),
    check: (p) => groupStrong(p, 'nature'),
  },
  {
    id: 'color-artist',
    emoji: '🎨',
    name: T('Color Artist', 'Seniman Warna'),
    how: T('Get 85% right over 30 answers in colors, shapes, my body and vehicles.', 'Benar 85% dari 30 jawaban di warna, bentuk, tubuhku, dan kendaraan.'),
    check: (p) => groupStrong(p, 'art'),
  },
  { id: 'early-bird', emoji: '🐦', name: T('Early Bird', 'Burung Pagi'), how: T('Finish a round before 8 in the morning.', 'Selesaikan satu ronde sebelum jam 8 pagi.') },
  { id: 'night-owl', emoji: '🦉', name: T('Night Owl', 'Burung Hantu'), how: T('Finish a round between 6 and 8 in the evening.', 'Selesaikan satu ronde antara jam 6 dan 8 malam.') },
  { id: 'lightning', emoji: '⚡', name: T('Lightning Fingers', 'Jari Kilat'), how: T('Get 5 right answers in a row, each in under 5 seconds.', 'Jawab benar 5 kali berturut-turut, masing-masing kurang dari 5 detik.') },
  {
    id: 'sharpshooter',
    emoji: '🎯',
    name: T('Sharpshooter', 'Penembak Jitu'),
    how: T('Finish 3 perfect rounds.', 'Selesaikan 3 ronde sempurna.'),
    check: (p) => p.sessions.filter((s) => s.total >= 5 && s.correct === s.total).length >= 3,
  },
  { id: 'comeback', emoji: '💪', name: T('Comeback Kid', 'Pantang Menyerah'), how: T('Fix 10 mistakes in "Fix my mistakes".', 'Perbaiki 10 kesalahan di "Perbaiki kesalahanku".'), check: (p) => p.fixedCount >= 10 },
  { id: 'bookworm', emoji: '📚', name: T('Bookworm', 'Kutu Buku'), how: T('Finish 10 lessons.', 'Selesaikan 10 pelajaran.'), check: (p) => p.lessonsDone.length >= 10 },
  { id: 'curious-cat', emoji: '🐱', name: T('Curious Cat', 'Kucing Penasaran'), how: T('Ask Mewy 20 questions.', 'Tanya Mewy 20 kali.'), check: (p) => p.tutorQuestions >= 20 },
  { id: 'shopper', emoji: '🛍️', name: T('Shopper', 'Si Pembeli'), how: T("Buy your first thing in Mewy's closet.", 'Beli barang pertama di Lemari Mewy.'), check: (p) => p.purchases >= 1 },
];

/** Pure: the sticker list after adding any that `p` has now earned. Same array if nothing new. */
export function withEarnedStickers(p: Progress): StickerId[] {
  const fresh = STICKERS.filter((s) => s.check?.(p) && !p.stickers.includes(s.id)).map((s) => s.id);
  return fresh.length ? [...p.stickers, ...fresh] : p.stickers;
}
