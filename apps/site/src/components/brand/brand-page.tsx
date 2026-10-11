import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { cn } from "cn";
import { RadioGroup, RadioGroupItem } from "@mangowm/ui/components/radio-group";
import { Slider } from "@mangowm/ui/components/slider";
import { toast } from "@mangowm/ui/components/toast";
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

function OptionCard({
  id,
  value,
  className,
  children,
}: {
  id: string;
  value: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className={cn("brand-option", className)}>
      <RadioGroupItem id={id} value={value} className="brand-option-input" />
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
  const [busy, setBusy] = useState(false);

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
      toast.add({ type: "success", description: `Downloaded ${filename}` });
    } catch (error) {
      console.error("Logo export failed:", error);
      toast.add({ type: "error", description: "Export failed. Please try again." });
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
                <Download className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="brand-controls">
          <fieldset className="brand-field">
            <legend className="brand-field-label">Format</legend>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as LogoFormat)}
              className="flex flex-wrap gap-1.5"
            >
              {(["svg", "png"] as const).map((value) => (
                <OptionCard key={value} id={`brand-format-${value}`} value={value}>
                  {value.toUpperCase()}
                </OptionCard>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">Background</legend>
            <RadioGroup
              value={background}
              onValueChange={(value) => setBackground(value as LogoBackground)}
              className="flex flex-wrap gap-1.5"
            >
              {BACKGROUND_KEYS.map((value) => {
                const meta = LOGO_BACKGROUNDS[value];
                return (
                  <OptionCard key={value} id={`brand-background-${value}`} value={value}>
                    <span
                      className={cn(
                        "brand-swatch",
                        value === "transparent" && "brand-swatch-transparent",
                      )}
                      style={meta.color ? { background: meta.color } : undefined}
                      aria-hidden="true"
                    />
                    {meta.label}
                  </OptionCard>
                );
              })}
            </RadioGroup>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">Ratio</legend>
            <RadioGroup
              value={ratio}
              onValueChange={(value) => setRatio(value as LogoRatio)}
              className="flex flex-wrap gap-1.5"
            >
              {RATIO_KEYS.map((value) => {
                const meta = LOGO_RATIOS[value];
                return (
                  <OptionCard
                    key={value}
                    id={`brand-ratio-${value}`}
                    value={value}
                    className="brand-option-stacked"
                  >
                    <span className="brand-option-main">{meta.ratio}</span>
                    <span className="brand-option-sub">{meta.label}</span>
                  </OptionCard>
                );
              })}
            </RadioGroup>
          </fieldset>

          <fieldset className="brand-field">
            <legend className="brand-field-label">
              Size <span className="brand-field-hint">longest edge</span>
            </legend>
            <RadioGroup
              value={String(size)}
              onValueChange={(value) => setSize(Number(value))}
              className="flex flex-wrap gap-1.5"
            >
              {LOGO_SIZES.map((value) => (
                <OptionCard key={value} id={`brand-size-${value}`} value={String(value)}>
                  {value}px
                </OptionCard>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="brand-field">
            <label className="brand-field-label" htmlFor="brand-padding">
              Padding <span className="brand-field-hint">{padding}%</span>
            </label>
            <Slider
              id="brand-padding"
              value={padding}
              onValueChange={(value) => setPadding(value as number)}
              min={0}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
