import { useState } from 'react';
import type { Text } from '../../../../shared/types';
import { useSettings } from '../../state/settings';
import type { FigureProps } from './registry';

const T = (en: string, id: string): Text => ({ en, id });
const mode = (c: FigureProps['config'], d: string) => (typeof c?.mode === 'string' ? c.mode : d);

interface Card {
  emoji: string;
  label: Text;
  info: Text;
}

/** Tap a card to learn about it; the cards turn green once seen. */
function TapCards({ cards, hint }: { cards: Card[]; hint: Text }) {
  const { settings } = useSettings();
  const L = settings.lang;
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const tap = (i: number) => {
    setOpen(i);
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
  };
  return (
    <div>
      <div className="tapcards">
        {cards.map((c, i) => (
          <button key={c.label.en} type="button" className={`tapcard${open === i ? ' is-open' : ''}${seen.includes(i) ? ' is-seen' : ''}`} aria-pressed={open === i} onClick={() => tap(i)}>
            <span className="tapcard__emoji" aria-hidden="true">{c.emoji}</span>
            <span className="tapcard__label">{c.label[L]}</span>
          </button>
        ))}
      </div>
      <p className={`fig-status${seen.length === cards.length ? ' is-ok' : ''}`} aria-live="polite">
        {open == null ? hint[L] : `${cards[open].emoji} ${cards[open].info[L]}`}
        {seen.length === cards.length && open != null ? ' ✅' : ''}
      </p>
    </div>
  );
}

const HINT = T('Tap each card!', 'Ketuk setiap kartu!');

// ---------- Colors ----------
type Paint = 'red' | 'yellow' | 'blue' | 'white';
const PAINT: Record<Paint, { hex: string; name: Text }> = {
  red: { hex: '#e83b3b', name: T('red', 'merah') },
  yellow: { hex: '#ffcc00', name: T('yellow', 'kuning') },
  blue: { hex: '#3b7be8', name: T('blue', 'biru') },
  white: { hex: '#fdf6e3', name: T('white', 'putih') },
};
const MIX: Record<string, { hex: string; name: Text }> = {
  'red+yellow': { hex: '#ff8a1f', name: T('orange', 'oranye') },
  'blue+red': { hex: '#9b4de0', name: T('purple', 'ungu') },
  'blue+yellow': { hex: '#3bb54a', name: T('green', 'hijau') },
  'red+white': { hex: '#ff9ccf', name: T('pink', 'merah muda') },
  'blue+white': { hex: '#9fd8ff', name: T('light blue', 'biru muda') },
  'white+yellow': { hex: '#fff1a6', name: T('light yellow', 'kuning muda') },
};

/** Color mixer: pick two paints and see the new color. */
export function Mixer() {
  const { settings } = useSettings();
  const L = settings.lang;
  const [a, setA] = useState<Paint>('red');
  const [b, setB] = useState<Paint>('yellow');
  const key = [a, b].sort().join('+');
  const out = a === b ? PAINT[a] : MIX[key];
  const pots = (value: Paint, set: (p: Paint) => void) => (
    <div className="fig-row" style={{ justifyContent: 'center' }}>
      {(Object.keys(PAINT) as Paint[]).map((p) => (
        <button key={p} type="button" className={`mixer__pot${value === p ? ' is-on' : ''}`} style={{ background: PAINT[p].hex }} aria-pressed={value === p} aria-label={PAINT[p].name[L]} onClick={() => set(p)} />
      ))}
    </div>
  );
  return (
    <div>
      {pots(a, setA)}
      <div className="mixer__eq">
        <span className="mixer__blob" style={{ background: PAINT[a].hex }} />+<span className="mixer__blob" style={{ background: PAINT[b].hex }} />=
        <span className="mixer__blob mixer__blob--big" style={{ background: out.hex }} />
      </div>
      {pots(b, setB)}
      <p className="fig-status is-ok">
        {PAINT[a].name[L]} + {PAINT[b].name[L]} = {out.name[L]}
      </p>
    </div>
  );
}

// ---------- Animals ----------
const LEGS: Card[] = [
  { emoji: '🐦', label: T('Bird', 'Burung'), info: T('A bird has 2 legs.', 'Burung punya 2 kaki.') },
  { emoji: '🐱', label: T('Cat', 'Kucing'), info: T('A cat has 4 legs.', 'Kucing punya 4 kaki.') },
  { emoji: '🐜', label: T('Ant', 'Semut'), info: T('An ant has 6 legs, like every insect.', 'Semut punya 6 kaki, seperti semua serangga.') },
  { emoji: '🕷️', label: T('Spider', 'Laba-laba'), info: T('A spider has 8 legs, so it is not an insect.', 'Laba-laba punya 8 kaki, jadi bukan serangga.') },
  { emoji: '🐍', label: T('Snake', 'Ular'), info: T('A snake has no legs at all!', 'Ular tidak punya kaki sama sekali!') },
];
const SOUNDS: Card[] = [
  { emoji: '🐮', label: T('Cow', 'Sapi'), info: T('Moo!', 'Mooo!') },
  { emoji: '🐶', label: T('Dog', 'Anjing'), info: T('Woof woof!', 'Guk guk!') },
  { emoji: '🦆', label: T('Duck', 'Bebek'), info: T('Quack quack!', 'Kwek kwek!') },
  { emoji: '🐑', label: T('Sheep', 'Domba'), info: T('Baa!', 'Mbeee!') },
  { emoji: '🦁', label: T('Lion', 'Singa'), info: T('ROAR!', 'AUM!') },
];
const HOMES: Card[] = [
  { emoji: '🐟', label: T('Fish', 'Ikan'), info: T('Lives in water.', 'Hidup di air.') },
  { emoji: '🐦', label: T('Bird', 'Burung'), info: T('Flies in the sky and nests in trees.', 'Terbang di langit dan bersarang di pohon.') },
  { emoji: '🐫', label: T('Camel', 'Unta'), info: T('Lives in the hot, sandy desert.', 'Hidup di gurun pasir yang panas.') },
  { emoji: '🐧', label: T('Penguin', 'Penguin'), info: T('Lives where it is icy and cold.', 'Hidup di tempat yang bersalju dan dingin.') },
  { emoji: '🐄', label: T('Cow', 'Sapi'), info: T('Lives on land, on a farm.', 'Hidup di darat, di peternakan.') },
];
export function Legs({ config }: FigureProps) {
  const m = mode(config, 'legs');
  return <TapCards cards={m === 'sounds' ? SOUNDS : m === 'homes' ? HOMES : LEGS} hint={HINT} />;
}

// ---------- Letters ----------
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
export function Letters({ config }: FigureProps) {
  const { settings } = useSettings();
  const L = settings.lang;
  const m = mode(config, 'abc');
  const [i, setI] = useState(0);
  const [tapped, setTapped] = useState<string[]>([]);
  if (m === 'bd') {
    return (
      <TapCards
        cards={[
          { emoji: '👍', label: T('left hand: b', 'tangan kiri: b'), info: T('Make a thumbs-up with your LEFT hand. It looks like a b!', 'Acungkan jempol dengan tangan KIRI. Bentuknya seperti b!') },
          { emoji: '👍', label: T('right hand: d', 'tangan kanan: d'), info: T('Now your RIGHT hand. It looks like a d!', 'Sekarang tangan KANAN. Bentuknya seperti d!') },
          { emoji: '🛏️', label: T('b-e-d', 'b-e-d'), info: T('Put both hands together: b...d makes a little "bed"!', 'Satukan kedua tangan: b...d jadi "bed" (kasur) kecil!') },
        ]}
        hint={HINT}
      />
    );
  }
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  if (m === 'vowels') {
    const found = tapped.filter((x) => VOWELS.has(x)).length;
    return (
      <div>
        <div className="letters">
          {abc.map((c) => (
            <button key={c} type="button" className={`letters__key${tapped.includes(c) ? (VOWELS.has(c) ? ' is-vowel' : ' is-not') : ''}`} onClick={() => setTapped((t) => (t.includes(c) ? t : [...t, c]))}>
              {c}
            </button>
          ))}
        </div>
        <p className={`fig-status${found === 5 ? ' is-ok' : ''}`}>
          {L === 'en' ? `Find the 5 vowels! Found: ${found}/5` : `Temukan 5 huruf vokal! Ketemu: ${found}/5`}
          {found === 5 ? ' ✅' : ''}
        </p>
      </div>
    );
  }
  const WORDS: Record<string, [string, Text]> = {
    A: ['🍎', T('Apple', 'Apel')], B: ['⚽', T('Ball', 'Bola')], C: ['🐱', T('Cat', 'Cicak')], D: ['🐶', T('Dog', 'Domba')],
  };
  const c = abc[i];
  const w = WORDS[c];
  return (
    <div>
      <p className="letters__big">
        {c} {c.toLowerCase()}
      </p>
      {w && <p className="fig-status">{w[0]} {w[1][L]}</p>}
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        <button type="button" className="btn btn--ghost fig-btn" disabled={i === 0} onClick={() => setI((x) => x - 1)}>◀</button>
        <span className="fig-eq">{i + 1}/26</span>
        <button type="button" className="btn fig-btn" disabled={i === 25} onClick={() => setI((x) => x + 1)}>▶</button>
      </div>
    </div>
  );
}

// ---------- Fruits & veggies ----------
const FOODS: { emoji: string; name: Text; fruit: boolean; color: string }[] = [
  { emoji: '🍎', name: T('apple', 'apel'), fruit: true, color: 'red' },
  { emoji: '🥕', name: T('carrot', 'wortel'), fruit: false, color: 'orange' },
  { emoji: '🍌', name: T('banana', 'pisang'), fruit: true, color: 'yellow' },
  { emoji: '🥦', name: T('broccoli', 'brokoli'), fruit: false, color: 'green' },
  { emoji: '🍆', name: T('eggplant', 'terong'), fruit: false, color: 'purple' },
  { emoji: '🍅', name: T('tomato', 'tomat'), fruit: true, color: 'red' },
  { emoji: '🌽', name: T('corn', 'jagung'), fruit: false, color: 'yellow' },
  { emoji: '🍇', name: T('grapes', 'anggur'), fruit: true, color: 'purple' },
];
export function Plate({ config }: FigureProps) {
  const { settings } = useSettings();
  const L = settings.lang;
  const m = mode(config, 'sort');
  const [plate, setPlate] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  if (m === 'rainbow') {
    const colors = new Set(plate.map((i) => FOODS[i].color));
    return (
      <div>
        <div className="plate" aria-label={L === 'en' ? 'Your plate' : 'Piringmu'}>
          {plate.map((i, k) => (
            <span key={k}>{FOODS[i].emoji}</span>
          ))}
        </div>
        <div className="fig-row" style={{ justifyContent: 'center' }}>
          {FOODS.map((f, i) => (
            <button key={f.emoji} type="button" className="btn btn--ghost fig-btn fig-btn--big" aria-label={f.name[L]} onClick={() => setPlate((p) => (p.length >= 8 ? p : [...p, i]))}>
              {f.emoji}
            </button>
          ))}
          <button type="button" className="btn btn--ghost fig-btn" onClick={() => setPlate([])}>↺</button>
        </div>
        <p className={`fig-status${colors.size >= 5 ? ' is-ok' : ''}`}>
          {L === 'en' ? `Colors on your plate: ${colors.size}/5` : `Warna di piringmu: ${colors.size}/5`}
          {colors.size >= 5 ? (L === 'en' ? ' Rainbow plate! ✅' : ' Piring pelangi! ✅') : ''}
        </p>
      </div>
    );
  }
  const shown = m === 'veg' ? FOODS.filter((f) => !f.fruit) : FOODS;
  return (
    <div>
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        {shown.map((f) => {
          const i = FOODS.indexOf(f);
          return (
            <button key={f.emoji} type="button" className="btn btn--ghost fig-btn fig-btn--big" aria-label={f.name[L]} onClick={() => setLast(i)}>
              {f.emoji}
            </button>
          );
        })}
      </div>
      <p className="fig-status">
        {last == null
          ? L === 'en' ? 'Tap a food: fruit or vegetable?' : 'Ketuk makanan: buah atau sayur?'
          : `${FOODS[last].emoji} ${FOODS[last].name[L]}: ${FOODS[last].fruit ? (L === 'en' ? 'a FRUIT (it has seeds inside)' : 'BUAH (ada bijinya)') : L === 'en' ? 'a VEGETABLE' : 'SAYUR'}`}
      </p>
    </div>
  );
}

// ---------- My body ----------
const PARTS: Card[] = [
  { emoji: '👀', label: T('Eyes', 'Mata'), info: T('You have 2 eyes for seeing.', 'Kamu punya 2 mata untuk melihat.') },
  { emoji: '👂', label: T('Ears', 'Telinga'), info: T('You have 2 ears for hearing.', 'Kamu punya 2 telinga untuk mendengar.') },
  { emoji: '👃', label: T('Nose', 'Hidung'), info: T('Your nose smells and breathes.', 'Hidungmu mencium bau dan bernapas.') },
  { emoji: '👄', label: T('Mouth', 'Mulut'), info: T('Your mouth eats, talks and smiles.', 'Mulutmu makan, bicara, dan tersenyum.') },
  { emoji: '✋', label: T('Hands', 'Tangan'), info: T('2 hands with 10 fingers in all.', '2 tangan dengan total 10 jari.') },
  { emoji: '🦶', label: T('Feet', 'Kaki'), info: T('2 feet with 10 toes in all.', '2 kaki dengan total 10 jari kaki.') },
];
const SENSES: Card[] = [
  { emoji: '👀', label: T('See', 'Melihat'), info: T('We SEE with our eyes.', 'Kita MELIHAT dengan mata.') },
  { emoji: '👂', label: T('Hear', 'Mendengar'), info: T('We HEAR with our ears.', 'Kita MENDENGAR dengan telinga.') },
  { emoji: '👃', label: T('Smell', 'Mencium'), info: T('We SMELL with our nose.', 'Kita MENCIUM dengan hidung.') },
  { emoji: '👅', label: T('Taste', 'Mengecap'), info: T('We TASTE with our tongue.', 'Kita MENGECAP dengan lidah.') },
  { emoji: '🖐️', label: T('Touch', 'Meraba'), info: T('We TOUCH and FEEL with our skin.', 'Kita MERABA dengan kulit.') },
];
const INSIDE: Card[] = [
  { emoji: '🧠', label: T('Brain', 'Otak'), info: T('Thinks, learns and remembers.', 'Berpikir, belajar, dan mengingat.') },
  { emoji: '❤️', label: T('Heart', 'Jantung'), info: T('Pumps blood all around your body.', 'Memompa darah ke seluruh tubuh.') },
  { emoji: '🫁', label: T('Lungs', 'Paru-paru'), info: T('Fill with air when you breathe in.', 'Terisi udara saat kamu menarik napas.') },
  { emoji: '🦴', label: T('Bones', 'Tulang'), info: T('Hold your body up, like a frame.', 'Menopang tubuhmu, seperti rangka.') },
];
export function BodyMap({ config }: FigureProps) {
  const m = mode(config, 'parts');
  return <TapCards cards={m === 'senses' ? SENSES : m === 'inside' ? INSIDE : PARTS} hint={HINT} />;
}

// ---------- Weather ----------
const CYCLE: Card[] = [
  { emoji: '☀️', label: T('Sun', 'Matahari'), info: T('The sun warms the water in seas and rivers.', 'Matahari menghangatkan air di laut dan sungai.') },
  { emoji: '💨', label: T('Rising', 'Naik'), info: T('Warm water floats up into the sky as tiny drops.', 'Air hangat naik ke langit sebagai tetes kecil.') },
  { emoji: '☁️', label: T('Cloud', 'Awan'), info: T('The tiny drops gather into clouds.', 'Tetes kecil berkumpul menjadi awan.') },
  { emoji: '🌧️', label: T('Rain', 'Hujan'), info: T('Drops get heavy and fall as rain. Then it starts again!', 'Tetesnya jadi berat dan jatuh sebagai hujan. Lalu mulai lagi!') },
];
const DRESS: Card[] = [
  { emoji: '🌧️', label: T('Rainy', 'Hujan'), info: T('Take an umbrella ☂️ and a raincoat.', 'Bawa payung ☂️ dan jas hujan.') },
  { emoji: '☀️', label: T('Sunny', 'Cerah'), info: T('Wear a hat 🧢 and drink water.', 'Pakai topi 🧢 dan minum air.') },
  { emoji: '❄️', label: T('Cold', 'Dingin'), info: T('Wear a warm jacket 🧥.', 'Pakai jaket hangat 🧥.') },
  { emoji: '⛈️', label: T('Storm', 'Badai'), info: T('Stay safely inside 🏠.', 'Tetap aman di dalam rumah 🏠.') },
];
const SEASONS: Card[] = [
  { emoji: '🌸', label: T('Spring', 'Semi'), info: T('Flowers bloom.', 'Bunga bermekaran.') },
  { emoji: '☀️', label: T('Summer', 'Panas'), info: T('Long, hot days.', 'Hari panjang dan panas.') },
  { emoji: '🍂', label: T('Autumn', 'Gugur'), info: T('Leaves change color and fall.', 'Daun berubah warna dan gugur.') },
  { emoji: '❄️', label: T('Winter', 'Dingin'), info: T('Cold, and it may snow.', 'Dingin, dan bisa turun salju.') },
  { emoji: '🇮🇩', label: T('Indonesia', 'Indonesia'), info: T('Just 2 seasons: rainy and dry!', 'Hanya 2 musim: hujan dan kemarau!') },
];
export function Weather({ config }: FigureProps) {
  const m = mode(config, 'cycle');
  return <TapCards cards={m === 'dress' ? DRESS : m === 'seasons' ? SEASONS : CYCLE} hint={HINT} />;
}

// ---------- Vehicles ----------
type Place = 'land' | 'water' | 'sky';
const RIDES: { emoji: string; name: Text; where: Place }[] = [
  { emoji: '🚗', name: T('car', 'mobil'), where: 'land' },
  { emoji: '⛵', name: T('sailboat', 'perahu layar'), where: 'water' },
  { emoji: '✈️', name: T('plane', 'pesawat'), where: 'sky' },
  { emoji: '🚆', name: T('train', 'kereta'), where: 'land' },
  { emoji: '🚁', name: T('helicopter', 'helikopter'), where: 'sky' },
  { emoji: '🚢', name: T('ship', 'kapal'), where: 'water' },
];
const PLACE: Record<Place, Text> = { land: T('Land', 'Darat'), water: T('Water', 'Air'), sky: T('Sky', 'Udara') };
const HELPERS: Card[] = [
  { emoji: '🚒', label: T('Fire truck', 'Mobil pemadam'), info: T('Brings water and ladders to put out fires.', 'Membawa air dan tangga untuk memadamkan api.') },
  { emoji: '🚑', label: T('Ambulance', 'Ambulans'), info: T('Takes sick people to the hospital.', 'Membawa orang sakit ke rumah sakit.') },
  { emoji: '🚓', label: T('Police car', 'Mobil polisi'), info: T('Helps keep everyone safe.', 'Membantu menjaga semua orang tetap aman.') },
  { emoji: '🚌', label: T('School bus', 'Bus sekolah'), info: T('Takes kids to school together.', 'Mengantar anak-anak ke sekolah bersama.') },
];
export function Vehicles({ config }: FigureProps) {
  const { settings } = useSettings();
  const L = settings.lang;
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState<string>('');
  const [score, setScore] = useState(0);
  if (mode(config, 'sort') === 'helpers') return <TapCards cards={HELPERS} hint={HINT} />;
  const done = i >= RIDES.length;
  const pick = (p: Place) => {
    const r = RIDES[i];
    if (r.where === p) {
      setScore((s) => s + 1);
      setMsg(L === 'en' ? `Yes! A ${r.name.en} goes on ${PLACE[p].en.toLowerCase()}.` : `Ya! ${r.name.id} bergerak di ${PLACE[p].id.toLowerCase()}.`);
      setI((x) => x + 1);
    } else setMsg(L === 'en' ? 'Hmm, think again!' : 'Hmm, pikir lagi!');
  };
  return (
    <div>
      <p className="letters__big" aria-live="polite">{done ? '🏁' : RIDES[i].emoji}</p>
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        {(Object.keys(PLACE) as Place[]).map((p) => (
          <button key={p} type="button" className="btn fig-btn" disabled={done} onClick={() => pick(p)}>
            {p === 'land' ? '🛣️' : p === 'water' ? '🌊' : '☁️'} {PLACE[p][L]}
          </button>
        ))}
        <button type="button" className="btn btn--ghost fig-btn" onClick={() => { setI(0); setScore(0); setMsg(''); }}>↺</button>
      </div>
      <p className={`fig-status${done ? ' is-ok' : ''}`}>{done ? (L === 'en' ? `All sorted! ${score}/${RIDES.length} ✅` : `Semua beres! ${score}/${RIDES.length} ✅`) : msg || (L === 'en' ? 'Where does it go?' : 'Ke mana ia bergerak?')}</p>
    </div>
  );
}

// ---------- Opposites ----------
const PAIRS: [string, Text, string, Text][] = [
  ['🐘', T('big', 'besar'), '🐭', T('small', 'kecil')],
  ['🔥', T('hot', 'panas'), '🧊', T('cold', 'dingin')],
  ['🐇', T('fast', 'cepat'), '🐢', T('slow', 'lambat')],
  ['⬆️', T('up', 'atas'), '⬇️', T('down', 'bawah')],
  ['🌞', T('day', 'siang'), '🌙', T('night', 'malam')],
  ['🥛', T('full', 'penuh'), '🫙', T('empty', 'kosong')],
];
/** Tap a word and the seesaw flips to its opposite. */
export function Seesaw() {
  const { settings } = useSettings();
  const L = settings.lang;
  const [flipped, setFlipped] = useState<boolean[]>(PAIRS.map(() => false));
  return (
    <div>
      <div className="tapcards">
        {PAIRS.map(([e1, w1, e2, w2], i) => (
          <button key={w1.en} type="button" className={`tapcard seesaw${flipped[i] ? ' is-flipped is-seen' : ''}`} onClick={() => setFlipped((f) => f.map((x, j) => (j === i ? !x : x)))}>
            <span className="tapcard__emoji" aria-hidden="true">{flipped[i] ? e2 : e1}</span>
            <span className="tapcard__label">{flipped[i] ? w2[L] : w1[L]}</span>
          </button>
        ))}
      </div>
      <p className="fig-status">{L === 'en' ? 'Tap a word to flip it to its opposite!' : 'Ketuk kata untuk membaliknya ke lawan katanya!'}</p>
    </div>
  );
}

// ---------- Feelings ----------
const FACES: Card[] = [
  { emoji: '😊', label: T('Happy', 'Senang'), info: T('Share your smile with a friend!', 'Bagikan senyummu dengan teman!') },
  { emoji: '😢', label: T('Sad', 'Sedih'), info: T('Talk to someone you trust, or ask for a hug.', 'Bicara dengan orang yang kamu percaya, atau minta pelukan.') },
  { emoji: '😠', label: T('Angry', 'Marah'), info: T('Take 3 deep breaths and say "I feel angry".', 'Tarik napas dalam 3 kali dan katakan "Aku marah".') },
  { emoji: '😨', label: T('Scared', 'Takut'), info: T('Hold a grown-up’s hand and tell them why.', 'Pegang tangan orang dewasa dan ceritakan alasannya.') },
  { emoji: '😲', label: T('Surprised', 'Terkejut'), info: T('Wow! Something unexpected happened.', 'Wah! Ada hal yang tidak terduga.') },
];
/** Breathing buddy: a circle grows and shrinks for 3 slow breaths. */
function Breathe() {
  const { settings } = useSettings();
  const L = settings.lang;
  const [n, setN] = useState(0);
  return (
    <div>
      <div className={`breathe${n > 0 && n <= 3 ? ' is-on' : ''}`} key={n} aria-hidden="true" />
      <button type="button" className="btn fig-btn" disabled={n > 3} onClick={() => setN((x) => x + 1)}>
        {n === 0 ? (L === 'en' ? 'Start breathing' : 'Mulai bernapas') : L === 'en' ? `Breath ${Math.min(n, 3)} of 3 · next` : `Napas ${Math.min(n, 3)} dari 3 · lagi`}
      </button>
      <p className={`fig-status${n > 3 ? ' is-ok' : ''}`}>
        {n > 3 ? (L === 'en' ? 'Well done! Feeling calmer? ✅' : 'Bagus! Sudah lebih tenang? ✅') : L === 'en' ? 'Breathe in as the circle grows, out as it shrinks.' : 'Tarik napas saat lingkaran membesar, hembuskan saat mengecil.'}
      </p>
    </div>
  );
}
export function Faces({ config }: FigureProps) {
  return mode(config, 'faces') === 'breathe' ? <Breathe /> : <TapCards cards={FACES} hint={HINT} />;
}

// ---------- Space ----------
const PLANETS: Card[] = [
  { emoji: '🪨', label: T('Mercury', 'Merkurius'), info: T('1st: closest to the Sun, and the smallest.', 'Ke-1: paling dekat Matahari, dan terkecil.') },
  { emoji: '🌕', label: T('Venus', 'Venus'), info: T('2nd: the hottest planet.', 'Ke-2: planet terpanas.') },
  { emoji: '🌍', label: T('Earth', 'Bumi'), info: T('3rd: our home!', 'Ke-3: rumah kita!') },
  { emoji: '🔴', label: T('Mars', 'Mars'), info: T('4th: the Red Planet.', 'Ke-4: Planet Merah.') },
  { emoji: '🟠', label: T('Jupiter', 'Yupiter'), info: T('5th: the biggest planet.', 'Ke-5: planet terbesar.') },
  { emoji: '🪐', label: T('Saturn', 'Saturnus'), info: T('6th: famous for its rings.', 'Ke-6: terkenal dengan cincinnya.') },
  { emoji: '🔵', label: T('Uranus', 'Uranus'), info: T('7th: spins on its side.', 'Ke-7: berputar miring.') },
  { emoji: '🫐', label: T('Neptune', 'Neptunus'), info: T('8th: the farthest and windiest.', 'Ke-8: terjauh dan paling berangin.') },
];
const SKY: Card[] = [
  { emoji: '☀️', label: T('Sun', 'Matahari'), info: T('A star that gives us light and warmth.', 'Bintang yang memberi cahaya dan kehangatan.') },
  { emoji: '🌍', label: T('Earth', 'Bumi'), info: T('Goes around the Sun once a year.', 'Mengelilingi Matahari sekali setahun.') },
  { emoji: '🌙', label: T('Moon', 'Bulan'), info: T('Goes around the Earth about once a month.', 'Mengelilingi Bumi kira-kira sebulan sekali.') },
  { emoji: '✨', label: T('Stars', 'Bintang'), info: T('Other suns, very, very far away.', 'Matahari lain yang sangat, sangat jauh.') },
];
const ROCKET: Card[] = [
  { emoji: '🚀', label: T('Rocket', 'Roket'), info: T('Blasts fire down to zoom up into space.', 'Menyemburkan api ke bawah untuk meluncur ke angkasa.') },
  { emoji: '👩‍🚀', label: T('Space suit', 'Baju antariksa'), info: T('Has air inside, because space has none.', 'Berisi udara, karena di angkasa tidak ada udara.') },
  { emoji: '🛰️', label: T('Space station', 'Stasiun angkasa'), info: T('A home in space where everything floats.', 'Rumah di angkasa tempat semuanya melayang.') },
];
export function Planets({ config }: FigureProps) {
  const m = mode(config, 'planets');
  return <TapCards cards={m === 'sky' ? SKY : m === 'rocket' ? ROCKET : PLANETS} hint={HINT} />;
}
