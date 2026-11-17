import { describe, expect, it } from 'vitest';
import { classify, extendedFingers, hasNumberLabels, poseFor, type Point } from './fingers';

// Build a synthetic hand. Wrist at bottom; each finger either extended (tip far)
// or curled (tip near the PIP). Coordinates are normalized like MediaPipe (0..1,
// y grows downward), so "up" means a smaller y / larger distance from wrist.
function hand(up: { thumb?: boolean; index?: boolean; middle?: boolean; ring?: boolean; pinky?: boolean }): Point[] {
  const lm: Point[] = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.9 }));
  lm[0] = { x: 0.5, y: 0.95 }; // wrist
  const finger = (tip: number, pip: number, x: number, extended: boolean) => {
    lm[pip] = { x, y: 0.6 };
    lm[tip] = extended ? { x, y: 0.3 } : { x, y: 0.66 }; // curled tip sits just past pip
  };
  finger(4, 2, 0.35, up.thumb ?? false); // thumb spreads sideways
  if (up.thumb) lm[4] = { x: 0.1, y: 0.5 }; // far enough out to count as raised
  finger(8, 6, 0.45, up.index ?? false);
  finger(12, 10, 0.5, up.middle ?? false);
  finger(16, 14, 0.55, up.ring ?? false);
  finger(20, 18, 0.6, up.pinky ?? false);
  return lm;
}

describe('extendedFingers', () => {
  it('detects a single raised index finger', () => {
    const f = extendedFingers(hand({ index: true }));
    expect(f.index).toBe(true);
    expect([f.middle, f.ring, f.pinky]).toEqual([false, false, false]);
  });

  it('detects all four fingers up', () => {
    const f = extendedFingers(hand({ index: true, middle: true, ring: true, pinky: true }));
    expect([f.index, f.middle, f.ring, f.pinky]).toEqual([true, true, true, true]);
  });
});

describe('classify', () => {
  it('counts raised fingers 1..4 -> A..D', () => {
    expect(classify(hand({ index: true }), 4).answer).toBe(0);
    expect(classify(hand({ index: true, middle: true }), 4).answer).toBe(1);
    expect(classify(hand({ index: true, middle: true, ring: true }), 4).answer).toBe(2);
    expect(classify(hand({ index: true, middle: true, ring: true, pinky: true }), 4).answer).toBe(3);
  });

  it('returns null for a closed fist', () => {
    expect(classify(hand({}), 4).answer).toBeNull();
    expect(classify(hand({}), 4).raised).toBe(0);
  });
});

describe('guards', () => {
  it('handles missing landmarks', () => {
    expect(classify(undefined, 4).answer).toBeNull();
    expect(classify([{ x: 0, y: 0 }], 4).answer).toBeNull();
  });
});

describe('open hand (showing "5")', () => {
  const open = () => hand({ thumb: true, index: true, middle: true, ring: true, pinky: true });

  it('detects the thumb when it sticks out', () => {
    expect(extendedFingers(open()).thumb).toBe(true);
  });

  it('is never an answer (used to pick D)', () => {
    const r = classify(open(), 4);
    expect(r.answer).toBeNull();
    expect(r.reason).toBe('open-hand');
  });

  it('is never an answer in point mode', () => {
    expect(classify(open(), 4).reason).toBe('open-hand');
  });

  it('four fingers with the thumb tucked still picks D', () => {
    expect(classify(hand({ index: true, middle: true, ring: true, pinky: true }), 4).answer).toBe(3);
  });

  it('a thumb next to one finger still counts as one', () => {
    expect(classify(hand({ thumb: true, index: true }), 4).answer).toBe(0);
  });
});

describe('unclear reasons', () => {
  it('explains why there is no answer', () => {
    expect(classify(undefined, 4).reason).toBe('no-hand');
    expect(classify(hand({}), 4).reason).toBe('fist');
    expect(classify(hand({ index: true, middle: true, ring: true, pinky: true }), 3).reason).toBe('too-many');
    expect(classify(hand({ index: true, middle: true }), 4).reason).toBeNull();
  });
});

describe('poseFor (answer hint drawings)', () => {
  it('raises the first N fingers, thumb tucked', () => {
    expect(poseFor(0)).toEqual([false, true, false, false, false]);
    expect(poseFor(2)).toEqual([false, true, true, true, false]);
  });

  it('round-trips through classify', () => {
    for (let i = 0; i < 4; i++) {
      const [, index, middle, ring, pinky] = poseFor(i);
      expect(classify(hand({ index, middle, ring, pinky }), 4).answer).toBe(i);
    }
  });

  it('never asks for a lone middle finger', () => {
    for (let i = 0; i < 4; i++) {
      const [, index, middle] = poseFor(i);
      expect(middle && !index).toBe(false);
    }
  });
});

describe('hasNumberLabels', () => {
  it('spots number answers', () => {
    expect(hasNumberLabels(['5', '3', '7'])).toBe(true);
    expect(hasNumberLabels(['Red', 'Blue'])).toBe(false);
  });
});
