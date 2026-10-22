export type ShowcaseImage = {
  base: string;
  width: number;
  height: number;
  widths: number[];
};

export type ShowcaseEntry = {
  username: string;
  dotfiles: string;
  tags: string[];
  added: string | null;
  screenshots: ShowcaseImage[];
  videos: string[];
};

type ShowcaseMedia = { type: "image"; image: ShowcaseImage } | { type: "video"; url: string };

const modules = import.meta.glob<ShowcaseEntry[]>("../data/showcase.json", {
  eager: true,
  import: "default",
});

export const showcaseEntries: ShowcaseEntry[] = Object.values(modules)[0] ?? [];

export function entryMedia(entry: ShowcaseEntry): ShowcaseMedia[] {
  return [
    ...entry.screenshots.map((image) => ({ type: "image" as const, image })),
    ...entry.videos.map((url) => ({ type: "video" as const, url })),
  ];
}

function imageUrl(image: ShowcaseImage, width: number): string {
  return `${image.base}-${width}.webp`;
}

export function imageSrc(image: ShowcaseImage): string {
  return imageUrl(image, image.widths[image.widths.length - 1] ?? image.width);
}

export function imageSrcSet(image: ShowcaseImage): string {
  return image.widths.map((width) => `${imageUrl(image, width)} ${width}w`).join(", ");
}
