import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home";
import { ogPages } from "@/lib/og-pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta(ogPages.home) }),
  component: HomePage,
});
