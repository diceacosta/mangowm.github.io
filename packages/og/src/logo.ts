import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let dataUri: string | undefined;

export function logoDataUri(): string {
  dataUri ??= `data:image/svg+xml;base64,${readFileSync(
    require.resolve("@mangowm/assets/logos/mangowm.svg"),
  ).toString("base64")}`;

  return dataUri;
}
