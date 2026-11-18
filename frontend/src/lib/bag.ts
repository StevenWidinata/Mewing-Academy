import type { Text, TopicId } from '../../../shared/types';
import type { SessionLog } from './sessions';

/**
 * Bag items: earned by finishing rounds, spent in Mewy's closet shop.
 * One kind per topic, plus Memory Crystals (Memory) and Golden Tickets (Daily).
 */

export type BagKind = Exclude<TopicId, 'memory'> | 'memory' | 'ticket';
export type Bag = Partial<Record<BagKind, number>>;

const T = (en: string, id: string): Text => ({ en, id });

export const BAG_ITEMS: Record<BagKind, { emoji: string; name: Text }> = {
  counting: { emoji: '🧱', name: T('Counting Block', 'Balok Hitung') },
  math: { emoji: '🧮', name: T('Calculator', 'Kalkulator') },
  skipcount: { emoji: '👟', name: T('Hop Shoe', 'Sepatu Loncat') },
  time: { emoji: '⏰', name: T('Alarm Clock', 'Jam Weker') },
  patterns: { emoji: '🧩', name: T('Puzzle Piece', 'Keping Puzzle') },
  colors: { emoji: '🖍️', name: T('Crayon', 'Krayon') },
  shapes: { emoji: '📐', name: T('Set Square', 'Penggaris Segitiga') },
  letters: { emoji: '✏️', name: T('Pencil', 'Pensil') },
  opposites: { emoji: '🧲', name: T('Magnet', 'Magnet') },
  animals: { emoji: '🪶', name: T('Feather', 'Bulu Burung') },
  food: { emoji: '🍎', name: T('Apple', 'Apel') },
  body: { emoji: '🩺', name: T('Stethoscope', 'Stetoskop') },
  feelings: { emoji: '💌', name: T('Kind Note', 'Surat Baik') },
  weather: { emoji: '☂️', name: T('Umbrella', 'Payung') },
  transport: { emoji: '🛞', name: T('Wheel', 'Roda') },
  space: { emoji: '🔭', name: T('Telescope', 'Teleskop') },
  memory: { emoji: '💎', name: T('Memory Crystal', 'Kristal Ingatan') },
  ticket: { emoji: '🎟️', name: T('Golden Ticket', 'Tiket Emas') },
};

export const BAG_KINDS = Object.keys(BAG_ITEMS) as BagKind[];

/** Finishing = 1, 80% or better = 2, perfect = 3. */
export function amountFor(correct: number, total: number): number {
  if (total <= 0) return 0;
  if (correct === total) return 3;
  return correct / total >= 0.8 ? 2 : 1;
}

/** Most items one "Fix my mistakes" round can give. */
export const REVIEW_MAX = 3;

/** Pure: what a finished round puts in the bag. */
export function itemsForSession(s: Pick<SessionLog, 'mode' | 'correct' | 'total' | 'topics'>): Bag {
  if (!s.total) return {};
  if (s.mode === 'daily') return { ticket: amountFor(s.correct, s.total) };
  if (s.mode === 'memory') return { memory: amountFor(s.correct, s.total) };
  const topics = Object.entries(s.topics) as [BagKind, { correct: number; total: number }][];
  if (s.mode === 'review') {
    // One item per fixed question, in its own topic.
    const out: Bag = {};
    let left = REVIEW_MAX;
    for (const [topic, tally] of topics) {
      const n = Math.min(left, tally.correct);
      if (n > 0) out[topic] = n;
      left -= n;
    }
    return out;
  }
  // Hand Quiz: one topic per round.
  const [topic] = topics[0] ?? [];
  return topic ? { [topic]: amountFor(s.correct, s.total) } : {};
}

export function addToBag(bag: Bag, add: Bag): Bag {
  const out = { ...bag };
  for (const [k, n] of Object.entries(add) as [BagKind, number][]) out[k] = (out[k] ?? 0) + n;
  return out;
}

/** Welcome gift for play from before the shop: 1 item per 3 old right answers (max 5 a topic), 1 ticket per 2 dailies. */
export function welcomeGift(byTopic: Partial<Record<TopicId, { correct: number }>>, dailies: number): Bag {
  const out: Bag = {};
  for (const [topic, s] of Object.entries(byTopic) as [BagKind, { correct: number }][]) {
    const n = Math.min(5, Math.floor((s?.correct ?? 0) / 3));
    if (n > 0) out[topic] = n;
  }
  const tickets = Math.floor(dailies / 2);
  if (tickets > 0) out.ticket = tickets;
  return out;
}

/** "+2 🧮 Calculator, +1 🎟️ Golden Ticket" */
export const describeBag = (bag: Bag, lang: 'en' | 'id') =>
  (Object.entries(bag) as [BagKind, number][])
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `+${n} ${BAG_ITEMS[k].emoji} ${BAG_ITEMS[k].name[lang]}`)
    .join(', ');
