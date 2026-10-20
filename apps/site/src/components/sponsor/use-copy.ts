import { useEffect, useRef, useState } from "react";
import { SPONSOR } from "./sponsor-data";

export type CopyType = "address" | "qr";

const RESET_DELAY = 2000;

function downloadQr(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sponsor-qr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useCopy() {
  const [copied, setCopied] = useState<CopyType | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const markCopied = (type: CopyType) => {
    setCopied(type);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(null), RESET_DELAY);
  };

  const copy = async (type: CopyType) => {
    if (type === "address") {
      await navigator.clipboard.writeText(SPONSOR.address);
    } else {
      const response = await fetch(SPONSOR.qrSrc);
      if (!response.ok) throw new Error("Failed to fetch QR code");
      const blob = await response.blob();

      if (typeof ClipboardItem === "undefined") {
        downloadQr(blob);
      } else {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      }
    }

    markCopied(type);
  };

  return { copied, copy };
}
