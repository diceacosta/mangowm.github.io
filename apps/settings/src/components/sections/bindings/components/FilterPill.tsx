import { cn } from "cn";

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: "sm" | "xs";
}

export function FilterPill({ label, active, onClick, size = "sm" }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md font-medium select-none",
        "transition-all duration-150",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
        size === "sm" && "h-7 px-2.5 text-[11px]",
        size === "xs" && "h-6 px-2 text-[10px] tracking-wide",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground/55 hover:bg-muted/70 hover:text-foreground",
      )}
    >
      {label}
      {label === "All" && active && (
        <span className="ml-1.5 inline-flex size-1 rounded-full bg-current opacity-60" />
      )}
    </button>
  );
}
