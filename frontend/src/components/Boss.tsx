import { useEffect, useRef } from 'react';
import type { Lang } from '../../../shared/types';
import type { BossState } from '../lib/boss';

export type BossFace = 'normal' | 'hurt' | 'smug';

// Pixel slime "boss" (14x12). G = body, D = shade, K = dark, W = white, R = red.
const BODY_TOP = ['....GGGGGG....', '..GGGGGGGGGG..', '.GGGGGGGGGGGG.'];
const BODY_BOTTOM = ['.DDGGGGGGGGDD.', '...DDDDDDDD...'];
const FACES: Record<BossFace, string[]> = {
  normal: [
    '.GGWWGGGGWWGG.',
    'GGGWKGGGGWKGGG',
    'GGGWKGGGGWKGGG',
    'GGGGGGGGGGGGGG',
    'GGGGKKKKKKGGGG',
    'GGGGKRRRRKGGGG',
    'DGGGGKKKKGGGGD',
  ],
  // 😵‍💫 dizzy X eyes, mouth wide open
  hurt: [
    '.GKGKGGGGKGKG.',
    'GGGKGGGGGGKGGG',
    'GGKGKGGGGKGKGG',
    'GGGGGGGGGGGGGG',
    'GGGGGKKKKGGGGG',
    'GGGGKRRRRKGGGG',
    'DGGGGKKKKGGGGD',
  ],
  // 😏 half-closed eyes and a lopsided smirk
  smug: [
    '.GGKKGGGGKKGG.',
    'GGGWKGGGGWKGGG',
    'GGGGGGGGGGGGGG',
    'GGGGGGGGGGGGGG',
    'GGGGGGGGGGKGGG',
    'GGGGKKKKKKGGGG',
    'DGGGGGGGGGGGGD',
  ],
};
const PAL = { K: '#1a1430', W: '#fdf6e3', R: '#ff5ca8' };
const BIG = { G: '#7a5cff', D: '#4b34b8' };
const MINI = { G: '#3bb54a', D: '#257a31' };

export function BossSprite({ size = 96, face = 'normal', mini = false }: { size?: number; face?: BossFace; mini?: boolean }) {
  const pal: Record<string, string> = { ...PAL, ...(mini ? MINI : BIG) };
  const rows = [...BODY_TOP, ...FACES[face], ...BODY_BOTTOM];
  return (
    <svg width={size} height={(size * 12) / 14} viewBox="0 0 14 12" role="img" aria-label={mini ? 'Mini Muddle' : 'Muddle Slime'} style={{ shapeRendering: 'crispEdges' }}>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={pal[ch]} />)),
      )}
    </svg>
  );
}

const T = {
  big: { en: 'BOSS: Muddle Slime', id: 'BOS: Slime Bingung' },
  mini: { en: 'MINI BOSS: Mini Muddle', id: 'BOS MINI: Bingung Kecil' },
  hint: { en: 'Right answers deal damage. Fast and combo answers hit harder!', id: 'Jawaban benar memberi damage. Cepat dan beruntun lebih kuat!' },
  ko: { en: 'K.O.! But wait... Mini Muddle jumps out!', id: 'K.O.! Tapi tunggu... Bingung Kecil muncul!' },
  won: { en: 'Defeated! 🎉', id: 'Kalah! 🎉' },
  crit: { en: 'CRITICAL!', id: 'KRITIS!' },
  quick: { en: '⚡ QUICK!', id: '⚡ CEPAT!' },
};

interface BarProps {
  state: BossState;
  /** What the last answer did, while its result is shown. */
  reaction: 'none' | 'hit' | 'miss';
  /** Changes on every answer so the hit/miss animation replays. */
  answerKey: number;
  taunt?: string;
  lang: Lang;
  reduceMotion?: boolean;
}

/** Boss card: sprite with reacting face, numeric HP bar, damage numbers and taunts. */
export function BossBar({ state, reaction, answerKey, taunt, lang, reduceMotion = false }: BarProps) {
  const spriteRef = useRef<HTMLDivElement | null>(null);
  // Show the big boss falling first; Mini Muddle appears on the next question.
  const showKo = reaction === 'hit' && state.koOnLast;
  const mini = state.phase === 2 && !showKo;
  const hp = showKo ? 0 : state.hp;
  const maxHp = showKo ? state.bigMaxHp : state.maxHp;
  const pct = maxHp ? Math.round((hp / maxHp) * 100) : 0;
  const face: BossFace = reaction === 'hit' ? 'hurt' : reaction === 'miss' ? 'smug' : 'normal';
  const done = state.defeated && !showKo;

  // Replay a short animation on every answer without remounting the sprite
  // (remounting made the boss blink in and out).
  useEffect(() => {
    const el = spriteRef.current;
    if (!el || reduceMotion || reaction === 'none') return;
    const frames: Keyframe[] =
      reaction === 'hit'
        ? [
            { transform: 'translateX(0)', filter: 'brightness(3) hue-rotate(90deg)' },
            { transform: 'translateX(-8px) skewX(12deg)', filter: 'brightness(1.6) hue-rotate(-60deg)' },
            { transform: 'translateX(8px) skewX(-12deg)', filter: 'brightness(2)' },
            { transform: 'translateX(-3px)', filter: 'none' },
            { transform: 'none', filter: 'none' },
          ]
        : [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px) rotate(-6deg)' },
            { transform: 'translateY(0) rotate(4deg)' },
            { transform: 'translateY(-4px)' },
            { transform: 'none' },
          ];
    const anim = el.animate(frames, { duration: reaction === 'hit' ? 520 : 650, easing: 'ease-out' });
    return () => anim.cancel();
  }, [answerKey, reaction, reduceMotion]);

  return (
    <div className={`boss${mini ? ' boss--mini' : ''}${showKo || done ? ' boss--ko' : ''}`} aria-live="polite">
      <div className="boss__stage">
        <div ref={spriteRef} className="boss__sprite">
          <BossSprite size={mini ? 56 : 72} face={face} mini={mini} />
        </div>
        {reaction === 'hit' && state.lastHit && (
          <span key={answerKey} className="boss__dmg" aria-label={`-${state.lastHit.damage} HP`}>
            -{state.lastHit.damage}
            {state.lastHit.crit && <small className="boss__tag boss__tag--crit">{T.crit[lang]}</small>}
            {state.lastHit.quick && <small className="boss__tag">{T.quick[lang]}</small>}
          </span>
        )}
        {reaction === 'miss' && taunt && (
          <span key={answerKey} className="boss__bubble" role="status">
            {taunt}
          </span>
        )}
      </div>
      <div className="boss__info">
        <strong className="boss__name">{mini ? T.mini[lang] : T.big[lang]}</strong>
        <div className="boss__hpbar" role="meter" aria-valuemin={0} aria-valuemax={maxHp} aria-valuenow={hp} aria-label="Boss HP">
          <div className="boss__hpfill" style={{ width: `${pct}%`, background: pct > 50 ? 'var(--green)' : pct > 20 ? 'var(--yellow)' : 'var(--red)' }} />
          <span className="boss__hptext">
            {hp} / {maxHp} HP
          </span>
        </div>
        <small>{showKo ? T.ko[lang] : done ? T.won[lang] : T.hint[lang]}</small>
      </div>
    </div>
  );
}

/** "x3 COMBO!" pop with sparks, shown from 2 right answers in a row. */
export function ComboPop({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <div key={streak} className="combo" aria-live="polite">
      <span className="combo__text">x{streak} COMBO!</span>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <span key={k} className="combo__spark" style={{ '--a': `${k * 45}deg` } as React.CSSProperties} />
      ))}
    </div>
  );
}
