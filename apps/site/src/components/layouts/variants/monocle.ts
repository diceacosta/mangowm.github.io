import { effectiveGaps } from "../config";
import type { CardFrame, LayoutRenderer } from "../types";

export const monocle: LayoutRenderer = ({ width, height, phase, config }) => {
  const firstVisible = phase >= 1 && phase < 8;
  const secondVisible = phase >= 2 && phase < 7;
  const count = secondVisible ? 2 : firstVisible ? 1 : 0;
  const g = effectiveGaps(config, count);
  const full = { x: g.oh, y: g.ov, w: width - 2 * g.oh, h: height - 2 * g.ov };

  const cards: CardFrame[] = [
    { ...full, visible: firstVisible, active: phase === 1 || phase === 7 },
    { ...full, visible: secondVisible, active: secondVisible },
  ];

  return { cards };
};
