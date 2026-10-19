import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeOgImage } from "@mangowm/og";
import { ogPages } from "../src/lib/og-pages.ts";

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

for (const page of Object.values(ogPages)) {
  const output = await writeOgImage({
    output: resolve(publicDir, page.image),
    eyebrow: page.eyebrow,
    title: page.heading,
    description: page.description,
  });

  console.log(`Generated ${output}`);
}
