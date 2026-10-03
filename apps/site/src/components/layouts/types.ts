import type { LayoutConfig } from "./config";

export type Orientation = "horizontal" | "vertical";

export type LayoutId =
  | "tiling"
  | "scroller"
  | "grid"
  | "fair"
  | "dwindle"
  | "deck"
  | "center-tile"
  | "right-tile"
  | "monocle";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CardFrame extends Rect {
  visible: boolean;
  active: boolean;
  z?: number;
}

export interface TrackFrame {
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
}

export interface LayoutFrame {
  cards: CardFrame[];
  track?: TrackFrame;
}

export interface LayoutContext {
  width: number;
  height: number;
  orientation: Orientation;
  phase: number;
  /** Milliseconds since the current phase started, quantised to animation milestones. */
  phaseElapsed: number;
  config: LayoutConfig;
}

export type LayoutRenderer = (context: LayoutContext) => LayoutFrame;

export interface Keyframe {
  phase: number;
  at: number;
}

export interface Timeline {
  total: number;
  keyframes: readonly Keyframe[];
}

export interface LayoutDef {
  id: LayoutId;
  label: string;
  supportsOrientation: boolean;
  render: LayoutRenderer;
  timeline?: Timeline;
  cardTransition?: string;
}
