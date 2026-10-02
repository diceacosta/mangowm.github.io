import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cn } from "@/cn";
import { ChevronDownIcon, HorizIcon, VertIcon } from "@/components/icons";
import { LayoutStage } from "./layout-stage";
import {
  AUTO_PLAY_IDS,
  AUTO_PLAY_INTERVAL,
  DEFAULT_LAYOUT,
  LAYOUTS,
  PRIMARY_LAYOUTS,
  SECONDARY_LAYOUTS,
} from "./registry";
import type { LayoutId, Orientation } from "./types";

export function LayoutPreview() {
  const [activeLayout, setActiveLayout] = useState<LayoutId>(DEFAULT_LAYOUT.id);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [showMore, setShowMore] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeDef = LAYOUTS.find((layout) => layout.id === activeLayout) ?? DEFAULT_LAYOUT;
  const isPrimary = PRIMARY_LAYOUTS.some((layout) => layout.id === activeLayout);
  const supportsOrientation = activeDef.supportsOrientation;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveLayout((current) => {
        const index = AUTO_PLAY_IDS.indexOf(current);
        return AUTO_PLAY_IDS[(index + 1) % AUTO_PLAY_IDS.length] ?? DEFAULT_LAYOUT.id;
      });
      setOrientation("horizontal");
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleClickOutside = useEffectEvent((event: MouseEvent) => {
    if (!dropdownRef.current?.contains(event.target as Node)) setShowMore(false);
  });

  useEffect(() => {
    if (!showMore) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMore]);

  const selectLayout = (id: LayoutId) => {
    setActiveLayout(id);
    setIsAutoPlaying(false);
    setShowMore(false);
  };

  const selectOrientation = (value: Orientation) => {
    setOrientation(value);
    setIsAutoPlaying(false);
  };

  return (
    <div className="layouts-wrapper">
      <div className="layouts-controls">
        <div className="layouts-pill">
          {PRIMARY_LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => selectLayout(layout.id)}
              className={cn(
                "layouts-pill-btn",
                activeLayout === layout.id && "layouts-pill-btn-active",
              )}
            >
              {layout.label}
            </button>
          ))}

          <div ref={dropdownRef} className="dropdown">
            <button
              type="button"
              onClick={() => setShowMore((value) => !value)}
              className={cn("layouts-pill-btn-more", !isPrimary && "layouts-pill-btn-more-active")}
            >
              {isPrimary ? "More" : activeDef.label}
              <ChevronDownIcon />
            </button>

            {showMore && (
              <div className="dropdown-menu">
                {SECONDARY_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => selectLayout(layout.id)}
                    className={cn(
                      "dropdown-item",
                      activeLayout === layout.id && "dropdown-item-active",
                    )}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "layouts-orientation-group",
            !supportsOrientation && "layouts-orientation-group-disabled",
          )}
          title={!supportsOrientation ? "This layout has no orientation variant" : undefined}
        >
          <button
            type="button"
            onClick={() => selectOrientation("horizontal")}
            title="Horizontal"
            aria-label="Horizontal"
            aria-pressed={orientation === "horizontal" && supportsOrientation}
            disabled={!supportsOrientation}
            className={cn(
              "layouts-orientation-btn",
              orientation === "horizontal" &&
                supportsOrientation &&
                "layouts-orientation-btn-active",
            )}
          >
            <HorizIcon />
          </button>
          <button
            type="button"
            onClick={() => selectOrientation("vertical")}
            title="Vertical"
            aria-label="Vertical"
            aria-pressed={orientation === "vertical" && supportsOrientation}
            disabled={!supportsOrientation}
            className={cn(
              "layouts-orientation-btn",
              orientation === "vertical" && supportsOrientation && "layouts-orientation-btn-active",
            )}
          >
            <VertIcon />
          </button>
        </div>
      </div>

      <div className="layouts-preview">
        <LayoutStage key={activeDef.id} layout={activeDef} orientation={orientation} />
      </div>
    </div>
  );
}
