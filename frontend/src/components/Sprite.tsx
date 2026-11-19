import { COLORS, type ColorId, type SpriteGroup, type SpriteId } from '../../../shared/types';

const INK = '#1a1430';

/** A single colored shape, drawn as SVG so color and shape are both honored. */
function Shape({ sprite, color, size }: { sprite: SpriteId; color: ColorId; size: number }) {
  const hex = COLORS[color].hex;
  const name = `${COLORS[color].name.en} ${sprite}`;
  if (sprite === 'square') return <svg width={size} height={size} role="img" aria-label={name}><rect x={1} y={1} width={size - 2} height={size - 2} fill={hex} stroke="#1a1430" strokeWidth={3} /></svg>;
  if (sprite === 'triangle') return <svg width={size} height={size} role="img" aria-label={name}><polygon points={`${size / 2},2 ${size - 2},${size - 2} 2,${size - 2}`} fill={hex} stroke="#1a1430" strokeWidth={3} /></svg>;
  if (sprite === 'ball') return <svg width={size} height={size} role="img" aria-label={name}><circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={hex} stroke="#1a1430" strokeWidth={3} /></svg>;
  if (sprite === 'star') return <svg width={size} height={size} role="img" aria-label={name}><polygon points={star(size)} fill={hex} stroke="#1a1430" strokeWidth={2} /></svg>;
  if (sprite === 'heart') return <svg width={size} height={size} role="img" aria-label={name}><path d={heart(size)} fill={hex} stroke="#1a1430" strokeWidth={2} /></svg>;
  // Apple and fish are drawn too: hue-rotating an emoji gave wrong colors
  // (the fish emoji is blue, so "green" came out pink).
  if (sprite === 'apple') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name}>
        <path d="M50 28 L55 9" stroke="#6b3e1f" strokeWidth={6} strokeLinecap="round" />
        <path d="M55 17 C62 5 78 5 82 10 C76 19 63 21 55 17 Z" fill="#2e8b3a" stroke={INK} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
        <path
          d="M50 28 C38 18 13 20 12 47 C11 72 30 94 42 92 C46 91 48 89 50 89 C52 89 54 91 58 92 C70 94 89 72 88 47 C87 20 62 18 50 28 Z"
          fill={hex}
          stroke={INK}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
        <ellipse cx={31} cy={46} rx={6} ry={11} fill="#ffffff" opacity={0.45} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name}>
      <polygon points="70,50 96,26 96,74" fill={hex} stroke={INK} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <ellipse cx={44} cy={50} rx={34} ry={24} fill={hex} stroke={INK} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      <path d="M40 27 C46 16 58 16 62 29" fill={hex} stroke={INK} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      <path d="M50 38 C56 46 56 54 50 62" fill="none" stroke={INK} strokeWidth={2} opacity={0.6} vectorEffect="non-scaling-stroke" />
      <circle cx={25} cy={45} r={6} fill="#fdf6e3" stroke={INK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <circle cx={24} cy={45} r={3} fill={INK} />
    </svg>
  );
}

function star(s: number): string {
  const cx = s / 2;
  const cy = s / 2;
  const spikes = 5;
  const outer = s / 2 - 2;
  const inner = outer / 2.3;
  let pts = '';
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts += `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r} `;
  }
  return pts.trim();
}

function heart(s: number): string {
  const w = s - 4;
  const x = 2;
  const y = 3;
  return `M${x + w / 2},${y + w * 0.85} C${x},${y + w * 0.4} ${x + w * 0.1},${y} ${x + w / 2},${y + w * 0.28} C${x + w * 0.9},${y} ${x + w},${y + w * 0.4} ${x + w / 2},${y + w * 0.85} Z`;
}

export function SpriteScene({ groups, size = 56 }: { groups: SpriteGroup[]; size?: number }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', maxWidth: size * 4 }}>
          {Array.from({ length: g.count }, (_, i) => (
            <span key={i} className="pop" style={{ display: 'inline-flex' }}>
              <Shape sprite={g.sprite} color={g.color} size={size} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ColorSwatch({ color, size = 20 }: { color: ColorId; size?: number }) {
  return (
    <span
      aria-hidden="true"
      // The light inner ring keeps the swatch visible on a card of the same
      // color (yellow on a yellow card, green on the green "right answer" card).
      style={{ display: 'inline-block', flexShrink: 0, width: size, height: size, background: COLORS[color].hex, border: `2px solid ${INK}`, boxShadow: 'inset 0 0 0 2px #fdf6e3', verticalAlign: 'middle', marginRight: 8 }}
    />
  );
}
