"use client";

import { useState } from "react";

import { PixelBtn } from "@/shared/components/ui/pixel-btn";
import { PixelBox } from "@/shared/components/ui/pixel-box";

type RoomCodeChipProps = {
  code: string;
};

export function RoomCodeChip({ code }: RoomCodeChipProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PixelBox className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--blue)]">
          Room Code
        </span>
        <span className="text-2xl md:text-4xl">{code}</span>
      </div>

      <PixelBtn onClick={handleCopy} type="button" variant="secondary">
        {copied ? "Copied!" : "Copy"}
      </PixelBtn>
    </PixelBox>
  );
}
