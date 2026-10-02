import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { GAP, focusedSequence, progressiveCount } from "./helpers";

export const centerTile: LayoutRenderer = ({ width, height, phase }) => {
  const availW = width - 2 * GAP;
  const unit = availW / 4;
  const sideW = unit;
  const centreW = unit * 2;
  const xCentre = sideW + GAP;
  const xRight = sideW + centreW + 2 * GAP;

  const centre: Rect = { x: xCentre, y: 0, w: centreW, h: height };
  const leftSlot: Rect = { x: 0, y: 0, w: sideW, h: height };
  const rightSlot: Rect = { x: xRight, y: 0, w: sideW, h: height };
  const offRight: Rect = { x: width, y: 0, w: sideW, h: height };

  const count = progressiveCount(phase);
  const swap = phase === 4;
  const focused = focusedSequence(phase);

  // With 3 windows the second card moves to the left slot; with 2 it sits right.
  const second = count >= 3 ? leftSlot : rightSlot;

  const cards: CardFrame[] = [
    count >= 1
      ? { ...(swap ? rightSlot : centre), visible: phase > 0 && phase < 8, active: focused === 1 }
      : { ...centre, visible: false, active: false },
    count >= 2
      ? { ...second, visible: phase >= 2 && phase < 7, active: focused === 2 }
      : { ...offRight, visible: false, active: false },
    count >= 3
      ? { ...(swap ? centre : rightSlot), visible: phase >= 3 && phase < 6, active: focused === 3 }
      : { ...offRight, visible: false, active: false },
  ];

  return { cards };
};
