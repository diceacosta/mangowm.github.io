import type { CardFrame, LayoutRenderer, TrackFrame } from "../types";

const HALF = 50;

interface ScrollerWindow {
  primaryOffset: number;
  primarySize: number;
  secondaryOffset?: number;
  secondarySize?: number;
  visible: boolean;
  active: boolean;
}

function hidden(primaryOffset: number, primarySize: number): ScrollerWindow {
  return { primaryOffset, primarySize, visible: false, active: false };
}

function scrollerWindows(phase: number): [ScrollerWindow, ScrollerWindow, ScrollerWindow] {
  switch (phase) {
    case 0:
      return [hidden(0, HALF), hidden(100, HALF), hidden(200, HALF)];
    case 1:
      return [
        { primaryOffset: 25, primarySize: HALF, visible: true, active: true },
        hidden(100, HALF),
        hidden(200, HALF),
      ];
    case 2:
      return [
        { primaryOffset: 0, primarySize: HALF, visible: true, active: false },
        { primaryOffset: HALF, primarySize: HALF, visible: true, active: true },
        hidden(200, HALF),
      ];
    case 3:
      return [
        { primaryOffset: 0, primarySize: HALF, visible: true, active: false },
        { primaryOffset: HALF, primarySize: HALF, visible: true, active: false },
        { primaryOffset: 100, primarySize: HALF, visible: true, active: true },
      ];
    case 4:
      return [
        { primaryOffset: 0, primarySize: HALF, visible: true, active: false },
        {
          primaryOffset: HALF,
          primarySize: HALF,
          secondaryOffset: 0,
          secondarySize: HALF,
          visible: true,
          active: false,
        },
        {
          primaryOffset: HALF,
          primarySize: HALF,
          secondaryOffset: HALF,
          secondarySize: HALF,
          visible: true,
          active: true,
        },
      ];
    case 5:
      return [
        { primaryOffset: 0, primarySize: HALF, visible: true, active: false },
        hidden(100, HALF),
        { primaryOffset: HALF, primarySize: HALF, visible: true, active: true },
      ];
    case 6:
      return [
        { primaryOffset: 0, primarySize: HALF, visible: true, active: false },
        { primaryOffset: HALF, primarySize: HALF, visible: true, active: true },
        hidden(HALF, HALF),
      ];
    case 7:
      return [
        { primaryOffset: 25, primarySize: HALF, visible: true, active: true },
        hidden(HALF, HALF),
        hidden(HALF, HALF),
      ];
    default:
      return [
        { primaryOffset: 25, primarySize: HALF, visible: false, active: false },
        hidden(HALF, HALF),
        hidden(HALF, HALF),
      ];
  }
}

export const scroller: LayoutRenderer = ({ width, height, orientation, phase }) => {
  const isVert = orientation === "vertical";
  const dim = isVert ? height : width;
  const gap = Math.min(20, dim * 0.05);
  const scrollPct = phase === 3 ? HALF : 0;
  const trackMult = phase === 3 ? 1.5 : 1;

  const track: TrackFrame = isVert
    ? { w: width, h: height * trackMult, offsetX: 0, offsetY: -(dim * scrollPct) / 100 }
    : { w: width * trackMult, h: height, offsetX: -(dim * scrollPct) / 100, offsetY: 0 };

  const card = (window: ScrollerWindow): CardFrame => {
    const {
      primaryOffset,
      primarySize,
      secondaryOffset = 0,
      secondarySize = 100,
      visible,
      active,
    } = window;

    const isFirst = primaryOffset === scrollPct;
    const isLast = primaryOffset + primarySize === scrollPct + 100;
    const rawPos = (dim * primaryOffset) / 100;
    const rawSize = (dim * primarySize) / 100;
    const pos = isFirst ? rawPos : rawPos + gap / 2;

    let size = rawSize;
    if (!isFirst) size -= gap / 2;
    if (!isLast) size -= gap / 2;
    size = Math.max(size, 0);

    const secondaryDim = isVert ? width : height;
    let secondaryPos: number;
    let secondarySizePx: number;
    if (secondarySize < 100) {
      const half = (secondaryDim - gap) / 2;
      secondaryPos = secondaryOffset === 0 ? 0 : half + gap;
      secondarySizePx = half;
    } else {
      secondaryPos = 0;
      secondarySizePx = secondaryDim;
    }

    return isVert
      ? { x: secondaryPos, y: pos, w: secondarySizePx, h: size, visible, active }
      : { x: pos, y: secondaryPos, w: size, h: secondarySizePx, visible, active };
  };

  return { cards: scrollerWindows(phase).map(card), track };
};
