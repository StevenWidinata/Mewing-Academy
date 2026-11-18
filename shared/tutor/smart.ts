import type { Lang, TopicId, TutorReply } from '../types';
import {
  COLOR_NAMES,
  COLOR_WORDS,
  DAYS,
  ENTITIES,
  KIND_LESSON,
  MIXES,
  MONTHS,
  OPPOSITES,
  RULES,
  SENSE_VERBS,
  type Entity,
} from './knowledge';
import { levenshtein } from './match';
import { MORE_FACTS } from './more';

/**
 * Smarter offline answers: find the THING the child asks about (dog, banana,
 * Mars...) and WHAT they want to know (legs, sound, color...), then fill a
 * short template from the fact tables. Returns null when it has no idea, so
 * the topic intents and the friendly fallback can take over.
 */

type QType = 'legs' | 'sound' | 'home' | 'food' | 'baby' | 'color' | 'shape' | 'wheels' | 'group' | 'where' | 'count';

const TYPE_WORDS: Record<QType, string[]> = {
  legs: ['leg', 'legs', 'kaki'],
  sound: ['sound', 'sounds', 'say', 'says', 'noise', 'suara', 'bunyi', 'berbunyi', 'bersuara'],
  home: ['live', 'lives', 'living', 'home', 'habitat', 'tinggal', 'rumah', 'hidup'],
  food: ['eat', 'eats', 'eating', 'food', 'makan', 'makanan', 'memakan'],
  baby: ['baby', 'babies', 'young', 'bayi', 'anak'],
  color: ['color', 'colour', 'colors', 'colours', 'colored', 'warna', 'berwarna'],
  shape: ['side', 'sides', 'corner', 'corners', 'angle', 'angles', 'sisi', 'sudut', 'pojok'],
  wheels: ['wheel', 'wheels', 'roda'],
  group: ['fruit', 'fruits', 'vegetable', 'vegetables', 'veggie', 'veggies', 'buah', 'sayur', 'sayuran'],
  where: ['where', 'go', 'goes', 'travel', 'mana', 'jalan'],
  count: ['many', 'much', 'number', 'berapa', 'jumlah', 'banyak'],
};
// Most specific first; "count" only when nothing else fits.
const TYPE_ORDER: QType[] = ['legs', 'sound', 'baby', 'food', 'home', 'color', 'shape', 'wheels', 'group', 'where', 'count'];

const AFTER = ['after', 'next', 'setelah', 'sesudah', 'berikutnya', 'selanjutnya'];
const BEFORE = ['before', 'sebelum', 'sebelumnya'];
const OPPOSITE = ['opposite', 'opposites', 'lawan', 'kebalikan', 'antonym'];
// Questions about playing the game go to the app-help answers instead.
const APP_HELP = ['answer', 'camera', 'jawab', 'menjawab', 'kamera', 'game', 'play', 'main'];
const MIX = ['mix', 'mixed', 'mixing', 'make', 'makes', 'together', 'campur', 'dicampur', 'campuran', 'dicampurkan', 'jadi', 'menjadi'];

/** Lowercase words; hyphens split ("laba-laba"), Indonesian -nya/-kah/-lah trimmed. */
export function words(text: string): string[] {
  const raw =
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .match(/[\p{L}\d]+/gu) ?? [];
  return raw.map((w) => {
    for (const suf of ['nya', 'kah', 'lah']) {
      if (w.length >= 6 && w.endsWith(suf)) return w.slice(0, -suf.length);
    }
    return w;
  });
}

const singular = (w: string) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);

function same(word: string, name: string): boolean {
  if (word === name || singular(word) === singular(name)) return true;
  // Gentle typo help for long words only ("elefant" -> "elephant").
  if (name.length < 7 || word.length < 6 || word[0] !== name[0]) return false;
  return levenshtein(word, name) <= (name.length >= 8 ? 2 : 1);
}

const has = (toks: string[], list: string[]) => toks.some((w) => list.includes(w));

/** Entities in the order they appear; multi-word names win over their parts. */
export function findEntities(toks: string[]): Entity[] {
  const used = new Array<boolean>(toks.length).fill(false);
  const found: { at: number; e: Entity }[] = [];
  const names = ENTITIES.flatMap((e) => e.names.map((n) => ({ e, parts: n.split(' ') }))).sort((a, b) => b.parts.length - a.parts.length);
  for (const { e, parts } of names) {
    for (let i = 0; i + parts.length <= toks.length; i++) {
      if (used.slice(i, i + parts.length).some(Boolean)) continue;
      if (!parts.every((p, k) => (parts.length > 1 ? toks[i + k] === p : same(toks[i + k], p)))) continue;
      for (let k = 0; k < parts.length; k++) used[i + k] = true;
      if (!found.some((f) => f.e === e)) found.push({ at: i, e });
    }
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.e);
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const article = (s: string) => (/^[aeiou]/i.test(s) ? `an ${s}` : `a ${s}`);
/** EN subject: "A dog", "An owl", or a custom one ("The sky"). */
const subjEn = (e: Entity) => e.subj ?? cap(article(e.name.en));
const subjId = (e: Entity) => cap(e.name.id);

function answerFor(e: Entity, type: QType, lang: Lang): string | null {
  const en = lang === 'en';
  const S = en ? subjEn(e) : subjId(e);
  switch (type) {
    case 'legs':
      if (e.legsText) return e.legsText[lang];
      if (e.legs == null) return null;
      if (e.legs === 0) return en ? `${S} has no legs at all! ${e.emoji}` : `${S} tidak punya kaki sama sekali! ${e.emoji}`;
      return en ? `${S} has ${e.legs} legs! ${e.emoji}` : `${S} punya ${e.legs} kaki! ${e.emoji}`;
    case 'sound':
      if (e.kind !== 'animal') return null;
      if (!e.says) return en ? `${S} is very quiet and hardly makes a sound! ${e.emoji}` : `${S} sangat pendiam dan hampir tidak bersuara! ${e.emoji}`;
      return en ? `${S} says ${e.says.en} ${e.emoji}` : `${S} bersuara ${e.says.id} ${e.emoji}`;
    case 'home':
      if (!e.home) return null;
      return en ? `${S} lives in ${e.home.en}. ${e.emoji}` : `${S} tinggal di ${e.home.id}. ${e.emoji}`;
    case 'food':
      if (!e.food) return null;
      return en ? `${S} eats ${e.food.en}. ${e.emoji}` : `${S} makan ${e.food.id}. ${e.emoji}`;
    case 'baby':
      if (!e.baby) return null;
      return en ? `A baby ${e.name.en} is called ${article(e.baby.en)}! ${e.emoji}` : `Bayi ${e.name.id} disebut ${e.baby.id}! ${e.emoji}`;
    case 'color':
      if (!e.color) return null;
      return en ? `${S} is ${e.color.en}! ${e.emoji}` : `${S} berwarna ${e.color.id}! ${e.emoji}`;
    case 'shape':
      if (e.sides == null) return null;
      if (e.sides === 0) return en ? `${S} has no straight sides and no corners. It is round! ${e.emoji}` : `${S} tidak punya sisi lurus dan sudut. Bentuknya bulat! ${e.emoji}`;
      return en ? `${S} has ${e.sides} sides and ${e.corners} corners! ${e.emoji}` : `${S} punya ${e.sides} sisi dan ${e.corners} sudut! ${e.emoji}`;
    case 'wheels':
      if (e.wheels == null) return null;
      if (e.wheels === 0) return en ? `${S} has no wheels. It goes ${e.where?.en}! ${e.emoji}` : `${S} tidak punya roda. Ia bergerak ${e.where?.id}! ${e.emoji}`;
      return en ? `${S} has ${e.wheels} wheels! ${e.emoji}` : `${S} punya ${e.wheels} roda! ${e.emoji}`;
    case 'group':
      if (!e.group) return null;
      if (e.group === 'fruit') return en ? `${S} is a fruit! ${e.emoji}` : `${S} adalah buah! ${e.emoji}`;
      return en ? `${S} is a vegetable! ${e.emoji}` : `${S} adalah sayuran! ${e.emoji}`;
    case 'where':
      if (e.where) return en ? `${S} goes ${e.where.en}. ${e.emoji}` : `${S} bergerak ${e.where.id}. ${e.emoji}`;
      return e.home ? answerFor(e, 'home', lang) : null;
    case 'count':
      return e.count?.[lang] ?? null;
  }
}

const reply = (text: string, intent: string, confidence: number, lesson?: Exclude<TopicId, 'memory'>): TutorReply => ({
  reply: text,
  intent,
  confidence,
  lesson,
});

/** Adds the "Tell me more!" fact for the thing the answer is about. */
function withMore(r: TutorReply, e: Entity, lang: Lang): TutorReply {
  const more = MORE_FACTS[e.id];
  return more ? { ...r, more: { text: more[lang], emoji: e.emoji } } : r;
}

function sequence(toks: string[], lang: Lang): TutorReply | null {
  const after = has(toks, AFTER);
  const before = has(toks, BEFORE);
  if (!after && !before) return null;
  const step = after ? 1 : -1;
  const en = lang === 'en';
  for (const list of [DAYS, MONTHS]) {
    const i = list.findIndex((d) => toks.includes(d.en.toLowerCase()) || toks.includes(d.id.toLowerCase()));
    if (i < 0) continue;
    const j = (i + step + list.length) % list.length;
    const word = after ? (en ? 'after' : 'setelah') : en ? 'before' : 'sebelum';
    const text = en ? `${list[j].en} comes ${word} ${list[i].en}! 📅` : `${list[j].id} datang ${word} ${list[i].id}! 📅`;
    return reply(text, 'time', 1, 'time');
  }
  const num = toks.find((w) => /^\d{1,6}$/.test(w));
  if (num != null) {
    const n = Number(num);
    const m = n + step;
    if (m < 0) return reply(en ? 'Nothing comes before 0 when we count! 0 is where we start.' : 'Tidak ada angka sebelum 0 saat berhitung! Kita mulai dari 0.', 'counting', 1, 'counting');
    const word = after ? (en ? 'after' : 'setelah') : en ? 'before' : 'sebelum';
    return reply(en ? `${m} comes ${word} ${n}! 🔢` : `${m} datang ${word} ${n}! 🔢`, 'counting', 1, 'counting');
  }
  return null;
}

function opposite(toks: string[], lang: Lang): TutorReply | null {
  const at = toks.findIndex((w) => OPPOSITE.includes(w));
  if (at < 0) return null;
  const order = [...toks.slice(at + 1), ...toks.slice(0, at).reverse()];
  for (const w of order) {
    const pair = OPPOSITES.find(([a, b]) => a === w || b === w);
    if (!pair) continue;
    const other = pair[0] === w ? pair[1] : pair[0];
    const text = lang === 'en' ? `The opposite of "${w}" is "${other}"! 🔄` : `Lawan kata "${w}" adalah "${other}"! 🔄`;
    return reply(text, 'opposites', 1, 'opposites');
  }
  return null;
}

function mix(toks: string[], entities: Entity[], lang: Lang): TutorReply | null {
  const colors = [...new Set(toks.map((w) => COLOR_WORDS[w]).filter(Boolean))];
  if (colors.length !== 2) return null;
  // "Is a zebra black and white?" is about the zebra, not paint.
  if (!has(toks, MIX) && entities.some((e) => e.id !== 'orange')) return null;
  const key = [...colors].sort().join('+');
  const result = MIXES[key];
  if (!result) return null;
  const [a, b] = colors.map((c) => COLOR_NAMES[c][lang]);
  const r = COLOR_NAMES[result][lang];
  const text = lang === 'en' ? `${cap(a)} + ${b} = ${r}! 🎨 Try it with your paints!` : `${cap(a)} + ${b} = ${r}! 🎨 Coba dengan cat airmu!`;
  return reply(text, 'colors', 1, 'colors');
}

function senses(toks: string[], lang: Lang): TutorReply | null {
  const verb = toks.find((w) => SENSE_VERBS[w]);
  if (!verb) return null;
  const part = ENTITIES.find((e) => e.id === SENSE_VERBS[verb]);
  return part ? reply(part.fact[lang], 'body', 1, 'body') : null;
}

export function smartReply(text: string, lang: Lang): TutorReply | null {
  const toks = words(text);
  if (!toks.length || has(toks, APP_HELP)) return null;

  const seq = sequence(toks, lang);
  if (seq) return seq;
  const opp = opposite(toks, lang);
  if (opp) return opp;

  const entities = findEntities(toks);
  const types = TYPE_ORDER.filter((q) => has(toks, TYPE_WORDS[q]));

  // "What do blue and orange make?" is paint mixing, not the fruit.
  if (has(toks, MIX)) {
    const early = mix(toks, entities, lang);
    if (early) return early;
  }

  // 1. A thing + a question about it ("how many legs does a dog have").
  for (const q of types) {
    for (const e of entities) {
      const a = answerFor(e, q, lang);
      if (a) return withMore(reply(`${a} ${q === 'count' ? '' : e.fact[lang]}`.trim(), `${KIND_LESSON[e.kind]}:${e.id}`, 1, KIND_LESSON[e.kind]), e, lang);
    }
  }

  // 2. Color mixing ("red and blue make?").
  const m = mix(toks, entities, lang);
  if (m) return m;

  // 3. Number / superlative facts ("how many planets", "biggest animal").
  const joined = ` ${toks.join(' ')} `;
  const hit = (g: string) => (g.includes(' ') ? joined.includes(` ${g} `) : toks.some((w) => same(w, g)));
  let best: (typeof RULES)[number] | null = null;
  for (const r of RULES) {
    if (r.all.every((group) => group.some(hit)) && (!best || r.all.length > best.all.length)) best = r;
  }
  if (best) return reply(best.reply[lang], best.lesson, 1, best.lesson);

  // 4. Just a thing: share its fun fact. If they asked something we do not
  //    know about it, Mewy says it is sharing what it knows.
  if (entities.length) {
    const e = entities[0];
    const S = lang === 'en' ? subjEn(e) : subjId(e);
    const lead = e.kind === 'body' || e.kind === 'weather' || e.kind === 'space' ? '' : `${e.emoji} ${S}! `;
    return withMore(reply(`${lead}${e.fact[lang]}`, `${KIND_LESSON[e.kind]}:${e.id}`, types.length ? 0.6 : 0.85, KIND_LESSON[e.kind]), e, lang);
  }

  // 5. "What do we smell with?"
  return senses(toks, lang);
}

