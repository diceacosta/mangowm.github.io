import { createFileRoute } from "@tanstack/react-router";
import { BrandPage } from "@/components/brand/brand-page";
import { ogPages } from "@/lib/og-pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/brand")({
  head: () => ({ meta: pageMeta(ogPages.brand) }),
  component: BrandPage,
});
