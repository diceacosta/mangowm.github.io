import type { LayoutConfig } from "../config";
import { effectiveGaps } from "../config";
import type { Orientation, Rect } from "../types";

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

export function tileRects(
  count: number,
  width: number,
  height: number,
  orientation: Orientation,
  config: LayoutConfig,
  masterOnRight = false,
): Rect[] {
  if (count <= 0) return [];

  const nmaster = Math.min(config.nmaster, count);
  const stackNum = count - nmaster;
  const g = effectiveGaps(config, count);
  const rects: Rect[] = [];

  if (orientation === "vertical") {
    const mh = count > config.nmaster ? (height + g.iv) * config.mfact : height - 2 * g.ov + g.iv;
    const masterW = (width - 2 * g.oh - g.ih * (nmaster - 1)) / nmaster;
    for (let i = 0; i < nmaster; i++) {
      rects.push({ x: g.oh + i * (masterW + g.ih), y: g.ov, w: masterW, h: mh - g.iv });
    }
    if (stackNum > 0) {
      const stackW = (width - 2 * g.oh - g.ih * (stackNum - 1)) / stackNum;
      const stackH = height - mh - 2 * g.ov;
      for (let i = 0; i < stackNum; i++) {
        rects.push({ x: g.oh + i * (stackW + g.ih), y: mh + g.ov, w: stackW, h: stackH });
      }
    }
    return rects;
  }

  const mw = count > config.nmaster ? (width + g.ih) * config.mfact : width - 2 * g.oh + g.ih;
  const masterW = mw - g.ih;
  const masterX = masterOnRight ? width - mw - g.oh + g.ih : g.oh;
  const masterH = (height - 2 * g.ov - g.iv * (nmaster - 1)) / nmaster;
  for (let i = 0; i < nmaster; i++) {
    rects.push({ x: masterX, y: g.ov + i * (masterH + g.iv), w: masterW, h: masterH });
  }
  if (stackNum > 0) {
    const stackX = masterOnRight ? g.oh : mw + g.oh;
    const stackW = width - mw - 2 * g.oh;
    const stackH = (height - 2 * g.ov - g.iv * (stackNum - 1)) / stackNum;
    for (let i = 0; i < stackNum; i++) {
      rects.push({ x: stackX, y: g.ov + i * (stackH + g.iv), w: stackW, h: stackH });
    }
  }
  return rects;
}
