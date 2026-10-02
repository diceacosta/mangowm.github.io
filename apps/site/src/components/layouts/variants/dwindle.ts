import type { CardFrame, LayoutRenderer, Rect } from "../types";
import { GAP } from "./helpers";

function dwindleState(phase: number, phaseElapsed: number): { count: number; swap: boolean } {
  switch (phase) {
    case 0:
      return { count: 0, swap: false };
    case 1:
      return { count: 1, swap: false };
    case 2:
      return { count: phaseElapsed >= 500 ? 3 : 2, swap: false };
    case 3:
      return { count: phaseElapsed >= 750 ? 5 : 4, swap: false };
    case 4:
      return { count: 5, swap: true };
    case 5:
      return { count: 5, swap: false };
    case 6:
      return { count: phaseElapsed >= 500 ? 3 : 4, swap: false };
    case 7:
      return { count: phaseElapsed >= 500 ? 1 : 2, swap: false };
    default:
      return { count: 0, swap: false };
  }
}

function dwindleRects(count: number, width: number, height: number): Rect[] {
  const rects: Rect[] = [];
  if (count === 0) return rects;
  rects.push({ x: 0, y: 0, w: width, h: height });

  for (let i = 1; i < count; i++) {
    const parent = rects[i - 1];
    if (!parent) break;

    if (parent.w >= parent.h) {
      const w1 = (parent.w - GAP) / 2;
      const w2 = parent.w - GAP - w1;
      rects[i - 1] = { ...parent, w: w1 };
      rects.push({ x: parent.x + w1 + GAP, y: parent.y, w: w2, h: parent.h });
    } else {
      const h1 = (parent.h - GAP) / 2;
      const h2 = parent.h - GAP - h1;
      rects[i - 1] = { ...parent, h: h1 };
      rects.push({ x: parent.x, y: parent.y + h1 + GAP, w: parent.w, h: h2 });
    }
  }

  return rects;
}

export const dwindle: LayoutRenderer = ({ width, height, phase, phaseElapsed }) => {
  const { count, swap } = dwindleState(phase, phaseElapsed);
  const layouts: Rect[][] = [
    dwindleRects(0, width, height),
    ...Array.from({ length: 5 }, (_, i) => dwindleRects(i + 1, width, height)),
  ];
  const fallback: Rect = { x: 0, y: 0, w: width, h: height };

  const target = (index: number): Rect => {
    const size = Math.max(count, index + 1);
    return layouts[size]?.[index] ?? fallback;
  };

  let pos3 = target(3);
  let pos4 = target(4);
  if (swap && count === 5) {
    [pos3, pos4] = [pos4, pos3];
  }

  const focused = Math.max(1, count);
  const positions = [target(0), target(1), target(2), pos3, pos4];

  const cards: CardFrame[] = positions.map((rect, index) => ({
    ...rect,
    visible: count >= index + 1,
    active: focused === index + 1,
  }));

  return { cards };
};
