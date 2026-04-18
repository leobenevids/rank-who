import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type PixelBoxProps = HTMLAttributes<HTMLDivElement> & {
  accent?: boolean;
};

export function PixelBox({
  accent = false,
  className,
  ...props
}: PixelBoxProps) {
  return (
    <div
      className={cn("pbox", accent && "pbox-accent", className)}
      {...props}
    />
  );
}
