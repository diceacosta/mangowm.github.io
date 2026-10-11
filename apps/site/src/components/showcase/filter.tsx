import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@mangowm/ui/components/button";
import { Separator } from "@mangowm/ui/components/separator";
import { ToggleGroup, ToggleGroupItem } from "@mangowm/ui/components/toggle-group";
import type { ShowcaseEntry } from "@/lib/showcase-data";

const VISIBLE_TAGS = 8;

const toggleClass =
  "inline-flex h-auto min-w-0 items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent hover:text-foreground aria-pressed:border-primary/60 aria-pressed:bg-primary/15 aria-pressed:text-primary-text";

export function Filter({
  entries,
  activeTags,
  filteredCount,
  onChange,
  onClear,
}: {
  entries: ShowcaseEntry[];
  activeTags: Set<string>;
  filteredCount: number;
  onChange: (tags: string[]) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort();
  const hiddenActive = allTags.slice(VISIBLE_TAGS).some((tag) => activeTags.has(tag));

  const showAll = expanded || hiddenActive;
  const visible = showAll ? allTags : allTags.slice(0, VISIBLE_TAGS);
  const hiddenCount = allTags.length - VISIBLE_TAGS;

  const tagCount = new Map(allTags.map((tag) => [tag, 0]));
  for (const entry of entries) {
    for (const tag of entry.tags) tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup multiple value={[...activeTags]} onValueChange={onChange} className="contents">
          {visible.map((tag) => {
            const active = activeTags.has(tag);
            return (
              <ToggleGroupItem key={tag} value={tag} className={toggleClass}>
                {active && <Check size={8} strokeWidth={3} />}
                {tag}
                <span className="text-[10px] tabular-nums opacity-50">{tagCount.get(tag)}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {!showAll && hiddenCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-dashed border-border text-xs text-muted-foreground"
          >
            +{hiddenCount} more
          </Button>
        )}

        {showAll && allTags.length > VISIBLE_TAGS && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(false)}
            disabled={hiddenActive}
            className="rounded-full border border-dashed border-border text-xs text-muted-foreground"
          >
            Show less
          </Button>
        )}
      </div>

      {activeTags.size > 0 && (
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {filteredCount} of {entries.length} shown
          </span>
          <Separator orientation="vertical" className="h-3" />
          <Button
            variant="link"
            size="sm"
            onClick={onClear}
            className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
