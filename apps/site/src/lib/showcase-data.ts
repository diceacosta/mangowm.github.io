export type ShowcaseEntry = {
  username: string;
  dotfiles: string;
  tags: string[];
  added: string | null;
  screenshots: string[];
  videos: string[];
};

export type ShowcaseMedia = {
  type: "image" | "video";
  url: string;
};

const modules = import.meta.glob<{ default: ShowcaseEntry[] }>("../data/showcase.json", {
  eager: true,
});

export const showcaseEntries: ShowcaseEntry[] = Object.values(modules)[0]?.default ?? [];

export function entryMedia(entry: ShowcaseEntry): ShowcaseMedia[] {
  return [
    ...entry.screenshots.map((url) => ({ type: "image" as const, url })),
    ...entry.videos.map((url) => ({ type: "video" as const, url })),
  ];
}
