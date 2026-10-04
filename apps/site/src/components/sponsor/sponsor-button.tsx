import { AlertTriangle, Check, Copy, Heart, Image, Wallet } from "lucide-react";
import { cn } from "cn";
import { Button } from "@mangowm/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mangowm/ui/components/dialog";
import { toast } from "@mangowm/ui/components/toast";
import { SPONSOR } from "./sponsor-data";
import { useCopy, type CopyType } from "./use-copy";

export function SponsorButton({
  size,
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const { copied, copy } = useCopy();

  const handleCopy = async (type: CopyType) => {
    const message = await copy(type);
    toast.add({
      type: message.startsWith("Failed") ? "error" : "success",
      description: message,
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            aria-label="Sponsor mango"
            className={cn(
              "gap-[0.45rem] rounded-full border-border bg-card font-semibold hover:border-primary hover:bg-mango-soft hover:text-foreground",
              size === "lg" ? "h-11 px-6 text-[0.9375rem]" : "h-9 px-[0.9rem] text-[0.8125rem]",
              className,
            )}
          />
        }
      >
        <Heart className="size-4" />
        <span>Sponsor</span>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-auto rounded-[20px] border-border bg-card sm:max-w-2xl">
        <DialogHeader className="p-5 sm:px-6 sm:pt-6 sm:pb-2">
          <DialogTitle className="font-display text-xl font-bold tracking-[-0.02em] sm:text-[1.375rem]">
            Sponsor mango
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-md text-sm text-muted-foreground">
            Help sustain open-source development.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-2 sm:gap-8 sm:p-6">
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => handleCopy("qr")}
              aria-label="Copy QR code"
              className={cn(
                "group relative aspect-square w-full max-w-[140px] cursor-pointer overflow-hidden rounded-[14px] border border-border bg-background p-2 transition-colors hover:border-primary sm:max-w-[200px]",
                copied === "qr" && "border-success",
              )}
            >
              <img
                src={SPONSOR.qrSrc}
                alt="BEP20 QR code"
                className="h-full w-full rounded-[10px] object-contain"
              />
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center rounded-[14px] bg-background opacity-0 transition-opacity group-hover:opacity-100",
                  copied === "qr" && "opacity-100",
                )}
              >
                {copied === "qr" ? (
                  <Check className="size-8 text-primary" />
                ) : (
                  <>
                    <Image className="mb-1 size-6 text-foreground sm:mb-2 sm:size-8" />
                    <span className="text-xs font-semibold text-foreground">Copy</span>
                  </>
                )}
              </div>
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Tap to copy</p>
          </div>

          <div className="flex flex-col justify-center">
            <div>
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted-foreground">
                  <Wallet className="size-3.5" />
                  Wallet address
                </span>
                <span className="rounded-full border border-border bg-mango-soft px-2.5 py-0.5 text-[0.6875rem] font-bold text-primary-text">
                  {SPONSOR.network}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy("address")}
                aria-label="Copy wallet address"
                className={cn(
                  "mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted p-3 transition-[border-color,transform] hover:border-primary active:scale-[0.99]",
                  copied === "address" && "border-success",
                )}
              >
                <code
                  className="flex-1 font-mono text-xs font-medium break-all text-foreground"
                  title={SPONSOR.address}
                >
                  {SPONSOR.address}
                </code>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-foreground sm:size-8",
                    copied === "address" &&
                      "bg-success text-success-foreground hover:text-success-foreground",
                  )}
                >
                  {copied === "address" ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </span>
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-muted p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <div>
                <p className="text-[0.8125rem] font-semibold text-foreground">Verification</p>
                <p className="mt-0.5 text-[0.8125rem] leading-normal text-muted-foreground">
                  Only use the <span className="font-semibold text-foreground">BEP20</span> network.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted p-3.5 text-center sm:flex-col sm:justify-center">
          <p className="text-xs font-medium text-muted-foreground">Thanks for your support</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
