import { buttonVariants } from "@mangowm/ui/components/button";
import { LayoutPreview } from "@/components/layouts/layout-preview";
import { SponsorButton } from "@/components/sponsor/sponsor-button";
import { HeartSvg } from "./icons";

function Hero() {
  return (
    <>
      <section className="relative flex min-h-[calc(100dvh_-_var(--nav-height))] flex-1 items-center px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-[75rem] items-center gap-12 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:gap-16">
          <div className="text-center lg:text-left">
            <h1 className="mb-5 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance text-foreground">
              <span className="block">Lightweight</span>
              <span className="block text-primary-text">&amp; feature-rich</span>
            </h1>
            <p className="mx-auto mb-8 max-w-[32rem] text-lg leading-[1.55] text-pretty text-muted-foreground lg:mx-0 lg:text-[1.1875rem]">
              A lightweight, feature-rich Wayland compositor built on wlroots and scenefx.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/docs/"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 rounded-xl px-6 text-[0.9375rem] font-semibold",
                })}
              >
                Get started
              </a>
              <a
                href="https://github.com/mangowm/mango"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-11 rounded-xl px-6 text-[0.9375rem] font-semibold",
                })}
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <LayoutPreview />
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-[var(--container)] px-5 py-20 text-center sm:px-8 sm:py-24">
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.03em] text-foreground">
            Sponsors
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[1.0625rem] leading-[1.6] text-pretty text-muted-foreground">
            Thanks to the people who support mango&apos;s development.
          </p>

          <div className="mt-12 flex flex-wrap items-start justify-center gap-8">
            {["dl09r", "tonybanters", "vinthara", "stepbrobd"].map((name) => (
              <a
                key={name}
                href={`https://github.com/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2.5"
              >
                <img
                  src={`https://unavatar.io/github/${name}`}
                  alt={name}
                  loading="lazy"
                  className="size-16 rounded-full border-2 border-card object-cover shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_2px_var(--color-primary)]"
                />
                <span className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                  {name}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-[34rem] before:absolute before:inset-[0.85rem_-0.85rem_-0.85rem_0.85rem] before:z-0 before:rotate-[2.5deg] before:rounded-3xl before:bg-leaf before:content-['']">
              <div className="relative z-[1] w-full rounded-3xl border border-border bg-card p-9 shadow-[0_18px_40px_oklch(0.7_0.13_78_/_0.12)]">
                <HeartSvg className="mx-auto size-8 text-brand" />
                <h3 className="mt-3.5 font-display text-xl font-bold tracking-[-0.02em] text-foreground">
                  Become a sponsor
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                  If mango makes your desktop better, consider supporting its development. Every
                  contribution helps.
                </p>
                <div className="mt-6 flex justify-center">
                  <SponsorButton size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function HomePage() {
  return <Hero />;
}
