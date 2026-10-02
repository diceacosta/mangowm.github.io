import type { CardFrame, LayoutRenderer } from "../types";

export const monocle: LayoutRenderer = ({ width, height, phase }) => {
  const full = { x: 0, y: 0, w: width, h: height };

  const firstVisible = phase >= 1 && phase < 8;
  const secondVisible = phase >= 2 && phase < 7;

  const cards: CardFrame[] = [
    { ...full, visible: firstVisible, active: phase === 1 || phase === 7 },
    { ...full, visible: secondVisible, active: secondVisible },
  ];

  return { cards };
};
