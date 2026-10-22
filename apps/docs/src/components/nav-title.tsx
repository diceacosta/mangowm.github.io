"use client";

import mangowmLogo from "@mangowm/assets/logos/mangowm.svg";

export function NavTitle({ className }: { className?: string }) {
  return (
    <a href="/" className={className}>
      <img src={mangowmLogo} alt="" width={20} height={20} />
      mangowm
    </a>
  );
}
