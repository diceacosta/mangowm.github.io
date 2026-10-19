import { siteConfig } from "../constants.ts";

export type OgPageId = "home" | "showcase" | "brand";

export interface OgPage {
  id: OgPageId;
  path: string;
  title: string;
  description: string;
  eyebrow?: string;
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
    heading: "mangowm",
    image: "og/home.webp",
  },
  showcase: {
    id: "showcase",
    path: "/showcase",
    title: `Showcase - ${siteConfig.name}`,
    description: "Setups and dotfiles from the community.",
    eyebrow: "Showcase",
    heading: "Community setups",
    image: "og/showcase.webp",
  },
  brand: {
    id: "brand",
    path: "/brand",
    title: `Brand - ${siteConfig.name}`,
    description: "SVG and PNG.",
    eyebrow: "Brand",
    heading: "Logo",
    image: "og/brand.webp",
  },
};
