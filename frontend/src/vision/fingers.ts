// Pure geometry: turn MediaPipe hand landmarks into an answer index (0=A..3=D).
// Kept DOM-free so it can be unit tested.

export interface Point {
  x: number;
  y: number;
  z?: number;
}

// MediaPipe hand landmark indices.
const WRIST = 0;
const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 } as const;
const PIPS = { thumb: 2, index: 6, middle: 10, ring: 14, pinky: 18 } as const;

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * A finger is "extended" if its tip is farther from the wrist than its middle
 * joint (PIP). This is rotation-tolerant and works for either hand. The thumb
 * is judged the same way but needs a larger margin because it bends sideways.
 */
export function extendedFingers(lm: Point[]): {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
} {
  const wrist = lm[WRIST];
  const isUp = (tip: number, pip: number, margin: number) =>
    dist(lm[tip], wrist) > dist(lm[pip], wrist) * margin;
  return {
    thumb: isUp(TIPS.thumb, PIPS.thumb, 1.35),
    index: isUp(TIPS.index, PIPS.index, 1.05),
    middle: isUp(TIPS.middle, PIPS.middle, 1.05),
    ring: isUp(TIPS.ring, PIPS.ring, 1.05),
    pinky: isUp(TIPS.pinky, PIPS.pinky, 1.05),
  };
}

/** Five flags in hand order: thumb, index, middle, ring, pinky. */
export type FingerPose = [boolean, boolean, boolean, boolean, boolean];

/** Why there is no answer, so the UI can tell the child what to change. */
export type UnclearReason =
  | 'no-hand'
  | 'fist' // nothing raised
  | 'open-hand' // all five up: a child showing "5", not an answer
  | 'too-many'; // more fingers than there are answers

export interface Classification {
  /** 0=A, 1=B, 2=C, 3=D, or null if the gesture is unclear. */
  answer: number | null;
  /** Count of raised fingers, thumb excluded (what the answer is based on). */
  raised: number;
  /** Which fingers were seen, for drawing the hand on screen. */
  pose: FingerPose;
  reason: UnclearReason | null;
}

const NO_POSE: FingerPose = [false, false, false, false, false];

/**
 * Count how many fingers are up (ignoring the thumb): 1=A .. 4=D.
 * (A "point" mode where a lone middle finger meant B was removed: that is
 * a rude gesture.)
 * An open hand (all five up) is never an answer: on number questions kids
 * hold up five fingers to mean "5", which used to silently pick D.
 * Returns null when ambiguous so we never guess for a child.
 */
export function classify(lm: Point[] | undefined, choiceCount: number): Classification {
  if (!lm || lm.length < 21) return { answer: null, raised: 0, pose: NO_POSE, reason: 'no-hand' };
  const f = extendedFingers(lm);
  const fingers = [f.index, f.middle, f.ring, f.pinky];
  const raised = fingers.filter(Boolean).length;
  const pose: FingerPose = [f.thumb, f.index, f.middle, f.ring, f.pinky];
  const unclear = (reason: UnclearReason): Classification => ({ answer: null, raised, pose, reason });

  if (raised === 0) return unclear('fist');
  if (raised === 4 && f.thumb) return unclear('open-hand');

  if (raised > choiceCount) return unclear('too-many');
  return { answer: raised - 1, raised, pose, reason: null };
}

/** The finger pose a child should make to pick `answer` (for the hint drawings). */
export function poseFor(answer: number): FingerPose {
  const fingers = [0, 1, 2, 3].map((i) => i <= answer);
  return [false, fingers[0], fingers[1], fingers[2], fingers[3]];
}

/** True if any answer label contains a digit, i.e. kids may show the number with fingers. */
export function hasNumberLabels(labels: string[]): boolean {
  return labels.some((l) => /\d/.test(l));
}
