import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeOgImage } from "@mangowm/og";

const output = await writeOgImage({
  output: resolve(dirname(fileURLToPath(import.meta.url)), "../public/og/image.webp"),
  eyebrow: "GUI Settings",
  title: "mangowm settings",
  description: "a gui for configuring mangowm",
});

console.log(`Generated ${output}`);
