import type { CardFrame, LayoutRenderer, Rect } from "@/components/layouts/types";
import { focusedSequence, progressiveCount, tileRects } from "./helpers";

export const rightTile: LayoutRenderer = ({ width, height, phase, config }) => {
  const count = progressiveCount(phase);
  const focused = focusedSequence(phase);
  const swap = phase === 4;

  const rects = tileRects(count, width, height, "horizontal", config, true);
  const at = (index: number): Rect => rects[index] ?? { x: 0, y: 0, w: width, h: height };

  const master = swap && count === 3 ? at(2) : at(0);
  const third = phase >= 3 && phase < 6 ? (swap ? at(0) : at(2)) : at(2);

  const cards: CardFrame[] = [
    { ...master, visible: phase > 0 && phase < 8, active: focused === 1 },
    { ...at(1), visible: phase >= 2 && phase < 7, active: focused === 2 },
    { ...third, visible: phase >= 3 && phase < 6, active: focused === 3 },
  ];

  return { cards };
};
