import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type PixelInputProps = InputHTMLAttributes<HTMLInputElement>;

export function PixelInput({ className, ...props }: PixelInputProps) {
  return <input className={cn("pinput", className)} {...props} />;
}
