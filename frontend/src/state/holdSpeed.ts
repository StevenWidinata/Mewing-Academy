export type HoldSpeed = 'slow' | 'normal' | 'fast';

/** How long a finger pose must be held to count as an answer. */
export const HOLD_MS: Record<HoldSpeed, number> = { slow: 1800, normal: 1200, fast: 800 };

export const HOLD_SPEEDS = Object.keys(HOLD_MS) as HoldSpeed[];
