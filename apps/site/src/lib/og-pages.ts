import { siteConfig } from "../constants.ts";

export type OgPageId = "home" | "showcase" | "brand";

export interface OgPage {
  id: OgPageId;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  image: string;
}

export const ogPages: Record<OgPageId, OgPage> = {
  home: {
    id: "home",
    path: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    eyebrow: "Wayland compositor",
    heading: "Lightweight & feature-rich",
    image: "og/home.webp",
  },
  showcase: {
    id: "showcase",
    path: "/showcase",
    title: `Showcase — ${siteConfig.name}`,
    description: "Browse real mangowm setups, dotfiles, and ricing inspiration from the community.",
    eyebrow: "Showcase",
    heading: "Setups from the community",
    image: "og/showcase.webp",
  },
  brand: {
    id: "brand",
    path: "/brand",
    title: `Brand — ${siteConfig.name}`,
    description: "Download mangowm logos and brand assets in SVG and PNG.",
    eyebrow: "Brand",
    heading: "Logos & brand assets",
    image: "og/brand.webp",
  },
};
