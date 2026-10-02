import { SCROLLER_CARD_TRANSITION } from "./animated-card";
import { MONOCLE_TIMELINE } from "./timeline";
import type { LayoutDef } from "./types";
import { centerTile } from "./variants/center-tile";
import { deck } from "./variants/deck";
import { dwindle } from "./variants/dwindle";
import { fair } from "./variants/fair";
import { grid } from "./variants/grid";
import { monocle } from "./variants/monocle";
import { rightTile } from "./variants/right-tile";
import { scroller } from "./variants/scroller";
import { tiling } from "./variants/tiling";

export const tilingLayout: LayoutDef = {
  id: "tiling",
  label: "Tiling",
  supportsOrientation: true,
  render: tiling,
};

export const scrollerLayout: LayoutDef = {
  id: "scroller",
  label: "Scroller",
  supportsOrientation: true,
  render: scroller,
  cardTransition: SCROLLER_CARD_TRANSITION,
};

export const gridLayout: LayoutDef = {
  id: "grid",
  label: "Grid",
  supportsOrientation: true,
  render: grid,
};

export const fairLayout: LayoutDef = {
  id: "fair",
  label: "Fair",
  supportsOrientation: true,
  render: fair,
};

export const dwindleLayout: LayoutDef = {
  id: "dwindle",
  label: "Dwindle",
  supportsOrientation: false,
  render: dwindle,
};

export const deckLayout: LayoutDef = {
  id: "deck",
  label: "Deck",
  supportsOrientation: true,
  render: deck,
};

export const centerTileLayout: LayoutDef = {
  id: "center-tile",
  label: "Center Tile",
  supportsOrientation: false,
  render: centerTile,
};

export const rightTileLayout: LayoutDef = {
  id: "right-tile",
  label: "Right Tile",
  supportsOrientation: false,
  render: rightTile,
};

export const monocleLayout: LayoutDef = {
  id: "monocle",
  label: "Monocle",
  supportsOrientation: false,
  render: monocle,
  timeline: MONOCLE_TIMELINE,
};

export const PRIMARY_LAYOUTS: LayoutDef[] = [
  tilingLayout,
  scrollerLayout,
  gridLayout,
  fairLayout,
  dwindleLayout,
];

export const SECONDARY_LAYOUTS: LayoutDef[] = [
  deckLayout,
  centerTileLayout,
  rightTileLayout,
  monocleLayout,
];

export const LAYOUTS: LayoutDef[] = [...PRIMARY_LAYOUTS, ...SECONDARY_LAYOUTS];

export const DEFAULT_LAYOUT = tilingLayout;

export const AUTO_PLAY_IDS = PRIMARY_LAYOUTS.map((layout) => layout.id);
export const AUTO_PLAY_INTERVAL = 9500;
