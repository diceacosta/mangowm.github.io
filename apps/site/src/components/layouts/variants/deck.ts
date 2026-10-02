import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { GAP, focusedSequence } from "./helpers";

export const deck: LayoutRenderer = ({ width, height, orientation, phase }) => {
  const isVert = orientation === "vertical";

  const master: Rect = isVert
    ? { x: 0, y: 0, w: width, h: (height - GAP) / 2 }
    : { x: 0, y: 0, w: (width - GAP) / 2, h: height };

  const stack: Rect = isVert
    ? { x: 0, y: (height - GAP) / 2 + GAP, w: width, h: (height - GAP) / 2 }
    : { x: (width - GAP) / 2 + GAP, y: 0, w: (width - GAP) / 2, h: height };

  const exit: Rect = isVert
    ? { x: 0, y: height, w: width, h: (height - GAP) / 2 }
    : { x: width, y: 0, w: (width - GAP) / 2, h: height };

  const fullScreen: Rect = { x: 0, y: 0, w: width, h: height };
  const count = phase <= 1 ? 1 : phase === 2 ? 2 : phase <= 5 ? 3 : phase === 6 ? 2 : 1;
  const swap = phase === 4;
  const focused = focusedSequence(phase);

  const zIndex = (id: number) => {
    let z = id;
    if (id === 1 && swap) z = 10;
    if (focused === id) z += 20;
    return z;
  };

  const base = count === 1 ? fullScreen : master;

  const cards: CardFrame[] = [
    phase < 8
      ? {
          ...(swap ? stack : base),
          visible: phase >= 1,
          active: focused === 1,
          z: zIndex(1),
        }
      : { ...fullScreen, visible: false, active: false, z: 1 },
    phase < 7
      ? { ...stack, visible: phase >= 2, active: focused === 2, z: zIndex(2) }
      : { ...exit, visible: false, active: false, z: 2 },
    phase < 6
      ? { ...(swap ? master : stack), visible: phase >= 3, active: focused === 3, z: zIndex(3) }
      : { ...exit, visible: false, active: false, z: 3 },
  ];

  return { cards };
};
