import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";
import { Button } from "@mangowm/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@mangowm/ui/components/sheet";
import { SponsorButton } from "./sponsor/sponsor-button";
import { ModeToggle } from "./mode-toggle";
import { DiscordIcon, GithubIcon, MenuSvg } from "./icons";

const NAV_ITEMS = [
  { label: "Docs", href: "/docs/" },
  { label: "Showcase", to: "/showcase" },
  { label: "Brand", to: "/brand" },
  { label: "Settings", href: "/settings/" },
] as const;

type NavItemData = (typeof NAV_ITEMS)[number];

const DISCORD_URL = "https://discord.gg/CPjbDxesh5";
const GITHUB_URL = "https://github.com/mangowm/mango";

function isCurrent(item: NavItemData, pathname: string) {
  const target = "to" in item ? item.to : item.href;
  const base = target.endsWith("/") ? target : `${target}/`;
  return pathname === target || pathname.startsWith(base);
}

function NavItem({
  item,
  active,
  onNavigate,
  className,
}: {
  item: NavItemData;
  active: boolean;
  onNavigate?: () => void;
  className: string;
}) {
  const shared = {
    className,
    "aria-current": active ? ("page" as const) : undefined,
    onClick: onNavigate,
  };

  if ("to" in item) {
    return (
      <Link to={item.to} {...shared}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} {...shared}>
      {item.label}
    </a>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="site-nav site-piece">
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          active={isCurrent(item, pathname)}
          className="site-nav-link"
        />
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
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Site navigation and quick links</SheetDescription>
        </SheetHeader>

        <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavItem
                  item={item}
                  active={isCurrent(item, pathname)}
                  onNavigate={() => setOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-2.5 text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                />
              </li>
            ))}
          </ul>
        </nav>

        <SheetFooter className="gap-3 border-t border-border">
          <div className="flex items-center justify-between">
            <ModeToggle />
            <div className="flex items-center gap-1">
              <SocialLinks />
            </div>
          </div>
          <SponsorButton className="w-full" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
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

        <DesktopNav pathname={pathname} />

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
