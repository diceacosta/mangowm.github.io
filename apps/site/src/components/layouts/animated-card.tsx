import { cn } from "@/cn";
import { cardTransition, type CardAction } from "./animation";
import type { CardFrame } from "./types";

interface AnimatedCardProps {
  frame: CardFrame;
  label: string;
  action: CardAction;
}

export function AnimatedCard({ frame, label, action }: AnimatedCardProps) {
  const { x, y, w, h, visible, active, z } = frame;

  return (
    <div
      className={cn("card-base", active ? "card-active" : "card-inactive")}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) scale(${visible ? 1 : 0.9})`,
        width: w,
        height: h,
        opacity: visible ? 1 : 0,
        zIndex: z,
        transition: cardTransition(action),
      }}
    >
      {label}
    </div>
  );
}
