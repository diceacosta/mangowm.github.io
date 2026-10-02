import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { GAP, focusedSequence, progressiveCount } from "./helpers";

export const rightTile: LayoutRenderer = ({ width, height, phase }) => {
  const halfW = (width - GAP) / 2;
  const halfH = (height - GAP) / 2;
  const rightX = halfW + GAP;
  const bottomY = halfH + GAP;

  const count = progressiveCount(phase);
  const swap = phase === 4;
  const focused = focusedSequence(phase);

  let master: Rect;
  let stackTop: Rect;
  let stackBottom: Rect;

  if (count === 1) {
    master = { x: 0, y: 0, w: width, h: height };
    stackTop = { x: 0, y: 0, w: halfW, h: height };
    stackBottom = { x: 0, y: bottomY, w: halfW, h: halfH };
  } else if (count === 2) {
    master = { x: rightX, y: 0, w: halfW, h: height };
    stackTop = { x: 0, y: 0, w: halfW, h: height };
    stackBottom = { x: 0, y: bottomY, w: halfW, h: halfH };
  } else {
    master = { x: rightX, y: 0, w: halfW, h: height };
    stackTop = { x: 0, y: 0, w: halfW, h: halfH };
    stackBottom = { x: 0, y: bottomY, w: halfW, h: halfH };
  }

  const third = phase >= 3 && phase < 6 ? (swap ? master : stackBottom) : stackBottom;

  const cards: CardFrame[] = [
    {
      ...(swap && count === 3 ? stackBottom : master),
      visible: phase > 0 && phase < 8,
      active: focused === 1,
    },
    { ...stackTop, visible: phase >= 2 && phase < 7, active: focused === 2 },
    { ...third, visible: phase >= 3 && phase < 6, active: focused === 3 },
  ];

  return { cards };
};
