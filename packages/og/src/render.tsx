import { render, type RenderOptions } from "takumi-js";
import { OgImage, type OgImageProps } from "./og-image";

export type OgImageOptions = OgImageProps & {
  width?: number;
  height?: number;
  fonts?: RenderOptions["fonts"];
};

export function renderOgImage(options: OgImageOptions): Promise<Uint8Array> {
  const { eyebrow, title, description, width = 1200, height = 630, fonts } = options;

  return render(<OgImage eyebrow={eyebrow} title={title} description={description} />, {
    width,
    height,
    format: "webp",
    fonts,
  });
}
