import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { GAP, focusedSequence, growShrinkCount } from "./helpers";

export const tiling: LayoutRenderer = ({ width, height, orientation, phase }) => {
  const isVert = orientation === "vertical";
  const halfW = (width - GAP) / 2;
  const halfH = (height - GAP) / 2;
  const rightX = halfW + GAP;
  const bottomY = halfH + GAP;

  const count = growShrinkCount(phase);
  const swap = phase === 4 && count === 3;
  const focused = focusedSequence(phase);

  let pos0: Rect;
  let pos1: Rect;
  let pos2: Rect;

  if (isVert) {
    if (count === 1) {
      pos0 = { x: 0, y: 0, w: width, h: height };
      pos1 = { x: 0, y: bottomY, w: width, h: halfH };
      pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
    } else if (count === 2) {
      pos0 = { x: 0, y: 0, w: width, h: halfH };
      pos1 = { x: 0, y: bottomY, w: width, h: halfH };
      pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
    } else {
      pos0 = { x: 0, y: 0, w: width, h: halfH };
      pos1 = { x: 0, y: bottomY, w: halfW, h: halfH };
      pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
    }
  } else if (count === 1) {
    pos0 = { x: 0, y: 0, w: width, h: height };
    pos1 = { x: rightX, y: 0, w: halfW, h: height };
    pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
  } else if (count === 2) {
    pos0 = { x: 0, y: 0, w: halfW, h: height };
    pos1 = { x: rightX, y: 0, w: halfW, h: height };
    pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
  } else {
    pos0 = { x: 0, y: 0, w: halfW, h: height };
    pos1 = { x: rightX, y: 0, w: halfW, h: halfH };
    pos2 = { x: rightX, y: bottomY, w: halfW, h: halfH };
  }

  const cards: CardFrame[] = [
    {
      ...(swap ? pos2 : pos0),
      visible: phase > 0 && phase < 8,
      active: focused === 1,
    },
    { ...pos1, visible: phase >= 2 && phase < 7, active: focused === 2 },
    {
      ...(swap ? pos0 : pos2),
      visible: phase >= 3 && phase < 6,
      active: focused === 3,
    },
  ];

  return { cards };
};
