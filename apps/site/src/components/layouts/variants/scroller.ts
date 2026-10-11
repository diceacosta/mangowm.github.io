import { effectiveGaps } from "@/components/layouts/config";
import type { CardFrame, LayoutRenderer, Rect } from "@/components/layouts/types";

interface ScrollerWindow {
  head: number;
  stackIndex?: number;
  stackCount?: number;
  visible: boolean;
  active: boolean;
}

type Scene = readonly [ScrollerWindow, ScrollerWindow, ScrollerWindow];

const hidden = (head: number): ScrollerWindow => ({ head, visible: false, active: false });
const win = (head: number, opts: Partial<ScrollerWindow> = {}): ScrollerWindow => ({
  head,
  visible: true,
  active: false,
  ...opts,
});

function scrollerScene(phase: number): Scene {
  switch (phase) {
    case 0:
      return [hidden(0), hidden(1), hidden(2)];
    case 1:
      return [win(0, { active: true }), hidden(1), hidden(1)];
    case 2:
      return [win(0), win(1, { active: true }), hidden(1)];
    case 3:
      return [win(0), win(1), win(2, { active: true })];
    case 4:
      return [
        win(0),
        win(1, { stackIndex: 0, stackCount: 2 }),
        win(1, { stackIndex: 1, stackCount: 2, active: true }),
      ];
    case 5:
      return [win(0), win(1, { active: true }), hidden(1)];
    case 6:
      return [win(0, { active: true }), hidden(1), hidden(1)];
    default:
      return [hidden(0), hidden(0), hidden(0)];
  }
}

export const scroller: LayoutRenderer = ({ width, height, orientation, phase, config }) => {
  const isVert = orientation === "vertical";
  const scene = scrollerScene(phase);

  const visibleWindows = scene.filter((w) => w.visible);
  const headCount = Math.max(1, ...visibleWindows.map((w) => w.head + 1));
  const focused = scene.find((w) => w.active);
  const focusHead = focused ? focused.head : 0;

  const gaps = effectiveGaps(config, headCount);
  const structs = config.scrollerStructs;
  const primaryViewport = isVert ? height : width;
  const crossViewport = isVert ? width : height;
  const primaryGap = isVert ? gaps.iv : gaps.ih;
  const crossGap = isVert ? gaps.ih : gaps.iv;
  const crossStart = isVert ? gaps.oh : gaps.ov;
  const crossExtent = crossViewport - 2 * crossStart;

  const maxClient = Math.max(0, primaryViewport - 2 * structs - primaryGap);
  const headSize = maxClient * config.scrollerProportion;

  const focusStart = focusHead * (headSize + primaryGap);
  let cameraOffset: number;
  if (headCount <= 1) {
    cameraOffset = (primaryViewport - headSize) / 2 - focusStart;
  } else if (focusHead === 0) {
    cameraOffset = structs - focusStart;
  } else if (focusHead === headCount - 1) {
    cameraOffset = primaryViewport - structs - headSize - focusStart;
  } else {
    cameraOffset = (primaryViewport - headSize) / 2 - focusStart;
  }

  const cards: CardFrame[] = scene.map((w) => {
    const stackCount = w.stackCount ?? 1;
    const stackIndex = w.stackIndex ?? 0;
    const crossSize = (crossExtent - (stackCount - 1) * crossGap) / stackCount;
    const crossPos = crossStart + stackIndex * (crossSize + crossGap);
    const primaryPos = w.head * (headSize + primaryGap) + cameraOffset;
    const rect: Rect = isVert
      ? { x: crossPos, y: primaryPos, w: crossSize, h: headSize }
      : { x: primaryPos, y: crossPos, w: headSize, h: crossSize };
    return { ...rect, visible: w.visible, active: w.active };
  });

  return { cards };
};
