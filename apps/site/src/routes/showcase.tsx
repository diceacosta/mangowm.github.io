import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/showcase")({
  component: ShowcasePage,
});

function ShowcasePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center">
      <h1 className="mb-3 text-3xl font-semibold tracking-tight">Showcase</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
