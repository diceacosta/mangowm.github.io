import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { defineDocs } from "fumadocs-mdx/macro";

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
}).adapters(fumadocsMdx());
