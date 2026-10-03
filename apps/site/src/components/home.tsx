import { LayoutPreview } from "./layouts/layout-preview";
import { SponsorButton } from "./sponsor/sponsor-button";
import { HeartSvg } from "./icons";

function Hero() {
  return (
    <>
      <section className="relative flex min-h-[calc(100dvh_-_3.5rem)] flex-1 items-center px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-[75rem] items-center gap-12 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:gap-16">
          <div className="text-center lg:text-left">
            <h1 className="mb-5 text-balance font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-foreground">
              <span className="block">Lightweight</span>
              <span className="block text-primary-text">&amp; feature-rich</span>
            </h1>
            <p className="mx-auto mb-8 max-w-[32rem] text-pretty text-lg leading-[1.55] text-muted-foreground lg:mx-0 lg:text-[1.1875rem]">
              A lightweight, feature-rich Wayland compositor built on wlroots and scenefx.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href="/docs/" className="btn-primary">
                Get started
              </a>
              <a
                href="https://github.com/mangowm/mango"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
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
      <section className="sponsors-section">
        <div className="sponsors-container">
          <h2 className="sponsors-title">Sponsors</h2>
          <p className="sponsors-subtitle">
            Thanks to the people who support mango&apos;s development.
          </p>

          <div className="sponsors-grid">
            {["dl09r", "tonybanters", "vinthara"].map((name) => (
              <a
                key={name}
                href={`https://github.com/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card"
              >
                <img
                  src={`https://unavatar.io/github/${name}`}
                  alt={name}
                  className="sponsor-avatar"
                  loading="lazy"
                />
                <span className="sponsor-name">{name}</span>
              </a>
            ))}
          </div>

          <div className="sponsor-cta">
            <div className="sponsor-cta-card-wrap">
              <div className="sponsor-cta-card">
                <HeartSvg className="sponsor-cta-icon" />
                <h3 className="sponsor-cta-title">Become a sponsor</h3>
                <p className="sponsor-cta-desc">
                  If mango makes your desktop better, consider supporting its development. Every
                  contribution helps.
                </p>
                <div className="sponsor-cta-btn">
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
