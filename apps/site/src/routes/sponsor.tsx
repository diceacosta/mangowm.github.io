import { createFileRoute } from "@tanstack/react-router";
import { SponsorPage } from "@/components/sponsor/sponsor-page";
import { ogPages } from "@/lib/og-pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/sponsor")({
  head: () => ({ meta: pageMeta(ogPages.sponsor) }),
  component: SponsorPage,
});
