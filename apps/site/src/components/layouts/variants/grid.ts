import type { CardFrame, LayoutRenderer, Orientation, Rect } from "../types";
import { GAP, focusedSequence, growShrinkCount } from "./helpers";

const SINGLE_PAD_H = 0.1;
const SINGLE_PAD_V = 0.15;

function buildGrid(n: number, width: number, height: number, orientation: Orientation): Rect[] {
  if (n === 0) return [];

  if (n === 1) {
    const w = width * (1 - SINGLE_PAD_H * 2);
    const h = height * (1 - SINGLE_PAD_V * 2);
    return [{ x: (width - w) / 2, y: (height - h) / 2, w, h }];
  }

  if (n === 2) {
    if (orientation === "horizontal") {
      const rowH = height * (1 - SINGLE_PAD_V * 2);
      const startY = (height - rowH) / 2;
      const w = (width - GAP) / 2;
      return [
        { x: 0, y: startY, w, h: rowH },
        { x: w + GAP, y: startY, w, h: rowH },
      ];
    }
    const colW = width * (1 - SINGLE_PAD_H * 2);
    const startX = (width - colW) / 2;
    const h = (height - GAP) / 2;
    return [
      { x: startX, y: 0, w: colW, h },
      { x: startX, y: h + GAP, w: colW, h },
    ];
  }

  const cols =
    orientation === "horizontal" ? Math.ceil(Math.sqrt(n)) : Math.ceil(n / Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);
  const cellW = (width - (cols - 1) * GAP) / cols;
  const cellH = (height - (rows - 1) * GAP) / rows;

  if (orientation === "horizontal") {
    const gridH = rows * cellH + (rows - 1) * GAP;
    const startY = (height - gridH) / 2;
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const itemsInRow = row === rows - 1 ? n - row * cols : cols;
      const rowW = itemsInRow * cellW + (itemsInRow - 1) * GAP;
      const rowStartX = (width - rowW) / 2;
      return {
        x: rowStartX + col * (cellW + GAP),
        y: startY + row * (cellH + GAP),
        w: cellW,
        h: cellH,
      };
    });
  }

  const gridW = cols * cellW + (cols - 1) * GAP;
  const startX = (width - gridW) / 2;
  return Array.from({ length: n }, (_, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const itemsInCol = col === cols - 1 ? n - col * rows : rows;
    const colH = itemsInCol * cellH + (itemsInCol - 1) * GAP;
    const colStartY = (height - colH) / 2;
    return {
      x: startX + col * (cellW + GAP),
      y: colStartY + row * (cellH + GAP),
      w: cellW,
      h: cellH,
    };
  });
}

export const grid: LayoutRenderer = ({ width, height, orientation, phase }) => {
  const count = growShrinkCount(phase);
  const swap = phase === 4;
  const focused = focusedSequence(phase);

  const positions = buildGrid(count, width, height, orientation);
  const at = (index: number): Rect => positions[index] ?? { x: 0, y: 0, w: width, h: height };
  const first = buildGrid(1, width, height, orientation)[0] ?? { x: 0, y: 0, w: width, h: height };

  const cards: CardFrame[] = [
    count >= 1
      ? { ...(swap ? at(2) : at(0)), visible: phase > 0 && phase < 8, active: focused === 1 }
      : { x: 0, y: 0, w: width, h: height, visible: false, active: false },
    count >= 2
      ? { ...at(1), visible: phase >= 2 && phase < 7, active: focused === 2 }
      : { x: width, y: height, w: first.w / 2, h: first.h, visible: false, active: false },
    count >= 3
      ? { ...(swap ? at(0) : at(2)), visible: phase >= 3 && phase < 6, active: focused === 3 }
      : { x: width, y: height, w: width / 2, h: height / 2, visible: false, active: false },
  ];

  return { cards };
};
