import { siteConfig } from "../constants.ts";

export type OgPageId = "home" | "showcase" | "brand";

export interface OgPage {
  id: OgPageId;
  path: string;
  title: string;
  description: string;
  eyebrow?: string;
  heading: string;
  imageAlt: string;
  image: string;
}

function pageTitle(name: string) {
  return `${name} | ${siteConfig.name}`;
}

export const ogPages: Record<OgPageId, OgPage> = {
  home: {
    id: "home",
    path: "/",
    title: siteConfig.name,
    description: siteConfig.description,
    eyebrow: "Wayland compositor",
    heading: "mangowm",
    imageAlt: "mangowm — a lightweight Wayland compositor",
    image: "og/home.webp",
  },
  showcase: {
    id: "showcase",
    path: "/showcase",
    title: pageTitle("Showcase"),
    description: "Setups and dotfiles from the community.",
    eyebrow: "Showcase",
    heading: "Community setups",
    imageAlt: "Community setups for mangowm",
    image: "og/showcase.webp",
  },
  brand: {
    id: "brand",
    path: "/brand",
    title: pageTitle("Brand"),
    description: "SVG and PNG.",
    eyebrow: "Brand",
    heading: "Logo",
    imageAlt: "The mangowm logo",
    image: "og/brand.webp",
  },
};
