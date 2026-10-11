import type { LayoutConfig } from "@/components/layouts/config";
import type { CardFrame, LayoutRenderer, Orientation, Rect } from "@/components/layouts/types";

function buildGrid(
  n: number,
  width: number,
  height: number,
  orientation: Orientation,
  config: LayoutConfig,
): Rect[] {
  if (n === 0) return [];

  const gappo = orientation === "horizontal" ? config.gappoh : config.gappov;
  const gappi = orientation === "horizontal" ? config.gappih : config.gappiv;

  if (n === 1) {
    const w = (width - 2 * gappo) * config.singleWidthRatio;
    const h = (height - 2 * gappo) * config.singleHeightRatio;
    return [{ x: (width - w) / 2, y: (height - h) / 2, w, h }];
  }

  if (n === 2) {
    if (orientation === "horizontal") {
      const ch = (height - 2 * gappo) * config.gridPairRatio;
      const cw = (width - 2 * gappo - gappi) / 2;
      return [
        { x: gappo, y: (height - ch) / 2 + gappo, w: cw, h: ch },
        { x: gappo + cw + gappi, y: (height - ch) / 2 + gappo, w: cw, h: ch },
      ];
    }
    const cw = (width - 2 * gappo) * config.gridPairRatio;
    const ch = (height - 2 * gappo - gappi) / 2;
    return [
      { x: (width - cw) / 2 + gappo, y: gappo, w: cw, h: ch },
      { x: (width - cw) / 2 + gappo, y: gappo + ch + gappi, w: cw, h: ch },
    ];
  }

  const cols =
    orientation === "horizontal" ? Math.ceil(Math.sqrt(n)) : Math.ceil(n / Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);
  const cellW = (width - 2 * gappo - (cols - 1) * gappi) / cols;
  const cellH = (height - 2 * gappo - (rows - 1) * gappi) / rows;

  if (orientation === "horizontal") {
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const itemsInRow = row === rows - 1 ? n - row * cols : cols;
      const rowW = itemsInRow * cellW + (itemsInRow - 1) * gappi;
      const rowStartX = (width - rowW) / 2;
      return {
        x: rowStartX + col * (cellW + gappi),
        y: gappo + row * (cellH + gappi),
        w: cellW,
        h: cellH,
      };
    });
  }

  return Array.from({ length: n }, (_, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const itemsInCol = col === cols - 1 ? n - col * rows : rows;
    const colH = itemsInCol * cellH + (itemsInCol - 1) * gappi;
    const colStartY = (height - colH) / 2;
    return {
      x: gappo + col * (cellW + gappi),
      y: colStartY + row * (cellH + gappi),
      w: cellW,
      h: cellH,
    };
  });
}

function gridCount(phase: number): number {
  if (phase <= 0) return 0;
  if (phase === 1) return 1;
  if (phase === 2) return 2;
  if (phase === 3) return 3;
  if (phase <= 5) return 4;
  if (phase === 6) return 3;
  if (phase === 7) return 2;
  return 1;
}

function gridFocus(phase: number): number {
  if (phase <= 1) return 1;
  if (phase === 2) return 2;
  if (phase === 3) return 3;
  if (phase <= 5) return 4;
  if (phase === 6) return 3;
  if (phase === 7) return 2;
  return 1;
}

export const grid: LayoutRenderer = ({ width, height, orientation, phase, config }) => {
  const count = gridCount(phase);
  const focused = gridFocus(phase);
  const swap = phase === 5;

  const positions = buildGrid(count, width, height, orientation, config);
  const first = buildGrid(1, width, height, orientation, config)[0] ?? {
    x: 0,
    y: 0,
    w: width,
    h: height,
  };

  const hiddenRect = (index: number): Rect => {
    if (index === 0) return { x: 0, y: 0, w: width, h: height };
    if (index === 1) return { x: width, y: height, w: first.w / 2, h: first.h };
    return { x: width, y: height, w: width / 2, h: height / 2 };
  };

  const order = (index: number): number => {
    if (!swap) return index;
    if (index === 2) return 3;
    if (index === 3) return 2;
    return index;
  };

  const cards: CardFrame[] = [0, 1, 2, 3].map((index) => {
    const visible = count >= index + 1;
    const rect = visible ? positions[order(index)] : undefined;
    return {
      ...(rect ?? hiddenRect(index)),
      visible,
      active: focused === index + 1,
    };
  });

  return { cards };
};
