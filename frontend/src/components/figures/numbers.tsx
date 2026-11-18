import { useState } from 'react';
import type { Text } from '../../../../shared/types';
import { useSettings } from '../../state/settings';
import type { FigureProps } from './registry';

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
const str = (v: unknown, d: string) => (typeof v === 'string' ? v : d);

function Done({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p className={`fig-status${ok ? ' is-ok' : ''}`} aria-live="polite">
      {ok ? '✅ ' : ''}
      {children}
    </p>
  );
}

/** Ten-frame: tap the boxes to place counters until you have the target number. */
export function TenFrame({ config }: FigureProps) {
  const { settings } = useSettings();
  const target = num(config?.target, 5);
  const [on, setOn] = useState<boolean[]>(Array(10).fill(false));
  const count = on.filter(Boolean).length;
  const en = settings.lang === 'en';
  return (
    <div>
      <div className="tenframe" role="group" aria-label={en ? 'Ten frame' : 'Bingkai sepuluh'}>
        {on.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`tenframe__cell${v ? ' is-on' : ''}`}
            aria-pressed={v}
            aria-label={`${i + 1}`}
            onClick={() => setOn((list) => list.map((x, j) => (j === i ? !x : x)))}
          >
            {v ? '🔴' : ''}
          </button>
        ))}
      </div>
      <Done ok={count === target}>
        {en ? `You have ${count}. Goal: ${target}.` : `Kamu punya ${count}. Target: ${target}.`}
      </Done>
    </div>
  );
}

/** Apples: add two groups, or tap apples to eat them and see what is left. */
export function Apples({ config }: FigureProps) {
  const { settings } = useSettings();
  const en = settings.lang === 'en';
  const op = str(config?.op, 'plus');
  const [a, setA] = useState(num(config?.a, 2));
  const [b, setB] = useState(num(config?.b, 1));
  const [eaten, setEaten] = useState<boolean[]>(Array(num(config?.start, 5)).fill(false));

  if (op === 'minus') {
    const gone = eaten.filter(Boolean).length;
    return (
      <div>
        <div className="apples" role="group" aria-label={en ? 'Tap apples to eat them' : 'Ketuk apel untuk memakannya'}>
          {eaten.map((e, i) => (
            <button key={i} type="button" className={`apples__one${e ? ' is-eaten' : ''}`} aria-pressed={e} onClick={() => setEaten((l) => l.map((x, j) => (j === i ? !x : x)))}>
              {e ? '🍏' : '🍎'}
            </button>
          ))}
        </div>
        <p className="fig-eq">
          {eaten.length} - {gone} = {eaten.length - gone}
        </p>
        <p className="fig-status">{en ? 'Tap an apple to eat it. Count what is left!' : 'Ketuk apel untuk memakannya. Hitung sisanya!'}</p>
      </div>
    );
  }
  const step = (set: (f: (n: number) => number) => void, d: number) => set((n) => Math.max(0, Math.min(5, n + d)));
  return (
    <div>
      <div className="apples apples--two">
        <div className="apples__group">
          <span aria-hidden="true">{'🍎'.repeat(a) || '·'}</span>
          <div className="fig-row">
            <button type="button" className="btn btn--ghost fig-btn" onClick={() => step(setA, -1)} aria-label="-1">−</button>
            <button type="button" className="btn btn--ghost fig-btn" onClick={() => step(setA, 1)} aria-label="+1">+</button>
          </div>
        </div>
        <span className="fig-eq">+</span>
        <div className="apples__group">
          <span aria-hidden="true">{'🍏'.repeat(b) || '·'}</span>
          <div className="fig-row">
            <button type="button" className="btn btn--ghost fig-btn" onClick={() => step(setB, -1)} aria-label="-1">−</button>
            <button type="button" className="btn btn--ghost fig-btn" onClick={() => step(setB, 1)} aria-label="+1">+</button>
          </div>
        </div>
      </div>
      <p className="fig-eq">
        {a} + {b} = {a + b}
      </p>
      <p className="fig-status">{en ? 'Change the groups and count them all together.' : 'Ubah kelompoknya dan hitung semuanya bersama.'}</p>
    </div>
  );
}

/** Number line: a frog hops by 1, 2, 5 or 10. */
export function Hopper({ config }: FigureProps) {
  const { settings } = useSettings();
  const en = settings.lang === 'en';
  const jump = num(config?.step, 2);
  const max = num(config?.max, 20);
  const [at, setAt] = useState(0);
  const marks = Array.from({ length: max / jump + 1 }, (_, i) => i * jump);
  const done = at >= max;
  return (
    <div>
      <div className="hopper" aria-label={en ? 'Number line' : 'Garis bilangan'}>
        {marks.map((m) => (
          <span key={m} className={`hopper__mark${m <= at ? ' is-hit' : ''}${m === at ? ' is-here' : ''}`}>
            {m === at && <span className="hopper__frog" aria-hidden="true">🐸</span>}
            {m}
          </span>
        ))}
      </div>
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        <button type="button" className="btn fig-btn" disabled={done} onClick={() => setAt((x) => Math.min(max, x + jump))}>
          {en ? `Hop +${jump}!` : `Loncat +${jump}!`}
        </button>
        <button type="button" className="btn btn--ghost fig-btn" onClick={() => setAt(0)}>
          ↺
        </button>
      </div>
      <Done ok={done}>{done ? (en ? `You reached ${max}!` : `Kamu sampai di ${max}!`) : en ? `The frog is on ${at}.` : `Kataknya di angka ${at}.`}</Done>
    </div>
  );
}

/** Clock: move the short (hour) hand and the long (minute) hand to match the goal. */
export function Clock({ config }: FigureProps) {
  const { settings } = useSettings();
  const en = settings.lang === 'en';
  const goalH = num(config?.hour, 3);
  const goalHalf = num(config?.half, 0) === 1;
  const [h, setH] = useState(12);
  const [half, setHalf] = useState(false);
  const hourAngle = ((h % 12) + (half ? 0.5 : 0)) * 30;
  const minAngle = half ? 180 : 0;
  const say = (hh: number, hf: boolean) =>
    hf ? (en ? `half past ${hh}` : `setengah ${(hh % 12) + 1}`) : en ? `${hh} o'clock` : `jam ${hh}`;
  const ok = h === goalH && half === goalHalf;
  return (
    <div>
      <svg viewBox="-55 -55 110 110" className="clock" role="img" aria-label={say(h, half)}>
        <circle r="50" fill="#fdf6e3" stroke="#1a1430" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) * 30 * Math.PI) / 180;
          return (
            <text key={i} x={Math.sin(a) * 38} y={-Math.cos(a) * 38 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1430">
              {i + 1}
            </text>
          );
        })}
        <line x1="0" y1="0" x2="0" y2="-40" stroke="#3b7be8" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minAngle})`} />
        <line x1="0" y1="0" x2="0" y2="-24" stroke="#e83b3b" strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourAngle})`} />
        <circle r="3" fill="#1a1430" />
      </svg>
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        <button type="button" className="btn btn--ghost fig-btn" onClick={() => setH((x) => (x === 1 ? 12 : x - 1))}>◀ {en ? 'short hand' : 'jarum pendek'}</button>
        <button type="button" className="btn btn--ghost fig-btn" onClick={() => setH((x) => (x === 12 ? 1 : x + 1))}>{en ? 'short hand' : 'jarum pendek'} ▶</button>
        <button type="button" className="btn btn--secondary fig-btn" onClick={() => setHalf((x) => !x)}>
          {en ? 'long hand' : 'jarum panjang'}: {half ? '6' : '12'}
        </button>
      </div>
      <Done ok={ok}>
        {en ? `It is ${say(h, half)}. Goal: ${say(goalH, goalHalf)}.` : `Sekarang ${say(h, half)}. Target: ${say(goalH, goalHalf)}.`}
      </Done>
    </div>
  );
}

const DAYS: Text[] = [
  { en: 'Monday', id: 'Senin' }, { en: 'Tuesday', id: 'Selasa' }, { en: 'Wednesday', id: 'Rabu' }, { en: 'Thursday', id: 'Kamis' },
  { en: 'Friday', id: 'Jumat' }, { en: 'Saturday', id: 'Sabtu' }, { en: 'Sunday', id: 'Minggu' },
];

/** Week wheel: tap "next day" and watch the week start again after Sunday. */
export function Week() {
  const { settings } = useSettings();
  const L = settings.lang;
  const [d, setD] = useState(0);
  return (
    <div>
      <ol className="week">
        {DAYS.map((day, i) => (
          <li key={day.en} className={i === d ? 'is-now' : undefined}>
            {day[L].slice(0, 3)}
          </li>
        ))}
      </ol>
      <p className="fig-eq">{DAYS[d][L]}</p>
      <button type="button" className="btn fig-btn" onClick={() => setD((x) => (x + 1) % 7)}>
        {L === 'en' ? 'Next day ▶' : 'Hari berikutnya ▶'}
      </button>
      <p className="fig-status">
        {L === 'en' ? `After ${DAYS[d].en} comes ${DAYS[(d + 1) % 7].en}.` : `Setelah ${DAYS[d].id} adalah ${DAYS[(d + 1) % 7].id}.`}
      </p>
    </div>
  );
}

const PATTERNS: Record<string, string[]> = { ab: ['🔴', '🔵'], abc: ['🔴', '🟡', '🔵'], aab: ['⭐', '⭐', '❤️'] };

/** Pattern builder: continue the pattern by tapping the right piece for each empty spot. */
export function Pattern({ config }: FigureProps) {
  const { settings } = useSettings();
  const en = settings.lang === 'en';
  const core = PATTERNS[str(config?.kind, 'ab')] ?? PATTERNS.ab;
  const shown = [...core, ...core];
  const answer = [...core, ...core].slice(0, 3);
  const [filled, setFilled] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const palette = [...new Set(core)];
  const pick = (p: string) => {
    if (filled.length >= 3) return;
    if (p === answer[filled.length]) {
      setFilled((f) => [...f, p]);
      setWrong(false);
    } else setWrong(true);
  };
  const done = filled.length === 3;
  return (
    <div>
      <div className="pattern">
        {shown.map((p, i) => (
          <span key={i} className="pattern__slot">{p}</span>
        ))}
        {[0, 1, 2].map((i) => (
          <span key={`b${i}`} className={`pattern__slot is-blank${filled[i] ? ' is-filled' : ''}`}>
            {filled[i] ?? '?'}
          </span>
        ))}
      </div>
      <div className="fig-row" style={{ justifyContent: 'center' }}>
        {palette.map((p) => (
          <button key={p} type="button" className="btn btn--ghost fig-btn fig-btn--big" onClick={() => pick(p)} disabled={done}>
            {p}
          </button>
        ))}
        <button type="button" className="btn btn--ghost fig-btn" onClick={() => setFilled([])}>↺</button>
      </div>
      <Done ok={done}>{done ? (en ? 'You continued the pattern!' : 'Kamu melanjutkan polanya!') : wrong ? (en ? 'Not that one. What repeats?' : 'Bukan itu. Apa yang berulang?') : en ? 'What comes next?' : 'Apa selanjutnya?'}</Done>
    </div>
  );
}

const SHAPES: Record<string, { name: Text; pts: [number, number][] }> = {
  circle: { name: { en: 'circle', id: 'lingkaran' }, pts: [] },
  triangle: { name: { en: 'triangle', id: 'segitiga' }, pts: [[50, 8], [92, 88], [8, 88]] },
  square: { name: { en: 'square', id: 'persegi' }, pts: [[15, 15], [85, 15], [85, 85], [15, 85]] },
  rectangle: { name: { en: 'rectangle', id: 'persegi panjang' }, pts: [[5, 25], [95, 25], [95, 75], [5, 75]] },
  pentagon: { name: { en: 'pentagon', id: 'segi lima' }, pts: [[50, 6], [94, 38], [77, 92], [23, 92], [6, 38]] },
  hexagon: { name: { en: 'hexagon', id: 'segi enam' }, pts: [[28, 8], [72, 8], [94, 50], [72, 92], [28, 92], [6, 50]] },
};

/** Corner counter: tap every corner of the shape. */
export function Corners({ config }: FigureProps) {
  const { settings } = useSettings();
  const L = settings.lang;
  const en = L === 'en';
  const [shape, setShape] = useState(str(config?.shape, 'triangle'));
  const [hit, setHit] = useState<number[]>([]);
  const s = SHAPES[shape] ?? SHAPES.triangle;
  const done = s.pts.length > 0 && hit.length === s.pts.length;
  return (
    <div>
      <svg viewBox="0 0 100 100" className="corners" role="img" aria-label={s.name[L]}>
        {s.pts.length ? (
          <polygon points={s.pts.map((p) => p.join(',')).join(' ')} fill="#9fd8ff" stroke="#1a1430" strokeWidth="3" />
        ) : (
          <circle cx="50" cy="50" r="42" fill="#9fd8ff" stroke="#1a1430" strokeWidth="3" />
        )}
        {s.pts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="7"
            className={`corners__dot${hit.includes(i) ? ' is-hit' : ''}`}
            role="button"
            aria-label={`${en ? 'corner' : 'sudut'} ${i + 1}`}
            tabIndex={0}
            onClick={() => setHit((h) => (h.includes(i) ? h : [...h, i]))}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setHit((h) => (h.includes(i) ? h : [...h, i]))}
          />
        ))}
      </svg>
      <div className="fig-row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {Object.keys(SHAPES).map((k) => (
          <button key={k} type="button" className={`btn ${k === shape ? '' : 'btn--ghost'} fig-btn`} aria-pressed={k === shape} onClick={() => { setShape(k); setHit([]); }}>
            {SHAPES[k].name[L]}
          </button>
        ))}
      </div>
      <Done ok={done || s.pts.length === 0}>
        {s.pts.length === 0
          ? en ? 'A circle has no corners to tap!' : 'Lingkaran tidak punya sudut untuk diketuk!'
          : en ? `${hit.length} corners found. A ${s.name.en} has ${done ? s.pts.length : '?'} corners.` : `${hit.length} sudut ditemukan. ${s.name.id} punya ${done ? s.pts.length : '?'} sudut.`}
      </Done>
    </div>
  );
}
