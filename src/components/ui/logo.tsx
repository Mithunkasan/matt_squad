'use client';

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  // We check if a logo image exists (can look for /logo.png or similar).
  // For now, we provide a beautiful custom fallback using SVGs and gradient text.
  // When they place logo.png or logo.svg in public/, it can easily load it.
  const [useImage, setUseImage] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState("/logo.png");

  React.useEffect(() => {
    // Check if a logo is present in public/ logo.png or logo.svg
    // Since Next.js public files are served at the root, we check if /logo.png can be fetched
    fetch("/logo.png", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setUseImage(true);
          setImageSrc("/logo.png");
        } else {
          return fetch("/logo.svg", { method: "HEAD" });
        }
      })
      .then((res) => {
        if (res && res.ok) {
          setUseImage(true);
          setImageSrc("/logo.svg");
        }
      })
      .catch(() => {});
  }, []);

  if (useImage) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Image
          src={imageSrc}
          alt="MATT SQUAD Logo"
          width={iconOnly ? 40 : 180}
          height={40}
          className="object-contain h-10 w-auto"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Premium SVG Icon Fallback */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#73a0c8] to-[#9fc2e0] p-[1.5px] shadow-sm shadow-[#73a0c8]/20">
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-white"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      
      {!iconOnly && (
        <span className="font-heading text-xl font-bold tracking-tight text-slate-800">
          MATT <span className="bg-gradient-to-r from-[#73a0c8] to-[#5a8bb5] bg-clip-text text-transparent">SQUAD</span>
        </span>
      )}
    </div>
  );
};
