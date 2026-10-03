import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { focusedSequence, growShrinkCount, tileRects } from "./helpers";

export const tiling: LayoutRenderer = ({ width, height, orientation, phase, config }) => {
  const count = growShrinkCount(phase);
  const focused = focusedSequence(phase);
  const swap = phase === 4 && count === 3;

  const rects = tileRects(count, width, height, orientation, config);
  const at = (index: number): Rect => rects[index] ?? { x: 0, y: 0, w: width, h: height };

  const cards: CardFrame[] = [
    {
      ...(swap ? at(2) : at(0)),
      visible: phase > 0 && phase < 8,
      active: focused === 1,
    },
    { ...at(1), visible: phase >= 2 && phase < 7, active: focused === 2 },
    {
      ...(swap ? at(0) : at(2)),
      visible: phase >= 3 && phase < 6,
      active: focused === 3,
    },
  ];

  return { cards };
};
