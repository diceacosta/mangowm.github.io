import { createFileRoute } from "@tanstack/react-router";
import { BrandPage } from "../components/brand/brand-page";

export const Route = createFileRoute("/brand")({
  component: BrandPage,
});
