import { cn } from "cn";

/**
 * Persistent live region that announces transient messages to assistive tech.
 * Kept in the DOM (only faded out) so updates are reliably announced.
 */
export function Toaster({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "toast transition-opacity duration-200",
        message ? "toast-visible opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {message}
    </div>
  );
}
