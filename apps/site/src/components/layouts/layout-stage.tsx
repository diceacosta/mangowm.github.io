import { AnimatedCard, CARD_TRANSITION } from "./animated-card";
import { useElementSize } from "./use-element-size";
import { useTimeline } from "./use-timeline";
import type { LayoutDef, Orientation } from "./types";

interface LayoutStageProps {
  layout: LayoutDef;
  orientation: Orientation;
}

/**
 * Measures its container once and renders the active layout's cards. All
 * positioning is derived data — there are no refs or imperative DOM writes.
 */
export function LayoutStage({ layout, orientation }: LayoutStageProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const { phase, phaseElapsed } = useTimeline(layout.timeline);
  const ready = size.width > 0 && size.height > 0;

  const frame = ready
    ? layout.render({ ...size, orientation, phase, phaseElapsed })
    : { cards: [] };

  const cards = frame.cards.map((card, index) => (
    <AnimatedCard
      key={index}
      frame={card}
      label={String(index + 1)}
      transition={layout.cardTransition}
    />
  ));

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {frame.track ? (
        <div
          className="absolute left-0 top-0"
          style={{
            width: frame.track.w,
            height: frame.track.h,
            transform: `translate3d(${frame.track.offsetX}px, ${frame.track.offsetY}px, 0)`,
            transition: CARD_TRANSITION,
          }}
        >
          {cards}
        </div>
      ) : (
        cards
      )}
    </div>
  );
}
