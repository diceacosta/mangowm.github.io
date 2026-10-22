import { useState } from "react";
import { Button } from "@mangowm/ui/components/button";
import { Separator } from "@mangowm/ui/components/separator";
import { Card } from "./card";
import { Filter } from "./filter";
import { Lightbox } from "./lightbox";
import { SubmitDialog } from "./submit-dialog";
import { entryMedia, showcaseEntries } from "@/lib/showcase-data";

export function ShowcasePage() {
  const entries = showcaseEntries;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const filteredEntries =
    activeTags.size === 0
      ? entries
      : entries.filter((entry) => entry.tags.some((tag) => activeTags.has(tag)));

  const setTags = (tags: string[]) => setActiveTags(new Set(tags));

  const clearTags = () => setActiveTags(new Set());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setMediaIndex(0);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevLightbox = () => {
    if (lightboxIndex === null || lightboxIndex === 0) return;
    const target = lightboxIndex - 1;
    const targetEntry = filteredEntries[target];
    setMediaIndex(targetEntry ? Math.max(entryMedia(targetEntry).length - 1, 0) : 0);
    setLightboxIndex(target);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null || lightboxIndex === filteredEntries.length - 1) return;
    setMediaIndex(0);
    setLightboxIndex(lightboxIndex + 1);
  };

  return (
    <div className="mx-auto w-full max-w-[75rem] px-5 py-16 sm:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Showcase
          </h1>
        </div>

        <SubmitDialog className="w-full shrink-0 sm:w-auto" />
      </div>

      {entries.length > 0 && (
        <div className="mb-8">
          <Filter
            entries={entries}
            activeTags={activeTags}
            filteredCount={filteredEntries.length}
            onChange={setTags}
            onClear={clearTags}
          />
        </div>
      )}

      <Separator className="mb-8" />

      {filteredEntries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry, index) => (
            <Card
              key={entry.username}
              entry={entry}
              onOpen={() => openLightbox(index)}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-sm text-muted-foreground">
            {entries.length === 0
              ? "The showcase is unavailable right now."
              : "No setups match these filters."}
          </p>
          {activeTags.size > 0 && (
            <Button variant="link" onClick={clearTags} className="text-primary-text">
              Clear filters
            </Button>
          )}
        </div>
      )}

      {lightboxIndex !== null && filteredEntries.length > 0 && (
        <Lightbox
          entries={filteredEntries}
          index={lightboxIndex}
          mediaIndex={mediaIndex}
          setMediaIndex={setMediaIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </div>
  );
}
