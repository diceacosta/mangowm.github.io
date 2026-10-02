export const GAP = 16;

/** Focused card (1-indexed) for the shared grow/shrink/swap cycle. */
export const focusedSequence = (phase: number): number =>
  phase <= 1 ? 1 : phase === 2 ? 2 : phase <= 5 ? 3 : phase === 6 ? 2 : 1;

/** Number of visible cards for the shared grow/shrink cycle (tiling, grid). */
export const growShrinkCount = (phase: number): number => {
  if (phase >= 3 && phase <= 5) return 3;
  if (phase === 6 || phase === 2) return 2;
  if (phase >= 7 || phase === 1) return 1;
  return 0;
};

/** Number of visible cards for the progressive cycle (center/right tile). */
export const progressiveCount = (phase: number): number => {
  if (phase >= 7) return 1;
  if (phase < 1) return 0;
  if (phase >= 3 && phase <= 5) return 3;
  return phase >= 2 ? 2 : 1;
};
