import { Link } from "@tanstack/react-router";
import { latestVersion } from "../constants";
import { MangoLayouts } from "./mango-layouts";
import { SponsorButton } from "./sponsor-button";
import { ArrowRight, HeartSvg } from "./icons";

function VersionTag({ version }: { version: string }) {
  return (
    <Link to="/releases" className="version-badge">
      <span className="version-dot" />
      {version}
      <ArrowRight />
    </Link>
  );
}

function Hero({ version }: { version: string }) {
  return (
    <>
      {/* Mobile */}
      <section className="hero-mobile">
        <div className="hero-content">
          <div className="mb-6 flex justify-center">
            <VersionTag version={version} />
          </div>
          <h1 className="hero-title">
            <span className="block">Lightweight</span>
            <span className="hero-title-muted block">&amp; feature-rich</span>
          </h1>
          <p className="hero-desc">
            A lightweight, feature-rich Wayland compositor built on wlroots and scenefx.
          </p>
          <div className="hero-actions">
            <a href="/docs" className="btn-primary">
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

        <div className="layouts-mobile">
          <div className="hero-visual">
            <MangoLayouts />
          </div>
        </div>
      </section>

      {/* Desktop */}
      <section className="hero-desktop">
        <div className="hero-row">
          <div className="hero-col text-left">
            <div className="mb-6 flex justify-start">
              <VersionTag version={version} />
            </div>
            <h1 className="hero-title hero-title-lg text-left">
              <span className="block">Lightweight</span>
              <span className="hero-title-muted block">&amp; feature-rich</span>
            </h1>
            <p className="hero-desc hero-desc-lg text-left">
              A lightweight, feature-rich Wayland compositor built on wlroots and scenefx.
            </p>
            <div className="hero-actions hero-actions-left">
              <a href="/docs" className="btn-primary">
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
          <div className="hero-col-layouts">
            <div className="hero-visual">
              <MangoLayouts />
            </div>
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
  return <Hero version={latestVersion} />;
}
