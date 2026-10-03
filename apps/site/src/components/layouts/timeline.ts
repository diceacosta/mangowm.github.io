import type { Timeline } from "./types";

export const DEFAULT_TIMELINE: Timeline = {
  total: 9500,
  keyframes: [
    { phase: 0, at: 0 },
    { phase: 1, at: 500 },
    { phase: 2, at: 1500 },
    { phase: 3, at: 2500 },
    { phase: 4, at: 4000 },
    { phase: 5, at: 5000 },
    { phase: 6, at: 6000 },
    { phase: 7, at: 7000 },
    { phase: 8, at: 8000 },
  ],
};

export const MONOCLE_TIMELINE: Timeline = {
  total: 6500,
  keyframes: [
    { phase: 0, at: 0 },
    { phase: 1, at: 500 },
    { phase: 2, at: 1500 },
    { phase: 7, at: 2500 },
    { phase: 8, at: 3500 },
  ],
};

export const SCROLLER_TIMELINE: Timeline = {
  total: 7500,
  keyframes: [
    { phase: 0, at: 0 },
    { phase: 1, at: 500 },
    { phase: 2, at: 1500 },
    { phase: 3, at: 2500 },
    { phase: 4, at: 4000 },
    { phase: 5, at: 5000 },
    { phase: 6, at: 6000 },
    { phase: 7, at: 7000 },
  ],
};

/**
 * Some layouts animate through an intermediate state partway through a phase
 * (mirroring the original staggered `setTimeout`s). Quantising the elapsed time
 * to these milestones lets those layouts derive their state purely, while
 * keeping rerenders discrete instead of once per animation frame.
 */
const MILESTONES = [0, 500, 600, 750] as const;

function quantisePhaseElapsed(elapsed: number): number {
  let milestone = 0;
  for (const value of MILESTONES) {
    if (elapsed >= value) milestone = value;
  }
  return milestone;
}

export interface TimelineState {
  phase: number;
  phaseElapsed: number;
}

export function timelineAt(elapsed: number, timeline: Timeline): TimelineState {
  const total = timeline.total;
  const time = ((elapsed % total) + total) % total;

  let phase = 0;
  let at = 0;
  for (const keyframe of timeline.keyframes) {
    if (time >= keyframe.at) {
      phase = keyframe.phase;
      at = keyframe.at;
    }
  }

  return { phase, phaseElapsed: quantisePhaseElapsed(time - at) };
}
