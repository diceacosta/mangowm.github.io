import { AnimatedCard } from "./animated-card";
import type { CardAction } from "./animation";
import { DEFAULT_LAYOUT_CONFIG, type LayoutConfig } from "./config";
import { useElementSize } from "./use-element-size";
import { useTimeline } from "./use-timeline";
import type { LayoutDef, LayoutFrame, Orientation } from "./types";

interface LayoutStageProps {
  layout: LayoutDef;
  orientation: Orientation;
  config?: LayoutConfig;
}

export function LayoutStage({
  layout,
  orientation,
  config = DEFAULT_LAYOUT_CONFIG,
}: LayoutStageProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const { phase, phaseElapsed, previous } = useTimeline(layout.timeline);
  const ready = size.width > 0 && size.height > 0;

  const render = (phase: number, phaseElapsed: number): LayoutFrame =>
    ready ? layout.render({ ...size, orientation, phase, phaseElapsed, config }) : { cards: [] };

  const frame = render(phase, phaseElapsed);
  const previousFrame = render(previous.phase, previous.phaseElapsed);

  const cards = frame.cards.map((card, index) => {
    const wasVisible = previousFrame.cards[index]?.visible ?? false;
    const action: CardAction =
      wasVisible === card.visible ? "move" : card.visible ? "enter" : "leave";
    return <AnimatedCard key={index} frame={card} label={String(index + 1)} action={action} />;
  });

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {cards}
    </div>
  );
}
