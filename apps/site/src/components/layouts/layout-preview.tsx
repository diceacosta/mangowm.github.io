import { useEffect, useState } from "react";
import { Menu } from "@base-ui/react/menu";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  const selectLayout = (id: LayoutId) => {
    setActiveLayout(id);
    setIsAutoPlaying(false);
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

          <Menu.Root>
            <Menu.Trigger
              className={cn("layouts-pill-btn-more", !isPrimary && "layouts-pill-btn-more-active")}
            >
              {isPrimary ? "More" : activeDef.label}
              <ChevronDownIcon />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={6} align="end" className="z-50 outline-none">
                <Menu.Popup className="dropdown-menu">
                  {SECONDARY_LAYOUTS.map((layout) => (
                    <Menu.Item
                      key={layout.id}
                      onClick={() => selectLayout(layout.id)}
                      className={cn(
                        "dropdown-item",
                        activeLayout === layout.id && "dropdown-item-active",
                      )}
                    >
                      {layout.label}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
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
