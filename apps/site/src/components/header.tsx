import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";
import { cn } from "cn";
import { Button } from "@mangowm/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@mangowm/ui/components/sheet";
import { SponsorButton } from "./sponsor/sponsor-button";
import { ModeToggle } from "./mode-toggle";
import { DiscordIcon, GithubIcon, MenuSvg } from "./icons";

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}
      >
        <MenuSvg />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(20rem,calc(100vw-2rem))] gap-0 border-l border-border bg-card/95 p-0 backdrop-blur-xl sm:max-w-sm"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Site navigation and quick links</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto p-4">
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
          <ModeToggle />
          <div className="site-menu-socials">
            <SocialLinks />
          </div>
        </div>
        <div className="site-menu-footer site-menu-cta">
          <SponsorButton />
        </div>
      </SheetContent>
    </Sheet>
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
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
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
            <ModeToggle />
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
