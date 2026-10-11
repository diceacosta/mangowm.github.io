import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { ShowcaseEntry } from "../src/lib/showcase-data.ts";
import {
  LEGACY_SCREENSHOT_MULTI,
  parseRepo,
  pickScreenshots,
  pickVideos,
  SHOWCASE_DIR,
  SCREENSHOT_MULTI,
  VIDEO_MULTI,
} from "../src/lib/showcase-media.ts";

const ENTRIES_URL = "https://raw.githubusercontent.com/mangowm/mango-showcase/HEAD/entries.yml";
const API = "https://api.github.com";
const DISCOVERY_CONCURRENCY = 5;
const DOWNLOAD_CONCURRENCY = 6;
const USERNAME_RE = /^[A-Za-z0-9-]+$/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/showcase.json");
const PUBLIC_MEDIA_DIR = "showcase";
const MEDIA_DIR = path.resolve(__dirname, "../public", PUBLIC_MEDIA_DIR);

type RawEntry = {
  username?: unknown;
  dotfiles?: unknown;
  tags?: unknown;
  added?: unknown;
};

type MediaFile = { url: string; name: string };

type ResolvedEntry = Omit<ShowcaseEntry, "screenshots" | "videos"> & {
  screenshots: MediaFile[];
  videos: MediaFile[];
};

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function rawUrl(owner: string, repo: string, filePath: string): string {
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${encoded}`;
}

function safeSegment(value: string): string {
  return value.replace(/[^\w.-]+/g, "-").replace(/^-+/, "");
}

function mediaFileName(username: string, url: string): string {
  const rawName = decodeURIComponent(url.split("/").pop() ?? "media");
  return `${safeSegment(username)}-${safeSegment(path.basename(rawName)) || "media"}`;
}

async function downloadMedia(entries: ResolvedEntry[]): Promise<ShowcaseEntry[]> {
  await mkdir(MEDIA_DIR, { recursive: true });

  const jobs = entries.flatMap(({ screenshots, videos }) => [...screenshots, ...videos]);

  const download = async ({ url, name }: MediaFile): Promise<{ name: string; ok: boolean }> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await writeFile(path.join(MEDIA_DIR, name), Buffer.from(await response.arrayBuffer()));
      return { name, ok: true };
    } catch (error) {
      console.warn(`Showcase: skipping ${url} (${(error as Error).message})`);
      return { name, ok: false };
    }
  };

  const results = await mapLimit(jobs, DOWNLOAD_CONCURRENCY, download);
  const failed = new Set(results.filter((result) => !result.ok).map((result) => result.name));

  console.log(
    `Showcase: downloaded ${jobs.length - failed.size}/${jobs.length} media files to public/showcase/`,
  );

  return entries.flatMap((entry) => {
    const media = [...entry.screenshots, ...entry.videos];
    if (media.some(({ name }) => failed.has(name))) {
      console.warn(`Showcase: dropping ${entry.username} (incomplete media)`);
      return [];
    }
    const bundle = (files: MediaFile[]) => files.map(({ name }) => `/${PUBLIC_MEDIA_DIR}/${name}`);
    return [
      {
        ...entry,
        screenshots: bundle(entry.screenshots),
        videos: bundle(entry.videos),
      },
    ];
  });
}

async function listContents(owner: string, repo: string, dir: string): Promise<string[] | null> {
  const suffix = dir ? `/${dir}` : "";
  const response = await fetch(`${API}/repos/${owner}/${repo}/contents${suffix}`, {
    headers: githubHeaders(),
  });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  if (!Array.isArray(data)) return null;
  return data
    .map((item) => (item && typeof item === "object" ? (item as { path?: unknown }).path : null))
    .filter((filePath): filePath is string => typeof filePath === "string");
}

async function listRepoPaths(owner: string, repo: string): Promise<string[] | null> {
  const response = await fetch(`${API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, {
    headers: githubHeaders(),
  });
  if (response.ok) {
    const data = (await response.json()) as {
      tree?: Array<{ type?: string; path?: string }>;
      truncated?: boolean;
    };
    if (!data.truncated) {
      return (data.tree ?? [])
        .filter((node) => node.type === "blob" && typeof node.path === "string")
        .map((node) => node.path as string);
    }
  }

  const listings = await Promise.all([
    listContents(owner, repo, SHOWCASE_DIR),
    listContents(owner, repo, SCREENSHOT_MULTI),
    listContents(owner, repo, VIDEO_MULTI),
    listContents(owner, repo, LEGACY_SCREENSHOT_MULTI),
    listContents(owner, repo, ""),
  ]);
  const found = listings.filter((listing): listing is string[] => listing !== null);
  if (found.length === 0) return null;
  return [...new Set(found.flat())];
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]!);
    }
  });
  await Promise.all(workers);
  return results;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const tag = item.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

async function resolveEntry(raw: RawEntry): Promise<ResolvedEntry | null> {
  const username = typeof raw.username === "string" ? raw.username.trim() : "";
  const dotfiles = typeof raw.dotfiles === "string" ? raw.dotfiles.trim() : "";
  if (!username || !dotfiles) return null;
  if (!USERNAME_RE.test(username)) {
    console.warn(`Showcase: skipping entry with invalid username "${username}"`);
    return null;
  }

  const tags = normalizeTags(raw.tags);
  const added = typeof raw.added === "string" ? raw.added : null;

  const repo = parseRepo(dotfiles);
  if (!repo) {
    console.warn(`Showcase: skipping ${username} (dotfiles is not a GitHub repo)`);
    return null;
  }

  let paths: string[] | null;
  try {
    paths = await listRepoPaths(repo.owner, repo.repo);
  } catch (error) {
    console.warn(`Showcase: skipping ${username} (list failed: ${(error as Error).message})`);
    return null;
  }
  if (!paths) {
    console.warn(`Showcase: skipping ${username} (could not list ${repo.owner}/${repo.repo})`);
    return null;
  }

  const toMedia = (filePaths: string[]): MediaFile[] =>
    filePaths.map((filePath) => {
      const url = rawUrl(repo.owner, repo.repo, filePath);
      return { url, name: mediaFileName(username, url) };
    });

  const screenshots = toMedia(pickScreenshots(paths));
  const videos = toMedia(pickVideos(paths));
  if (screenshots.length === 0 && videos.length === 0) {
    console.warn(`Showcase: skipping ${username} (no media found)`);
    return null;
  }

  return { username, dotfiles, tags, added, screenshots, videos };
}

function compareByAdded(a: { added: string | null }, b: { added: string | null }): number {
  if (!a.added && !b.added) return 0;
  if (!a.added) return 1;
  if (!b.added) return -1;
  return b.added.localeCompare(a.added);
}

function dedupeByUsername(entries: ResolvedEntry[]): ResolvedEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = entry.username.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadEntries(): Promise<ResolvedEntry[]> {
  const response = await fetch(ENTRIES_URL);
  if (!response.ok) throw new Error(`Failed to fetch entries.yml (HTTP ${response.status})`);

  const raw = parse(await response.text()) as unknown;
  if (!Array.isArray(raw)) throw new Error("entries.yml did not parse to a list");

  const resolved = await mapLimit(raw as RawEntry[], DISCOVERY_CONCURRENCY, resolveEntry);
  const entries = resolved
    .filter((entry): entry is ResolvedEntry => entry !== null)
    .sort(compareByAdded);
  return dedupeByUsername(entries);
}

async function outputExists(): Promise<boolean> {
  try {
    await access(OUTPUT_FILE);
    return true;
  } catch {
    return false;
  }
}

async function writeEmpty(): Promise<void> {
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, "[]\n");
}

async function main() {
  try {
    const discovered = await loadEntries();
    const entries = await downloadMedia(discovered);
    if (discovered.length > 0 && entries.length === 0) {
      throw new Error("no entries survived media download");
    }
    await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await writeFile(OUTPUT_FILE, `${JSON.stringify(entries, null, 2)}\n`);
    console.log(`Showcase: wrote ${entries.length} entries to src/data/showcase.json`);
  } catch (error) {
    if (await outputExists()) {
      console.warn("Showcase: generation failed, keeping existing data.", error);
      return;
    }
    await writeEmpty();
    console.warn("Showcase: generation failed and no data exists; wrote an empty list.", error);
  }
}

await main();
