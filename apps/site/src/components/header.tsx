import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";
import { cn } from "@/cn";
import { SponsorButton } from "./sponsor-button";
import { DiscordIcon, GithubIcon, MenuSvg, XSvg } from "./icons";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Showcase", to: "/showcase" },
  { label: "Releases", to: "/releases" },
  { label: "Settings", href: "/settings" },
] as const;

type NavLink = (typeof NAV_LINKS)[number];

const NAV_ITEM = "inline-flex items-center rounded-full text-sm font-medium transition-colors";

const ICON_LINK =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_img]:h-[1.125rem] [&_img]:w-[1.125rem]";

function NavItem({
  link,
  block,
  onNavigate,
}: {
  link: NavLink;
  block?: boolean;
  onNavigate?: () => void;
}) {
  const layout = block ? "w-full px-3 py-2" : "px-3 py-1.5";
  const className = cn(
    NAV_ITEM,
    layout,
    "text-muted-foreground hover:bg-accent hover:text-foreground",
  );
  const activeClassName = cn(NAV_ITEM, layout, "bg-primary font-semibold text-primary-foreground");

  if ("to" in link) {
    return (
      <Link
        to={link.to}
        className={className}
        activeProps={{ className: activeClassName, "aria-current": "page" }}
        onClick={onNavigate}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </a>
  );
}

function ThemeToggle() {
  const onStorage = useEffectEvent(() => {
    const theme = localStorage.getItem("theme");
    const isDark =
      theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  });

  useEffect(() => {
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button type="button" onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
      <svg
        className="theme-sun"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        className="theme-moon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  useEffect(() => {
    if (!menuOpen) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const onPointerDown = useEffectEvent((event: MouseEvent) => {
    if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
  });

  useEffect(() => {
    if (!menuOpen) return;
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const onResize = useEffectEvent(() => {
    if (window.innerWidth >= 1024) setMenuOpen(false);
  });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-[75rem] items-center gap-2 px-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2 font-display text-base font-bold tracking-tight text-foreground"
        >
          <img src={mangowmLogo} alt="mangowm" className="h-5 w-5" />
          mangowm
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem link={link} />
              </li>
            ))}
            <li className="ml-2">
              <SponsorButton />
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href="https://discord.gg/CPjbDxesh5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className={ICON_LINK}
          >
            <DiscordIcon />
          </a>
          <a
            href="https://github.com/mangowm/mango"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={ICON_LINK}
          >
            <GithubIcon />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden",
            )}
          >
            {menuOpen ? <XSvg className="h-5 w-5" /> : <MenuSvg className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="Mobile"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto flex max-w-[75rem] flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem link={link} block onNavigate={closeMenu} />
              </li>
            ))}
            <li className="mt-2">
              <SponsorButton />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
