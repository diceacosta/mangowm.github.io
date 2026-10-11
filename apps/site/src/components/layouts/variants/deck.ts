import { effectiveGaps } from "@/components/layouts/config";
import type { CardFrame, LayoutRenderer, Rect } from "@/components/layouts/types";
import { focusedSequence } from "./helpers";

export const deck: LayoutRenderer = ({ width, height, orientation, phase, config }) => {
  const isVert = orientation === "vertical";
  const count = phase <= 1 ? 1 : phase === 2 ? 2 : phase <= 5 ? 3 : phase === 6 ? 2 : 1;
  const g = effectiveGaps(config, count);
  const swap = phase === 4;
  const focused = focusedSequence(phase);

  let master: Rect;
  let stack: Rect;
  if (isVert) {
    const mh =
      count > config.nmaster ? Math.round((height - 2 * g.ov) * config.mfact) : height - 2 * g.ov;
    master = { x: g.oh, y: g.ov, w: width - 2 * g.oh, h: mh };
    stack = {
      x: g.oh,
      y: mh + g.ov + g.iv,
      w: width - 2 * g.oh,
      h: height - mh - 2 * g.ov - g.iv,
    };
  } else {
    const mw =
      count > config.nmaster ? Math.round((width - 2 * g.oh) * config.mfact) : width - 2 * g.oh;
    master = { x: g.oh, y: g.ov, w: mw, h: height - 2 * g.ov };
    stack = {
      x: mw + g.oh + g.ih,
      y: g.ov,
      w: width - mw - 2 * g.oh - g.ih,
      h: height - 2 * g.ov,
    };
  }

  const exit: Rect = isVert
    ? { x: 0, y: height, w: stack.w, h: stack.h }
    : { x: width, y: 0, w: stack.w, h: stack.h };

  const zIndex = (id: number) => {
    let z = id;
    if (id === 1 && swap) z = 10;
    if (focused === id) z += 20;
    return z;
  };

  const cards: CardFrame[] = [
    phase < 8
      ? {
          ...(swap ? stack : master),
          visible: phase >= 1,
          active: focused === 1,
          z: zIndex(1),
        }
      : { ...master, visible: false, active: false, z: 1 },
    phase < 7
      ? { ...stack, visible: phase >= 2, active: focused === 2, z: zIndex(2) }
      : { ...exit, visible: false, active: false, z: 2 },
    phase < 6
      ? { ...(swap ? master : stack), visible: phase >= 3, active: focused === 3, z: zIndex(3) }
      : { ...exit, visible: false, active: false, z: 3 },
  ];

  return { cards };
};
