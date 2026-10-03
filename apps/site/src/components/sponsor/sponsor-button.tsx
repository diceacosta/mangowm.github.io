import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "cn";
import { AlertTriangleSvg, CheckSvg, CopySvg, HeartSvg, ImageSvg, WalletSvg, XSvg } from "../icons";
import { Toaster } from "../toaster";
import { SPONSOR } from "./sponsor-data";
import { useCopy, type CopyType } from "./use-copy";

const MESSAGE_DURATION = 2000;

export function SponsorButton({
  size,
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const { copied, copy } = useCopy();
  const [message, setMessage] = useState<string | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), MESSAGE_DURATION);
  };

  const handleCopy = async (type: CopyType) => {
    showMessage(await copy(type));
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger
          aria-label="Sponsor mango"
          className={cn("sponsor-btn", size === "lg" && "sponsor-btn-lg", className)}
        >
          <HeartSvg className="sponsor-btn-icon" />
          <span>Sponsor</span>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup className="modal-content">
            <Dialog.Close className="modal-close" aria-label="Close">
              <XSvg className="w-5 h-5" />
            </Dialog.Close>

            <div className="modal-header">
              <Dialog.Title className="modal-title">Sponsor mango</Dialog.Title>
              <Dialog.Description className="modal-subtitle">
                Help sustain open-source development.
              </Dialog.Description>
            </div>

            <div className="modal-body">
              <div className="modal-qr-col">
                <button
                  type="button"
                  onClick={() => handleCopy("qr")}
                  aria-label="Copy QR code"
                  className={cn("modal-qr-btn", copied === "qr" && "modal-qr-btn-copied")}
                >
                  <img src={SPONSOR.qrSrc} alt="BEP20 QR code" className="modal-qr-img" />
                  <div className="modal-qr-overlay">
                    {copied === "qr" ? (
                      <CheckSvg className="modal-qr-check" />
                    ) : (
                      <>
                        <ImageSvg className="modal-qr-overlay-icon" />
                        <span className="modal-qr-overlay-text">Copy</span>
                      </>
                    )}
                  </div>
                </button>
                <p className="modal-qr-hint">Tap to copy</p>
              </div>

              <div className="modal-address-col">
                <div>
                  <div className="modal-address-header">
                    <span className="modal-address-label">
                      <WalletSvg className="w-3.5 h-3.5" />
                      Wallet address
                    </span>
                    <span className="modal-network-badge">{SPONSOR.network}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy("address")}
                    aria-label="Copy wallet address"
                    className={cn(
                      "modal-address-box",
                      copied === "address" && "modal-address-box-copied",
                    )}
                  >
                    <code className="modal-address-code" title={SPONSOR.address}>
                      {SPONSOR.address}
                    </code>
                    <span
                      className={cn(
                        "modal-copy-btn",
                        copied === "address" && "modal-copy-btn-copied",
                      )}
                    >
                      {copied === "address" ? (
                        <CheckSvg className="w-3.5 h-3.5" />
                      ) : (
                        <CopySvg className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="modal-warning">
                  <AlertTriangleSvg className="modal-warning-icon" />
                  <div>
                    <p className="modal-warning-title">Verification</p>
                    <p className="modal-warning-text">
                      Only use the <span className="modal-warning-code">BEP20</span> network.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <p className="modal-footer-text">Thanks for your support</p>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Toaster message={message} />
    </>
  );
}
