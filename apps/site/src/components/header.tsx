import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Popover } from "@base-ui/react/popover";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";
import { cn } from "cn";
import { SponsorButton } from "./sponsor/sponsor-button";
import { DiscordIcon, GithubIcon, MenuSvg, XSvg } from "./icons";

const NAV_LINKS = [
  { label: "Docs", href: "/docs/" },
  { label: "Showcase", to: "/showcase" },
  { label: "Brand", to: "/brand" },
  { label: "Settings", href: "/settings/" },
] as const;

type NavLink = (typeof NAV_LINKS)[number];

const DISCORD_URL = "https://discord.gg/CPjbDxesh5";
const GITHUB_URL = "https://github.com/mangowm/mango";

function isActive(link: NavLink, pathname: string) {
  const target = "to" in link ? link.to : link.href;
  const base = target.endsWith("/") ? target : `${target}/`;
  return pathname === target || pathname.startsWith(base);
}

function NavLinkItem({ link, active }: { link: NavLink; active: boolean }) {
  const className = cn("site-nav-link", active && "site-nav-link-active");
  const shared = {
    className,
    "aria-current": active ? ("page" as const) : undefined,
  };

  if ("to" in link) {
    return (
      <Link to={link.to} {...shared}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} {...shared}>
      {link.label}
    </a>
  );
}

function DesktopNav({ activeIndex }: { activeIndex: number }) {
  return (
    <nav aria-label="Primary" className="site-nav site-piece">
      {activeIndex >= 0 ? <span aria-hidden="true" className="site-nav-indicator" /> : null}
      {NAV_LINKS.map((link, index) => (
        <NavLinkItem key={link.label} link={link} active={index === activeIndex} />
      ))}
    </nav>
  );
}

function applyStoredTheme() {
  const theme = localStorage.getItem("theme");
  const isDark =
    theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

function ThemeToggle() {
  useEffect(() => {
    window.addEventListener("storage", applyStoredTheme);
    return () => window.removeEventListener("storage", applyStoredTheme);
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
        width="17"
        height="17"
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
        width="17"
        height="17"
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

function SocialLinks() {
  return (
    <>
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
        className="site-icon-link"
      >
        <DiscordIcon />
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="site-icon-link"
      >
        <GithubIcon />
      </a>
    </>
  );
}

function MobileNav({
  open,
  setOpen,
  pathname,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
}) {
  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger
        aria-label={open ? "Close menu" : "Open menu"}
        className="site-icon-link site-menu-trigger"
      >
        {open ? <XSvg /> : <MenuSvg />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Backdrop className="site-menu-backdrop" />
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={2}
          collisionPadding={8}
          className="site-menu-positioner"
        >
          <Popover.Popup className="site-menu">
            <nav aria-label="Mobile">
              <ul className="site-menu-list">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link, pathname);
                  const className = cn("site-menu-item", active && "site-menu-item-active");
                  const shared = {
                    className,
                    "aria-current": active ? ("page" as const) : undefined,
                    onClick: () => setOpen(false),
                  };

                  return (
                    <li key={link.label}>
                      {"to" in link ? (
                        <Link to={link.to} {...shared}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} {...shared}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="site-menu-footer">
              <ThemeToggle />
              <div className="site-menu-socials">
                <SocialLinks />
              </div>
            </div>
            <div className="site-menu-footer site-menu-cta">
              <SponsorButton />
            </div>

            <Popover.Close className="sr-only">Close menu</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeIndex = NAV_LINKS.findIndex((link) => isActive(link, pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="site-brand site-piece"
          aria-label="mangowm home"
        >
          <img src={mangowmLogo} alt="" aria-hidden="true" className="site-brand-logo" />
          <span>mangowm</span>
        </Link>

        <DesktopNav activeIndex={activeIndex} />

        <div className="site-pill site-piece">
          <div className="site-desktop-only">
            <ThemeToggle />
          </div>
          <div className="site-desktop-only">
            <SocialLinks />
          </div>
          <div className="site-cta">
            <SponsorButton />
          </div>
          <MobileNav open={menuOpen} setOpen={setMenuOpen} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
