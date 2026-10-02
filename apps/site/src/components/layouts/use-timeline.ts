import { useEffect, useState } from "react";
import { DEFAULT_TIMELINE, timelineAt, type TimelineState } from "./timeline";
import type { Timeline } from "./types";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives the shared animation timeline with a single `requestAnimationFrame`
 * loop. State only updates when the phase (or a sub-step milestone) changes.
 */
export function useTimeline(timeline: Timeline = DEFAULT_TIMELINE): TimelineState {
  const [state, setState] = useState<TimelineState>(() => timelineAt(0, timeline));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setState(timelineAt(timeline.total / 2, timeline));
      return;
    }

    let frame = 0;
    let last = timelineAt(0, timeline);
    const start = performance.now();

    const tick = (now: number) => {
      const next = timelineAt(now - start, timeline);
      if (next.phase !== last.phase || next.phaseElapsed !== last.phaseElapsed) {
        last = next;
        setState(next);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [timeline]);

  return state;
}
