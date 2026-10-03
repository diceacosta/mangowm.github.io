export interface LayoutConfig {
  mfact: number;
  nmaster: number;
  gappih: number;
  gappiv: number;
  gappoh: number;
  gappov: number;
  smartgaps: boolean;
  dwindleRatio: number;
  scrollerStructs: number;
  scrollerProportion: number;
  singleWidthRatio: number;
  singleHeightRatio: number;
  gridPairRatio: number;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  mfact: 0.55,
  nmaster: 1,
  gappih: 5,
  gappiv: 5,
  gappoh: 10,
  gappov: 10,
  smartgaps: false,
  dwindleRatio: 0.5,
  scrollerStructs: 20,
  scrollerProportion: 0.9,
  singleWidthRatio: 0.9,
  singleHeightRatio: 0.9,
  gridPairRatio: 0.65,
};

export interface LayoutGaps {
  ih: number;
  iv: number;
  oh: number;
  ov: number;
}

export function effectiveGaps(config: LayoutConfig, count: number): LayoutGaps {
  if (config.smartgaps && count === 1) {
    return { ih: 0, iv: 0, oh: 0, ov: 0 };
  }
  return { ih: config.gappih, iv: config.gappiv, oh: config.gappoh, ov: config.gappov };
}
