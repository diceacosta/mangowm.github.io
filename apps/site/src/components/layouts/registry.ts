import { MONOCLE_TIMELINE, SCROLLER_TIMELINE } from "./timeline";
import type { LayoutDef } from "./types";
import { centerTile } from "@/components/layouts/variants/center-tile";
import { deck } from "@/components/layouts/variants/deck";
import { dwindle } from "@/components/layouts/variants/dwindle";
import { fair } from "@/components/layouts/variants/fair";
import { grid } from "@/components/layouts/variants/grid";
import { monocle } from "@/components/layouts/variants/monocle";
import { rightTile } from "@/components/layouts/variants/right-tile";
import { scroller } from "@/components/layouts/variants/scroller";
import { tiling } from "@/components/layouts/variants/tiling";

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
  timeline: SCROLLER_TIMELINE,
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
