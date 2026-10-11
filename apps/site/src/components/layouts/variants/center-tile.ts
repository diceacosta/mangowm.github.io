import { effectiveGaps } from "@/components/layouts/config";
import type { CardFrame, LayoutRenderer, Rect } from "@/components/layouts/types";
import { focusedSequence, progressiveCount } from "./helpers";

export const centerTile: LayoutRenderer = ({ width, height, phase, config }) => {
  const count = progressiveCount(phase);
  const focused = focusedSequence(phase);
  const swap = phase === 4;
  const g = effectiveGaps(config, count);

  const mw = (width - 2 * g.oh - g.ih) * config.mfact;
  const tw = (width - mw) / 2 - g.oh - g.ih;
  const mx = g.oh + tw + g.ih;

  const centre: Rect = { x: mx, y: g.ov, w: mw, h: height - 2 * g.ov };
  const leftSlot: Rect = { x: g.oh, y: g.ov, w: tw, h: height - 2 * g.ov };
  const rightSlot: Rect = { x: mx + mw + g.ih, y: g.ov, w: tw, h: height - 2 * g.ov };
  const offRight: Rect = { x: width, y: 0, w: tw, h: height - 2 * g.ov };

  // With 3 windows the second card moves to the left slot; with 2 it sits right.
  const second = count >= 3 ? leftSlot : rightSlot;

  const cards: CardFrame[] = [
    count >= 1
      ? { ...(swap ? rightSlot : centre), visible: phase > 0 && phase < 8, active: focused === 1 }
      : { ...centre, visible: false, active: false },
    count >= 2
      ? { ...second, visible: phase >= 2 && phase < 7, active: focused === 2 }
      : { ...offRight, visible: false, active: false },
    count >= 3
      ? { ...(swap ? centre : rightSlot), visible: phase >= 3 && phase < 6, active: focused === 3 }
      : { ...offRight, visible: false, active: false },
  ];

  return { cards };
};
