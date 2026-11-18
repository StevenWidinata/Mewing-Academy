import { STAGES, type StageId } from '../lib/mewyStage';
import { FURS, type FurId, type ItemId } from '../state/rewards';
import { useSettings } from '../state/settings';

// Mewy: the Mewing Academy mascot, drawn as pixel art (no image assets).
// Fur color, outfit and mood are all drawn from the same 16-wide grid.
// Rows -4..-1 hold hats; rows 13..15 hold neckwear.

export type Mood = 'idle' | 'happy' | 'sad' | 'think';

type Rect = (x1: number, y1: number, x2: number, y2: number, c: string) => void;

const K = '#1a1430';
const PINK = '#ff5ca8';
const CYAN = '#27e0d8';
const W = '#fdf6e3';
const RED = '#e83b3b';
const GOLD = '#ffcc00';
const BLUE = '#3b7be8';
const GREEN = '#3bb54a';
const RAINBOW = ['#e83b3b', '#ff8a1f', '#ffcc00', '#3bb54a', '#3b7be8', '#9b4de0'];

/** Capes and wings sit behind the head, so they are drawn first. */
function drawItemBehind(item: ItemId, r: Rect) {
  switch (item) {
    case 'flipcape':
      r(0, 7, 1, 15, RED); r(14, 7, 15, 15, BLUE); r(2, 13, 7, 15, RED); r(8, 13, 13, 15, BLUE);
      break;
    case 'herocape':
      r(0, 6, 1, 15, RED); r(14, 6, 15, 15, RED); r(2, 13, 13, 15, RED);
      break;
    case 'wings':
      RAINBOW.forEach((c, i) => {
        r(0, 4 + i, 1, 4 + i, c);
        r(14, 4 + i, 15, 4 + i, c);
      });
      r(1, 3, 1, 3, W); r(14, 3, 14, 3, W);
      break;
  }
}

function drawItem(item: ItemId, r: Rect) {
  switch (item) {
    case 'glasses':
      r(4, 5, 7, 5, K); r(8, 5, 11, 5, K);
      r(4, 5, 4, 8, K); r(11, 5, 11, 8, K); r(7, 5, 7, 7, K); r(8, 5, 8, 7, K);
      r(4, 8, 6, 8, K); r(9, 8, 11, 8, K);
      break;
    case 'partyhat':
      r(5, 2, 10, 2, PINK); r(6, 1, 9, 1, CYAN); r(6, 0, 9, 0, PINK);
      r(7, -1, 8, -1, CYAN); r(7, -2, 8, -2, PINK); r(7, -3, 8, -3, W);
      break;
    case 'gradcap':
      r(2, 1, 13, 1, K); r(5, 2, 10, 2, K); r(7, 0, 8, 0, K); r(13, 2, 13, 4, CYAN);
      break;
    case 'wizard': {
      const P = '#6b3fa0';
      r(2, 2, 13, 2, P); r(5, 0, 10, 1, P); r(6, -2, 9, -1, P); r(7, -3, 8, -3, P); r(8, -4, 9, -4, P);
      r(7, 0, 7, 0, '#ffcc00'); r(8, -2, 8, -2, '#ffcc00');
      break;
    }
    case 'safari':
      r(2, 2, 13, 2, '#c9a26b'); r(5, 1, 10, 1, '#7a4f2a'); r(5, -1, 10, 0, '#c9a26b');
      break;
    case 'beret':
      r(3, 2, 10, 2, RED); r(4, 1, 11, 1, RED); r(5, 0, 10, 0, RED); r(8, -1, 8, -1, RED);
      break;
    case 'scarf':
      r(3, 13, 12, 13, RED); r(10, 14, 11, 15, RED);
      r(5, 13, 5, 13, W); r(8, 13, 8, 13, W); r(11, 13, 11, 13, W);
      break;
    case 'bow':
      r(5, 13, 6, 14, CYAN); r(9, 13, 10, 14, CYAN); r(7, 13, 8, 14, '#1a8f8a');
      break;
    case 'spacehelmet': {
      const G = '#9fd8ff';
      r(5, -3, 10, -3, G); r(3, -2, 4, -2, G); r(11, -2, 12, -2, G); r(2, -1, 2, 0, G); r(13, -1, 13, 0, G);
      r(1, 1, 1, 11, G); r(14, 1, 14, 11, G); r(2, 12, 13, 13, '#c9c9d9'); r(7, -4, 8, -4, RED);
      r(3, -1, 3, -1, W);
      break;
    }
    case 'rainhat':
      r(1, 2, 14, 2, GOLD); r(4, 0, 11, 1, GOLD); r(5, -1, 10, -1, GOLD); r(4, 1, 11, 1, '#e0a800');
      break;
    case 'racercap':
      r(3, 1, 12, 2, RED); r(4, 0, 11, 0, RED); r(10, 2, 15, 2, K); r(7, 0, 8, 2, W);
      break;
    case 'fruithat':
      r(5, -1, 10, 1, RED); r(6, -2, 9, -2, RED); r(4, 0, 4, 1, RED); r(11, 0, 11, 1, RED);
      r(8, -4, 8, -3, '#7a4f2a'); r(9, -4, 10, -4, GREEN); r(6, -1, 6, -1, W);
      break;
    case 'doctor':
      r(3, 2, 12, 2, '#d9d9e3'); r(6, -1, 9, 1, '#c0c0d0'); r(7, 0, 8, 0, W);
      break;
    case 'heartpin': {
      const P = '#ff5ca8';
      r(5, 13, 6, 13, P); r(9, 13, 10, 13, P); r(5, 14, 10, 14, P); r(6, 15, 9, 15, P); r(7, 13, 8, 13, P);
      r(6, 13, 6, 13, W);
      break;
    }
    case 'hopears':
      r(5, -4, 6, 2, W); r(9, -4, 10, 2, W); r(5, -3, 5, 1, PINK); r(10, -3, 10, 1, PINK); r(4, 2, 11, 2, '#ff8a1f');
      break;
    case 'pocketwatch':
      r(4, 13, 7, 13, GOLD); r(8, 13, 11, 15, GOLD); r(9, 14, 10, 14, W); r(9, 14, 9, 14, K);
      break;
    case 'flipcape':
      r(5, 13, 10, 13, K);
      break;
    case 'crown':
      r(3, 0, 12, 2, GOLD); r(3, -2, 3, -1, GOLD); r(7, -3, 8, -1, GOLD); r(12, -2, 12, -1, GOLD);
      r(5, 1, 5, 1, RED); r(10, 1, 10, 1, CYAN); r(7, 1, 8, 1, PINK);
      break;
    case 'herocape':
      r(6, 13, 9, 14, GOLD); r(7, 13, 8, 13, RED);
      break;
    case 'wings':
      break;
  }
}

interface Props {
  size?: number;
  title?: string;
  fur?: FurId;
  /** undefined = use the saved outfit; null = no outfit. */
  item?: ItemId | null;
  mood?: Mood;
  /** Where the eyes look, each -1..1 (pixels on the 16-wide grid). */
  look?: { x: number; y: number };
  /** Growth stage (from the best streak); today's kitten when left out. */
  stage?: StageId;
}

export function Mewy({ size = 64, title = 'Mewy the mascot', fur, item, mood = 'idle', look, stage = 'kitten' }: Props) {
  const { settings } = useSettings();
  const furId = fur ?? settings.mewyFur;
  const outfit = item === undefined ? settings.mewyItem : item;
  const f = FURS.find((x) => x.id === furId) ?? FURS[0];
  const eye = f.eye ?? K;

  const cells: [number, number, string][] = [];
  const r: Rect = (x1, y1, x2, y2, c) => {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) cells.push([x, y, c]);
  };

  const grown = stage === 'teen' || stage === 'adult' || stage === 'legend';
  // Legend: a starry cape behind everything.
  if (stage === 'legend') {
    r(0, 6, 1, 15, '#3a2a7a'); r(14, 6, 14, 15, '#3a2a7a'); r(2, 13, 13, 15, '#3a2a7a');
    r(0, 8, 0, 8, GOLD); r(1, 12, 1, 12, GOLD); r(14, 10, 14, 10, GOLD); r(4, 14, 4, 14, GOLD); r(11, 14, 11, 14, GOLD);
  }
  if (outfit) drawItemBehind(outfit, r);
  // Grown-up: a long tail curling up on the right.
  if (stage === 'adult' || stage === 'legend') {
    r(14, 12, 15, 12, f.main); r(15, 8, 15, 11, f.main); r(15, 7, 15, 7, f.shade);
  }
  // Ears (baby: small and round; teen and up: tall and pointy)
  if (stage === 'baby') {
    r(3, 2, 4, 3, f.main); r(11, 2, 12, 3, f.main); r(3, 3, 3, 3, PINK); r(12, 3, 12, 3, PINK);
  } else {
    r(2, 1, 3, 3, f.main); r(12, 1, 13, 3, f.main); r(3, 2, 3, 3, PINK); r(12, 2, 12, 3, PINK);
    if (grown) { r(2, -1, 2, 0, f.main); r(13, -1, 13, 0, f.main); }
  }
  // Head
  r(3, 3, 12, 12, f.main); r(2, 5, 2, 10, f.main); r(13, 5, 13, 10, f.main);
  r(3, 11, 12, 12, f.shade);
  if (furId === 'calico') {
    r(3, 3, 5, 5, '#ff9a3c'); r(10, 9, 12, 11, '#3a3550'); r(11, 3, 12, 4, '#3a3550');
  }
  // Eyes (looking up when thinking, or toward `look`)
  const lx = Math.max(-1, Math.min(1, look?.x ?? 0));
  const ey = (mood === 'think' ? 5 : 6) + Math.max(-1, Math.min(1, look?.y ?? 0));
  r(5 + lx, ey, 6 + lx, ey + 1, eye); r(9 + lx, ey, 10 + lx, ey + 1, eye);
  r(5 + lx, ey, 5 + lx, ey, W); r(9 + lx, ey, 9 + lx, ey, W);
  // Nose
  r(7, 8, 8, 8, PINK);
  // Mouth by mood
  if (mood === 'happy') { r(6, 9, 6, 9, K); r(9, 9, 9, 9, K); r(7, 10, 8, 10, K); }
  else if (mood === 'sad') { r(7, 9, 8, 9, K); r(6, 10, 6, 10, K); r(9, 10, 9, 10, K); }
  else if (mood === 'think') { r(7, 9, 8, 10, K); }
  else { r(6, 9, 6, 9, K); r(9, 9, 9, 9, K); r(7, 9, 8, 9, K); }

  // Baby: rosy cheeks.
  if (stage === 'baby') { r(3, 9, 4, 9, '#ff9ccf'); r(11, 9, 12, 9, '#ff9ccf'); }

  if (outfit) drawItem(outfit, r);
  const scale = STAGES.find((s) => s.id === stage)?.scale ?? 1;

  return (
    <svg
      className={stage === 'legend' ? 'mewy--legend' : undefined}
      width={size * scale}
      height={size * scale * 1.25}
      viewBox="0 -4 16 20"
      role="img"
      aria-label={title}
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
    >
      {cells.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={c} />
      ))}
    </svg>
  );
}
