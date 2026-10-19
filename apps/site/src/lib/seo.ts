import { siteConfig } from "../constants.ts";
import type { OgPage } from "./og-pages.ts";

export function pageMeta(page: OgPage) {
  const url = new URL(page.path, siteConfig.url).href;
  const image = new URL(page.image, siteConfig.url).href;

  return [
    { title: page.title },
    { name: "description", content: page.description },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: page.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: page.imageAlt },
  ];
}
