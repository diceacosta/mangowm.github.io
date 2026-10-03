import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/cn";
import { DownloadSvg } from "../icons";
import { Toaster } from "../toaster";
import {
  LOGO_BACKGROUNDS,
  LOGO_RATIOS,
  LOGO_SIZES,
  buildLogoFilename,
  buildLogoSvg,
  downloadBlob,
  getLogoDimensions,
  renderLogoPng,
  type LogoBackground,
  type LogoFormat,
  type LogoRatio,
} from "./logo-export";

const BACKGROUND_KEYS = Object.keys(LOGO_BACKGROUNDS) as LogoBackground[];
const RATIO_KEYS = Object.keys(LOGO_RATIOS) as LogoRatio[];

const MESSAGE_DURATION = 2200;

function OptionRadio({
  name,
  value,
  checked,
  onSelect,
  className,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("brand-option", className, checked && "brand-option-active")}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="brand-option-input"
      />
      {children}
    </label>
  );
}

export function BrandPage() {
  const [format, setFormat] = useState<LogoFormat>("svg");
  const [background, setBackground] = useState<LogoBackground>("transparent");
  const [ratio, setRatio] = useState<LogoRatio>("square");
  const [size, setSize] = useState(1024);
  const [padding, setPadding] = useState(8);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), MESSAGE_DURATION);
  };

  const { width, height } = getLogoDimensions(ratio, size);
  const svg = buildLogoSvg({ width, height, background, padding });

  const ratioMeta = LOGO_RATIOS[ratio];

  const handleDownload = async () => {
    const filename = buildLogoFilename({ ratio, background, format, width, height });
    try {
      setBusy(true);
      if (format === "svg") {
        downloadBlob(new Blob([svg], { type: "image/svg+xml" }), filename);
      } else {
        const blob = await renderLogoPng(svg, { width, height });
        downloadBlob(blob, filename);
      }
      showMessage(`Downloaded ${filename}`);
    } catch (error) {
      console.error("Logo export failed:", error);
      showMessage("Export failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="brand-page">
      <header className="brand-hero">
        <h1 className="brand-title">mangowm logo</h1>
      </header>

      <section className="brand-workbench" aria-label="Logo export">
        <div className="brand-preview-col">
          <div
            className="brand-preview-frame"
            style={{
              aspectRatio: `${ratioMeta.width} / ${ratioMeta.height}`,
              maxWidth: `calc(30rem * ${ratioMeta.width} / ${ratioMeta.height})`,
            }}
          >
            <div
              className="brand-preview-logo"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: svg }}
            />

            <div className="brand-preview-tools">
              <button
                type="button"
                className="brand-tool-btn"
                onClick={handleDownload}
                disabled={busy}
                aria-label={busy ? "Exporting logo" : `Download ${format.toUpperCase()}`}
                title={busy ? "Exporting…" : `Download ${format.toUpperCase()}`}
              >
                <DownloadSvg className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="brand-controls">
          <fieldset className="brand-field">
            <legend className="brand-field-label">Format</legend>
            <div className="brand-options">
              {(["svg", "png"] as const).map((value) => (
                <OptionRadio
                  key={value}
                  name="brand-format"
                  value={value}
                  checked={format === value}
                  onSelect={() => setFormat(value)}
                >
                  {value.toUpperCase()}
                </OptionRadio>
              ))}
            </div>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">Background</legend>
            <div className="brand-options">
              {BACKGROUND_KEYS.map((value) => {
                const meta = LOGO_BACKGROUNDS[value];
                return (
                  <OptionRadio
                    key={value}
                    name="brand-background"
                    value={value}
                    checked={background === value}
                    onSelect={() => setBackground(value)}
                  >
                    <span
                      className={cn(
                        "brand-swatch",
                        value === "transparent" && "brand-swatch-transparent",
                      )}
                      style={meta.color ? { background: meta.color } : undefined}
                      aria-hidden="true"
                    />
                    {meta.label}
                  </OptionRadio>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">Ratio</legend>
            <div className="brand-options">
              {RATIO_KEYS.map((value) => {
                const meta = LOGO_RATIOS[value];
                return (
                  <OptionRadio
                    key={value}
                    name="brand-ratio"
                    value={value}
                    checked={ratio === value}
                    onSelect={() => setRatio(value)}
                    className="brand-option-stacked"
                  >
                    <span className="brand-option-main">{meta.ratio}</span>
                    <span className="brand-option-sub">{meta.label}</span>
                  </OptionRadio>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">
              Size <span className="brand-field-hint">longest edge</span>
            </legend>
            <div className="brand-options">
              {LOGO_SIZES.map((value) => (
                <OptionRadio
                  key={value}
                  name="brand-size"
                  value={String(value)}
                  checked={size === value}
                  onSelect={() => setSize(value)}
                >
                  {value}px
                </OptionRadio>
              ))}
            </div>
          </fieldset>

          <div className="brand-field">
            <label className="brand-field-label" htmlFor="brand-padding">
              Padding <span className="brand-field-hint">{padding}%</span>
            </label>
            <input
              id="brand-padding"
              type="range"
              min={0}
              max={30}
              step={1}
              value={padding}
              onChange={(event) => setPadding(Number(event.target.value))}
              className="brand-range"
            />
          </div>
        </div>
      </section>

      <Toaster message={message} />
    </div>
  );
}
