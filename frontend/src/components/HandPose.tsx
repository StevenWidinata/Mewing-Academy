import type { FingerPose } from '../vision/fingers';

interface Props {
  pose: FingerPose;
  size?: number;
  /** Accessible description, e.g. "2 fingers". Omit to hide from screen readers. */
  label?: string;
}

// Pixel-style hand: thumb on the left, then index, middle, ring, pinky.
// Raised fingers are tall and solid; lowered ones are faded stubs. Drawing the
// hand (instead of printing a number) avoids clashing with number answers.
const FINGERS = [
  { x: 8, up: 12 }, // index
  { x: 13, up: 14 }, // middle
  { x: 18, up: 12 }, // ring
  { x: 23, up: 9 }, // pinky
];
const PALM_TOP = 16;

export function HandPose({ pose, size = 28, label }: Props) {
  const [thumb, ...rest] = pose;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 32"
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ flex: 'none', display: 'block' }}
    >
      <rect x={7} y={PALM_TOP} width={20} height={14} fill="currentColor" />
      {FINGERS.map((f, i) => {
        const h = rest[i] ? f.up : 3;
        return <rect key={i} x={f.x} y={PALM_TOP - h} width={4} height={h} fill="currentColor" opacity={rest[i] ? 1 : 0.35} />;
      })}
      {thumb ? (
        <rect x={1} y={14} width={6} height={5} fill="currentColor" />
      ) : (
        <rect x={4} y={19} width={3} height={5} fill="currentColor" opacity={0.35} />
      )}
    </svg>
  );
}
