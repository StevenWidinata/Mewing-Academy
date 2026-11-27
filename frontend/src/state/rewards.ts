import { TOPICS, type Lang, type Text, type TopicId } from '../../../shared/types';
import { BAG_ITEMS, type Bag, type BagKind } from '../lib/bag';
import { STAGES } from '../lib/mewyStage';
import { STICKERS } from '../lib/stickers';
import { STREAK_GIFTS } from '../lib/streakGifts';
import { WEEKLY_GOAL, weekStart } from '../lib/weekly';
import type { Progress } from './progress';

/**
 * Rewards:
 * - Outfits and fur colors are bought in Mewy's closet with bag items
 *   (earned by finishing rounds). Owned ones are kept in `progress.owned`.
 * - Badges: bronze / silver / gold per topic, Hand Hero, stickers.
 */

export type ItemId =
  | 'scarf' | 'glasses' | 'beret' | 'partyhat' | 'safari' | 'gradcap' | 'bow' | 'wizard'
  | 'spacehelmet' | 'rainhat' | 'racercap' | 'fruithat' | 'doctor' | 'heartpin' | 'hopears' | 'pocketwatch' | 'flipcape'
  | 'crown' | 'herocape' | 'wings';
export type FurId = 'yellow' | 'orange' | 'white' | 'gray' | 'pink' | 'black' | 'calico';
export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type ShopTier = 'cheap' | 'medium' | 'special';

const T = (en: string, id: string): Text => ({ en, id });

export const ITEMS: { id: ItemId; emoji: string; name: Text; tier: ShopTier; price: Bag }[] = [
  { id: 'scarf', emoji: '🧣', name: T('Cozy Scarf', 'Syal Hangat'), tier: 'cheap', price: { counting: 3 } },
  { id: 'glasses', emoji: '👓', name: T('Smart Glasses', 'Kacamata Pintar'), tier: 'cheap', price: { math: 3 } },
  { id: 'beret', emoji: '🎨', name: T("Painter's Beret", 'Baret Pelukis'), tier: 'cheap', price: { colors: 3 } },
  { id: 'partyhat', emoji: '🥳', name: T('Party Hat', 'Topi Pesta'), tier: 'cheap', price: { shapes: 3 } },
  { id: 'safari', emoji: '🤠', name: T('Safari Hat', 'Topi Safari'), tier: 'cheap', price: { animals: 3 } },
  { id: 'bow', emoji: '🎀', name: T('Bow Tie', 'Dasi Kupu-kupu'), tier: 'cheap', price: { patterns: 3 } },
  { id: 'gradcap', emoji: '🎓', name: T('Graduation Cap', 'Topi Wisuda'), tier: 'medium', price: { letters: 5 } },
  { id: 'wizard', emoji: '🧙', name: T('Wizard Hat', 'Topi Penyihir'), tier: 'medium', price: { memory: 5 } },
  { id: 'spacehelmet', emoji: '👩‍🚀', name: T('Space Helmet', 'Helm Antariksa'), tier: 'medium', price: { space: 6 } },
  { id: 'rainhat', emoji: '🌧️', name: T('Rain Hat', 'Topi Hujan'), tier: 'medium', price: { weather: 5 } },
  { id: 'racercap', emoji: '🏎️', name: T('Racer Cap', 'Topi Pembalap'), tier: 'medium', price: { transport: 5 } },
  { id: 'fruithat', emoji: '🍎', name: T('Fruit Hat', 'Topi Buah'), tier: 'medium', price: { food: 5 } },
  { id: 'doctor', emoji: '🩺', name: T('Doctor Mirror', 'Cermin Dokter'), tier: 'medium', price: { body: 5 } },
  { id: 'heartpin', emoji: '💖', name: T('Heart Pin', 'Bros Hati'), tier: 'medium', price: { feelings: 5 } },
  { id: 'hopears', emoji: '🐰', name: T('Hop Ears', 'Telinga Loncat'), tier: 'medium', price: { skipcount: 5 } },
  { id: 'pocketwatch', emoji: '⌚', name: T('Pocket Watch', 'Jam Saku'), tier: 'medium', price: { time: 5 } },
  { id: 'flipcape', emoji: '🔄', name: T('Flip Cape', 'Jubah Bolak-balik'), tier: 'medium', price: { opposites: 5 } },
  { id: 'crown', emoji: '👑', name: T('Champion Crown', 'Mahkota Juara'), tier: 'special', price: { math: 4, colors: 4, animals: 4 } },
  { id: 'herocape', emoji: '🦸', name: T('Hero Cape', 'Jubah Pahlawan'), tier: 'special', price: { letters: 4, space: 4, ticket: 3 } },
  { id: 'wings', emoji: '🌈', name: T('Rainbow Wings', 'Sayap Pelangi'), tier: 'special', price: { colors: 5, ticket: 5 } },
];

/** `stars` is the old free-unlock milestone, kept only to move old saves over. */
export const FURS: { id: FurId; stars: number; price: Bag; name: Text; main: string; shade: string; eye?: string }[] = [
  { id: 'yellow', stars: 0, price: {}, name: T('Sunny Yellow', 'Kuning Cerah'), main: '#ffcc00', shade: '#e0a800' },
  { id: 'orange', stars: 10, price: { ticket: 1 }, name: T('Tiger Orange', 'Oranye Harimau'), main: '#ff9a3c', shade: '#e07a1f' },
  { id: 'white', stars: 25, price: { ticket: 2 }, name: T('Snow White', 'Putih Salju'), main: '#f7f3ea', shade: '#d9d2c3' },
  { id: 'gray', stars: 40, price: { ticket: 3 }, name: T('Cloud Gray', 'Abu Awan'), main: '#a9a9b8', shade: '#8a8a9c' },
  { id: 'pink', stars: 60, price: { ticket: 4 }, name: T('Bubblegum Pink', 'Merah Muda'), main: '#ff9ccf', shade: '#e77fb4' },
  { id: 'black', stars: 80, price: { ticket: 5 }, name: T('Midnight Black', 'Hitam Malam'), main: '#3a3550', shade: '#2a2640', eye: '#c8ff5a' },
  { id: 'calico', stars: 100, price: { ticket: 6 }, name: T('Calico', 'Belang Tiga'), main: '#f7f3ea', shade: '#d9d2c3' },
];

/** Shop keys: `item:<id>` and `fur:<id>` (Sunny Yellow is free). */
export const SHOP_KEYS: string[] = [...ITEMS.map((i) => `item:${i.id}`), ...FURS.filter((f) => f.id !== 'yellow').map((f) => `fur:${f.id}`)];

export function priceOf(key: string): Bag {
  const [kind, id] = key.split(':');
  if (kind === 'item') return ITEMS.find((i) => i.id === id)?.price ?? {};
  return FURS.find((f) => f.id === id)?.price ?? {};
}

export const canAfford = (bag: Bag, price: Bag) => (Object.entries(price) as [BagKind, number][]).every(([k, n]) => (bag[k] ?? 0) >= n);

/** What is still missing, e.g. { math: 2 }. */
export function missingFor(bag: Bag, price: Bag): Bag {
  const out: Bag = {};
  for (const [k, n] of Object.entries(price) as [BagKind, number][]) if ((bag[k] ?? 0) < n) out[k] = n - (bag[k] ?? 0);
  return out;
}

export function payFrom(bag: Bag, price: Bag): Bag {
  const out = { ...bag };
  for (const [k, n] of Object.entries(price) as [BagKind, number][]) out[k] = Math.max(0, (out[k] ?? 0) - n);
  return out;
}

/** Where to go to earn a bag item: its topic's quiz, Memory, or the Daily Challenge. */
export const earnPath = (k: BagKind) => (k === 'ticket' ? '/daily' : k === 'memory' ? '/memory' : `/quiz?topic=${k}`);

/** Old free rules (5 right answers per topic / star milestones), so nothing already unlocked is lost. */
const LEGACY_ITEM_TOPIC: Partial<Record<ItemId, TopicId>> = {
  scarf: 'counting', glasses: 'math', beret: 'colors', partyhat: 'shapes', safari: 'animals', gradcap: 'letters', bow: 'patterns', wizard: 'memory',
};
export function legacyOwned(p: Pick<Progress, 'byTopic' | 'stars'>): string[] {
  const out: string[] = [];
  for (const [id, topic] of Object.entries(LEGACY_ITEM_TOPIC) as [ItemId, TopicId][]) if ((p.byTopic[topic]?.correct ?? 0) >= 5) out.push(`item:${id}`);
  for (const f of FURS) if (f.stars > 0 && p.stars >= f.stars) out.push(`fur:${f.id}`);
  return out;
}

/** Shop keys that just became affordable get a one-time "you can buy" pop-up. */
export function withBuyHints(p: Pick<Progress, 'bag' | 'owned' | 'buyHints'>): string[] {
  const fresh = SHOP_KEYS.filter((k) => !p.owned.includes(k) && !p.buyHints.includes(k) && canAfford(p.bag, priceOf(k)));
  return fresh.length ? [...p.buyHints, ...fresh] : p.buyHints;
}

/** "🧮 ×3 🖍️ ×4" */
export const priceText = (price: Bag) =>
  (Object.entries(price) as [BagKind, number][]).map(([k, n]) => `${BAG_ITEMS[k].emoji} ×${n}`).join(' ');

/** Hand Hero: right answers made with the camera. */
export const HAND_BONUS_EVERY = 5;
export const HAND_BADGES: { tier: BadgeTier; need: number; emoji: string }[] = [
  { tier: 'bronze', need: 5, emoji: '🥉' },
  { tier: 'silver', need: 25, emoji: '🥈' },
  { tier: 'gold', need: 50, emoji: '🥇' },
];

export function handBadge(n: number) {
  let best: (typeof HAND_BADGES)[number] | null = null;
  for (const b of HAND_BADGES) if (n >= b.need) best = b;
  return best;
}

export const BADGES: { tier: BadgeTier; need: number; emoji: string }[] = [
  { tier: 'bronze', need: 5, emoji: '🥉' },
  { tier: 'silver', need: 15, emoji: '🥈' },
  { tier: 'gold', need: 30, emoji: '🥇' },
];

export const correctIn = (p: Progress, t: TopicId) => p.byTopic[t]?.correct ?? 0;

export const isItemUnlocked = (p: Pick<Progress, 'owned'>, id: ItemId) => p.owned.includes(`item:${id}`);

export const isFurUnlocked = (p: Pick<Progress, 'owned'>, id: FurId) => id === 'yellow' || p.owned.includes(`fur:${id}`);

export function badgeFor(correct: number) {
  let best: (typeof BADGES)[number] | null = null;
  for (const b of BADGES) if (correct >= b.need) best = b;
  return best;
}

export function nextBadge(correct: number) {
  return BADGES.find((b) => correct < b.need) ?? null;
}

/** Every reward currently earned, as stable keys. New keys = new unlocks. */
export function unlockKeys(p: Progress): string[] {
  const keys: string[] = [];
  keys.push(...(p.owned ?? []));
  for (const k of p.buyHints ?? []) keys.push(`canbuy:${k}`);
  for (const [t, s] of Object.entries(p.byTopic)) {
    for (const b of BADGES) if ((s?.correct ?? 0) >= b.need) keys.push(`badge:${t}:${b.tier}`);
  }
  const hands = p.handAnswers ?? 0;
  for (const b of HAND_BADGES) if (hands >= b.need) keys.push(`hand:${b.tier}`);
  // Only the latest bonus, so each new one pops up once.
  if (hands >= HAND_BONUS_EVERY) keys.push(`handbonus:${Math.floor(hands / HAND_BONUS_EVERY)}`);
  // Weekly goal reached, and the streak shield saving a streak.
  const perWeek = new Map<string, number>();
  for (const d of p.playDays ?? []) perWeek.set(weekStart(d), (perWeek.get(weekStart(d)) ?? 0) + 1);
  for (const [week, n] of perWeek) if (n >= WEEKLY_GOAL) keys.push(`week:${week}`);
  if (p.shieldWeek) keys.push(`shield:${p.shieldWeek}`);
  for (const s of p.stickers ?? []) keys.push(`sticker:${s}`);
  for (const st of STAGES) if (st.min > 0 && (p.bestStreak ?? 0) >= st.min) keys.push(`stage:${st.id}`);
  for (const d of p.streakGifts ?? []) keys.push(`streakgift:${d}`);
  return keys;
}

export function topicTitle(t: string, lang: Lang): string {
  if (t === 'memory') return lang === 'en' ? 'Memory' : 'Ingatan';
  return TOPICS.find((x) => x.id === t)?.title[lang] ?? t;
}

export function describeUnlock(key: string, lang: Lang): string {
  const [kind, a, b] = key.split(':');
  if (kind === 'item') {
    const it = ITEMS.find((i) => i.id === a);
    return it ? `${it.emoji} ${it.name[lang]}` : key;
  }
  if (kind === 'fur') {
    const f = FURS.find((x) => x.id === a);
    return f ? `🐱 ${f.name[lang]}` : key;
  }
  if (kind === 'hand') {
    const hb = HAND_BADGES.find((x) => x.tier === a);
    return `✋ ${lang === 'en' ? 'Hand Hero' : 'Pahlawan Tangan'} ${hb?.emoji ?? ''}`;
  }
  if (kind === 'stage') {
    const st = STAGES.find((x) => x.id === a);
    return st ? (lang === 'en' ? `🌱 Mewy grew up: ${st.emoji} ${st.name.en}!` : `🌱 Mewy tumbuh: ${st.emoji} ${st.name.id}!`) : key;
  }
  if (kind === 'canbuy') {
    const it = a === 'item' ? ITEMS.find((i) => i.id === b) : null;
    const f = a === 'fur' ? FURS.find((x) => x.id === b) : null;
    const what = it ? `${it.emoji} ${it.name[lang]}` : f ? `🐱 ${f.name[lang]}` : '';
    return lang === 'en' ? `🛍️ You can buy ${what}!` : `🛍️ Kamu bisa membeli ${what}!`;
  }
  if (kind === 'welcome') {
    return lang === 'en' ? '🎁 Welcome gift: items for all your past play! Check your bag.' : '🎁 Hadiah sambutan: item untuk semua permainanmu sebelumnya! Lihat tasmu.';
  }
  if (kind === 'sticker') {
    const st = STICKERS.find((x) => x.id === a);
    return st ? `📒 ${st.emoji} ${st.name[lang]}` : key;
  }
  if (kind === 'week') {
    return lang === 'en' ? '🎯 Weekly goal reached: 3 play days!' : '🎯 Target mingguan tercapai: 3 hari bermain!';
  }
  if (kind === 'shield') {
    return lang === 'en' ? '🛡️ Your streak shield saved your streak!' : '🛡️ Perisai menyelamatkan hari beruntunmu!';
  }
  if (kind === 'streakgift') {
    const g = STREAK_GIFTS.find((x) => String(x.days) === a);
    const n = g?.tickets ?? 1;
    return lang === 'en' ? `🔥 ${a}-day streak! +${n} 🎟️ Golden Ticket` : `🔥 ${a} hari beruntun! +${n} 🎟️ Tiket Emas`;
  }
  if (kind === 'handbonus') {
    return lang === 'en' ? `✋ +1 ⭐ Hand Hero bonus!` : `✋ +1 ⭐ bonus Pahlawan Tangan!`;
  }
  const badge = BADGES.find((x) => x.tier === b);
  return `${badge?.emoji ?? '🏅'} ${topicTitle(a, lang)}`;
}
