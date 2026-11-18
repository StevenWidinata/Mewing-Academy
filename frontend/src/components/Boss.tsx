import { useEffect, useRef } from 'react';
import type { Lang } from '../../../shared/types';
import type { BossState } from '../lib/boss';
import type { BossInfo } from '../lib/bosses';

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

/** Pixel sunglasses drawn over a photo boss's eyes when it gloats. */
function PixelShades() {
  return (
    <svg viewBox="0 0 16 5" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: '100%', shapeRendering: 'crispEdges' }}>
      <rect x="0" y="0" width="16" height="1" fill="#1a1430" />
      <rect x="0" y="1" width="7" height="3" fill="#1a1430" />
      <rect x="9" y="1" width="7" height="3" fill="#1a1430" />
      <rect x="1" y="4" width="5" height="1" fill="#1a1430" />
      <rect x="10" y="4" width="5" height="1" fill="#1a1430" />
      <rect x="1" y="1" width="2" height="1" fill="#fdf6e3" />
      <rect x="10" y="1" width="2" height="1" fill="#fdf6e3" />
    </svg>
  );
}

/** A boss picture: Muddle's pixel sprite, or a team photo in an 8-bit frame with effects. */
export function BossPortrait({ boss, width = 84, face = 'normal', mini = false, ko = false }: { boss: BossInfo; width?: number; face?: BossFace; mini?: boolean; ko?: boolean }) {
  if (!boss.photo) return <BossSprite size={width} face={face} mini={mini} />;
  const eyes = boss.eyes ?? { x: 0.5, y: 0.4, w: 0.6 };
  return (
    <span className={`boss-photo${ko ? ' boss-photo--ko' : ''}`} style={{ width, height: Math.round(width * 1.25) }}>
      <img src={`${import.meta.env.BASE_URL}${boss.photo}`} alt={boss.name.en} width={width} height={Math.round(width * 1.25)} draggable={false} />
      {face === 'smug' && !ko && (
        <span
          className="boss-photo__shades"
          style={{ left: `${(eyes.x - eyes.w / 2) * 100}%`, top: `${eyes.y * 100}%`, width: `${eyes.w * 100}%`, height: `${eyes.w * 25}%` }}
        >
          <PixelShades />
        </span>
      )}
      {face === 'hurt' && !ko && (
        <span className="boss-photo__dizzy" aria-hidden="true">
          💫
        </span>
      )}
      {ko && (
        <span className="boss-photo__ko" style={{ fontSize: width < 80 ? '0.5rem' : '0.75rem' }}>
          K.O.!
        </span>
      )}
    </span>
  );
}

const T = {
  boss: { en: 'BOSS', id: 'BOS' },
  boss2: { en: 'BOSS 2', id: 'BOS 2' },
  hint: { en: 'Right answers deal damage. Fast and combo answers hit harder!', id: 'Jawaban benar memberi damage. Cepat dan beruntun lebih kuat!' },
  ko: { en: 'K.O.! But wait... {name} jumps in!', id: 'K.O.! Tapi tunggu... {name} datang!' },
  crit: { en: 'CRITICAL!', id: 'KRITIS!' },
  quick: { en: '⚡ QUICK!', id: '⚡ CEPAT!' },
};

interface BarProps {
  state: BossState;
  /** The round's main boss and the one that jumps in after an early knock-out. */
  main: BossInfo;
  second: BossInfo;
  /** What the last answer did, while its result is shown. */
  reaction: 'none' | 'hit' | 'miss';
  /** Changes on every answer so the hit/miss animation replays. */
  answerKey: number;
  taunt?: string;
  lang: Lang;
  reduceMotion?: boolean;
}

/** Boss card: sprite with reacting face, numeric HP bar, damage numbers and taunts. */
export function BossBar({ state, main, second, reaction, answerKey, taunt, lang, reduceMotion = false }: BarProps) {
  const spriteRef = useRef<HTMLDivElement | null>(null);
  // Show the big boss falling first; Mini Muddle appears on the next question.
  const showKo = reaction === 'hit' && state.koOnLast;
  const mini = state.phase === 2 && !showKo;
  const hp = showKo ? 0 : state.hp;
  const maxHp = showKo ? state.bigMaxHp : state.maxHp;
  const pct = maxHp ? Math.round((hp / maxHp) * 100) : 0;
  const face: BossFace = reaction === 'hit' ? 'hurt' : reaction === 'miss' ? 'smug' : 'normal';
  const done = state.defeated && !showKo;
  const boss = mini ? second : main;

  // Replay a short animation on every answer without remounting the sprite
  // (remounting made the boss blink in and out).
  useEffect(() => {
    const el = spriteRef.current;
    if (!el || reduceMotion || reaction === 'none') return;
    const frames: Keyframe[] =
      reaction === 'hit'
        ? [
            { transform: 'translateX(0)', filter: 'brightness(1.6) sepia(1) saturate(6) hue-rotate(-50deg)' },
            { transform: 'translateX(-8px) rotate(-4deg)', filter: 'brightness(1.3) sepia(1) saturate(4) hue-rotate(-50deg)' },
            { transform: 'translateX(8px) rotate(4deg)', filter: 'brightness(1.4)' },
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
          <BossPortrait boss={boss} width={mini ? 64 : 84} face={face} mini={mini && !boss.photo} ko={showKo || done} />
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
        <strong className="boss__name">
          {mini ? T.boss2[lang] : T.boss[lang]}: {boss.name[lang]}
        </strong>
        <div className="boss__hpbar" role="meter" aria-valuemin={0} aria-valuemax={maxHp} aria-valuenow={hp} aria-label="Boss HP">
          <div className="boss__hpfill" style={{ width: `${pct}%`, background: pct > 50 ? 'var(--green)' : pct > 20 ? 'var(--yellow)' : 'var(--red)' }} />
          <span className="boss__hptext">
            {hp} / {maxHp} HP
          </span>
        </div>
        <small>{showKo ? T.ko[lang].replace('{name}', second.name[lang]) : done ? `💥 ${boss.ko[lang]}` : T.hint[lang]}</small>
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
