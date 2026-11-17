/** Questions per Hand Quiz round the player can choose from. */
export const ROUND_SIZES = [5, 10, 15] as const;
export type RoundSize = (typeof ROUND_SIZES)[number];
