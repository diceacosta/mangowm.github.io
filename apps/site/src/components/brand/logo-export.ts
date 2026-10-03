import logoSvgRaw from "@mangowm/assets/logos/mangowm.svg?raw";

const SOURCE_CANVAS = 1024;

export const LOGO_BACKGROUNDS = {
  transparent: { label: "Transparent", color: null },
  white: { label: "White", color: "#ffffff" },
  dark: { label: "Dark", color: "#111013" },
} as const;

export type LogoBackground = keyof typeof LOGO_BACKGROUNDS;

export const LOGO_RATIOS = {
  square: { label: "Square", ratio: "1:1", width: 1, height: 1 },
  landscape: { label: "Landscape", ratio: "4:3", width: 4, height: 3 },
  classic: { label: "Classic", ratio: "3:2", width: 3, height: 2 },
  wide: { label: "Wide", ratio: "16:9", width: 16, height: 9 },
  banner: { label: "Banner", ratio: "2:1", width: 2, height: 1 },
  portrait: { label: "Portrait", ratio: "4:5", width: 4, height: 5 },
  story: { label: "Story", ratio: "9:16", width: 9, height: 16 },
} as const;

export type LogoRatio = keyof typeof LOGO_RATIOS;

export const LOGO_SIZES = [128, 256, 512, 1024, 2048] as const;

export type LogoFormat = "svg" | "png";

export interface LogoDimensions {
  width: number;
  height: number;
}

export function getLogoDimensions(ratio: LogoRatio, size: number): LogoDimensions {
  const { width, height } = LOGO_RATIOS[ratio];
  if (width >= height) {
    return { width: size, height: Math.max(1, Math.round((size * height) / width)) };
  }
  return { width: Math.max(1, Math.round((size * width) / height)), height: size };
}

export interface BuildLogoSvgOptions extends LogoDimensions {
  background: LogoBackground;
  padding: number;
}

const logoBody = extractSvgBody(logoSvgRaw);

export function buildLogoSvg({ width, height, background, padding }: BuildLogoSvgOptions): string {
  const shortestEdge = Math.min(width, height);
  const inset = (shortestEdge * clamp(padding, 0, 30)) / 100;
  const scale = Math.min((width - inset * 2) / SOURCE_CANVAS, (height - inset * 2) / SOURCE_CANVAS);
  const logoSize = SOURCE_CANVAS * scale;
  const offsetX = (width - logoSize) / 2;
  const offsetY = (height - logoSize) / 2;

  const fill = LOGO_BACKGROUNDS[background].color;
  const backgroundRect = fill ? `<rect width="${width}" height="${height}" fill="${fill}"/>` : "";
  const transform = `translate(${round(offsetX)} ${round(offsetY)}) scale(${round(scale, 6)})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet"><title>mangowm logo</title>${backgroundRect}<g transform="${transform}">${logoBody}</g></svg>`;
}

export async function renderLogoPng(svg: string, { width, height }: LogoDimensions): Promise<Blob> {
  const objectUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable");
    context.drawImage(image, 0, 0, width, height);
    return await canvas.convertToBlob({ type: "image/png" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildLogoFilename(options: {
  ratio: LogoRatio;
  background: LogoBackground;
  format: LogoFormat;
  width: number;
  height: number;
}): string {
  const { ratio, background, format, width, height } = options;
  return `mangowm-${ratio}-${background}-${width}x${height}.${format}`;
}

function extractSvgBody(svg: string): string {
  const cleaned = svg.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const openEnd = cleaned.indexOf(">", cleaned.indexOf("<svg"));
  const closeStart = cleaned.lastIndexOf("</svg>");
  return cleaned.slice(openEnd + 1, closeStart).trim();
}

function round(value: number, precision = 4): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
