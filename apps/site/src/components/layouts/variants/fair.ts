import type { CardFrame, LayoutRenderer, Orientation, Rect } from "../types";

const GAP = 12;

export function calculateFairLayout(
  n: number,
  containerW: number,
  containerH: number,
  gap: number,
  orientation: Orientation,
): Rect[] {
  if (n <= 0) return [];
  const rects: Rect[] = [];

  if (orientation === "horizontal") {
    const cols = Math.ceil(Math.sqrt(n));
    const baseRows = Math.floor(n / cols);
    const remainder = n % cols;
    const firstGroupCols = cols - remainder;
    const firstGroupCount = firstGroupCols * baseRows;
    const maxRows = baseRows + (remainder > 0 ? 1 : 0);
    const availW = containerW - (cols - 1) * gap;
    const cw = availW / cols;

    for (let i = 0; i < n; i++) {
      const isFirstGroup = i < firstGroupCount;
      const colIdx = isFirstGroup
        ? Math.floor(i / baseRows)
        : firstGroupCols + Math.floor((i - firstGroupCount) / maxRows);
      const rowIdx = isFirstGroup ? i % baseRows : (i - firstGroupCount) % maxRows;
      const rowsInThisCol = isFirstGroup ? baseRows : maxRows;
      const availH = containerH - (rowsInThisCol - 1) * gap;
      const ch = availH / rowsInThisCol;
      rects.push({
        x: colIdx * (cw + gap),
        y: rowIdx * (ch + gap),
        w: cw,
        h: ch,
      });
    }
  } else {
    const rows = Math.ceil(Math.sqrt(n));
    const baseCols = Math.floor(n / rows);
    const remainder = n % rows;
    const firstGroupRows = rows - remainder;
    const firstGroupCount = firstGroupRows * baseCols;
    const maxCols = baseCols + (remainder > 0 ? 1 : 0);
    const availH = containerH - (rows - 1) * gap;
    const ch = availH / rows;

    for (let i = 0; i < n; i++) {
      const isFirstGroup = i < firstGroupCount;
      const rowIdx = isFirstGroup
        ? Math.floor(i / baseCols)
        : firstGroupRows + Math.floor((i - firstGroupCount) / maxCols);
      const colIdx = isFirstGroup ? i % baseCols : (i - firstGroupCount) % maxCols;
      const colsInThisRow = isFirstGroup ? baseCols : maxCols;
      const availW = containerW - (colsInThisRow - 1) * gap;
      const cw = availW / colsInThisRow;
      rects.push({
        x: colIdx * (cw + gap),
        y: rowIdx * (ch + gap),
        w: cw,
        h: ch,
      });
    }
  }

  return rects;
}

function fairState(phase: number, phaseElapsed: number): { count: number; swap: boolean } {
  switch (phase) {
    case 0:
      return { count: 0, swap: false };
    case 1:
      return { count: 1, swap: false };
    case 2:
      return { count: phaseElapsed >= 500 ? 3 : 2, swap: false };
    case 3:
      return { count: phaseElapsed >= 600 ? 5 : 4, swap: false };
    case 4:
      return { count: 5, swap: true };
    case 5:
      return { count: 5, swap: false };
    case 6:
      return { count: phaseElapsed >= 500 ? 4 : 5, swap: false };
    case 7:
      return { count: phaseElapsed >= 500 ? 2 : 3, swap: false };
    case 8:
      return { count: 1, swap: false };
    default:
      return { count: 0, swap: false };
  }
}

export const fair: LayoutRenderer = ({ width, height, orientation, phase, phaseElapsed }) => {
  const { count, swap } = fairState(phase, phaseElapsed);
  const layouts: Rect[][] = Array.from({ length: 6 }, (_, n) =>
    calculateFairLayout(n, width, height, GAP, orientation),
  );

  const target = (index: number): Rect => {
    const size = Math.max(count, index + 1);
    const rect = layouts[size]?.[index] ?? layouts[1]?.[0];
    return { x: rect?.x ?? 0, y: rect?.y ?? 0, w: rect?.w ?? width, h: rect?.h ?? height };
  };

  let pos3 = target(3);
  let pos4 = target(4);
  if (swap && count >= 5) {
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
