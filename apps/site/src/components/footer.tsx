import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";
import { DISCORD_URL, GITHUB_URL } from "@/constants";

const SIGNATURE_LOGO_STYLE = {
  "--signature-logo": `url("${mangowmLogo}")`,
} as CSSProperties;

const SITE_LINKS = [
  { label: "Docs", href: "/docs/" },
  { label: "Showcase", to: "/showcase" },
  { label: "Brand", to: "/brand" },
  { label: "Settings", href: "/settings/" },
] as const;

const PROJECT_LINKS = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "Releases", href: `${GITHUB_URL}/releases` },
  {
    label: "mangobar",
    href: "https://github.com/mangowm/mangobar",
    title: "A simple status bar for mango",
  },
  {
    label: "Repology",
    href: "https://repology.org/project/mangowm/versions",
    title: "Package status on Repology",
  },
] as const;

const COMMUNITY_LINKS = [
  { label: "Discord", href: DISCORD_URL },
  { label: "Discussions", href: `${GITHUB_URL}/discussions` },
  { label: "Issues", href: `${GITHUB_URL}/issues` },
] as const;

type FooterLink = { label: string; title?: string } & (
  | { href: string; to?: undefined }
  | { to: "/showcase" | "/brand"; href?: undefined }
);

const LINK_CLASS =
  "relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-150 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-200 after:ease-out hover:text-foreground hover:after:scale-x-100";

function LinkColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-mono text-[0.6875rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col items-start gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} title={link.title} className={LINK_CLASS}>
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                title={link.title}
                className={LINK_CLASS}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const signatureRef = useRef<HTMLDivElement>(null);

  // The wave is a paint-bound effect, so pause it while the signature is off-screen.
  useEffect(() => {
    const element = signatureRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) element.dataset.wave = entry.isIntersecting ? "on" : "off";
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="site-footer">
      <div className="mx-auto w-full max-w-[var(--container)] px-5 sm:px-8">
        <div className="grid gap-10 pt-14 pb-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:pt-16 lg:pb-14">
          <div className="max-w-sm">
            <Link
              to="/"
              className="footer-brand group inline-flex items-center gap-2 font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-foreground no-underline"
              aria-label="mangowm home"
            >
              <img
                src={mangowmLogo}
                alt=""
                aria-hidden="true"
                className="size-6 transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.1] group-hover:rotate-[-8deg]"
              />
              <span>mangowm</span>
            </Link>

            <p className="mt-4 text-sm leading-[1.65] text-pretty text-muted-foreground">
              Free and open source, built on wlroots and scenefx.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-10 lg:gap-14">
            <LinkColumn title="Site" links={SITE_LINKS} />
            <LinkColumn title="Project" links={PROJECT_LINKS} />
            <LinkColumn title="Community" links={COMMUNITY_LINKS} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} mangowm</span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <a
              href={`${GITHUB_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground hover:underline hover:underline-offset-2"
            >
              GPL-3.0
            </a>
          </p>
          <a
            href="#main-content"
            className="group inline-flex w-fit items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
            />
          </a>
        </div>
      </div>

      <div ref={signatureRef} aria-hidden="true" className="site-footer-signature">
        <span className="site-footer-signature-word">
          <span>mang</span>
          <span className="site-footer-signature-o" style={SIGNATURE_LOGO_STYLE} />
          <span>wm</span>
        </span>
      </div>
    </footer>
  );
}
