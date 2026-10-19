import { createFileRoute } from "@tanstack/react-router";
import { ShowcasePage } from "@/components/showcase/showcase-page";
import { ogPages } from "@/lib/og-pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/showcase")({
  head: () => ({ meta: pageMeta(ogPages.showcase) }),
  component: ShowcasePage,
});
