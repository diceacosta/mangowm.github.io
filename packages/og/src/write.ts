import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderOgImage, type OgImageOptions } from "./render";

export type WriteOgImageOptions = OgImageOptions & {
  output: string;
};

export async function writeOgImage({ output, ...options }: WriteOgImageOptions): Promise<string> {
  const file = resolve(output);
  const image = await renderOgImage(options);

  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, image);

  return file;
}
