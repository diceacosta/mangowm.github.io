import { cn } from "@/cn";
import type { CardFrame } from "./types";

export const CARD_TRANSITION = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
export const SCROLLER_CARD_TRANSITION = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

interface AnimatedCardProps {
  frame: CardFrame;
  label: string;
  transition?: string;
}

export function AnimatedCard({ frame, label, transition = CARD_TRANSITION }: AnimatedCardProps) {
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
        transition,
      }}
    >
      {label}
    </div>
  );
}
