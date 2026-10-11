import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { defineDocs } from "fumadocs-mdx/macro";
import appleTouchIcon from "@mangowm/assets/favicons/apple-touch-icon.png";
import faviconIco from "@mangowm/assets/favicons/favicon.ico";
import faviconSvg from "@mangowm/assets/favicons/favicon.svg";
import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";

const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mode: "static",
  content: docs.toFumadocsSource(),
  renderPage: createDocsLayoutPage({
    renderPageActions: () => null,
  }),
  loaderOptions: {
    plugins: [lucideIconsPlugin()],
  },
  site: {
    name: "mangowm",
    baseUrl: "https://mangowm.github.io/docs",
    git: {
      user: "mangowm",
      repo: "mango",
      branch: "main",
    },
  },
  meta: {
    root() {
      return (
        <>
          <link rel="icon" href={faviconIco} sizes="32x32" />
          <link rel="icon" href={faviconSvg} type="image/svg+xml" />
          <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
          />
        </>
      );
    },
  },
  defaultLayoutProps: {
    nav: {
      title: (
        <>
          <img src={mangowmLogo} alt="" width={20} height={20} />
          mangowm
        </>
      ),
    },
  },
}).adapters(fumadocsMdx());
