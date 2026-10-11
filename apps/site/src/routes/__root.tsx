import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "@mangowm/ui/components/toast";
import appleTouchIcon from "@mangowm/assets/favicons/apple-touch-icon.png";
import faviconIco from "@mangowm/assets/favicons/favicon.ico";
import faviconSvg from "@mangowm/assets/favicons/favicon.svg";
import appCss from "../App.css?url";
import { Header } from "../components/header";
import { ThemeProvider } from "../components/theme-provider";
import { siteConfig } from "../constants";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", href: faviconIco, sizes: "32x32" },
      { rel: "icon", type: "image/svg+xml", href: faviconSvg },
      { rel: "apple-touch-icon", sizes: "180x180", href: appleTouchIcon },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Geist:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Header />
          <main id="main-content">
            <Outlet />
          </main>
        </ThemeProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
