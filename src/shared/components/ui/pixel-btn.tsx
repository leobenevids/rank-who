import type { ButtonHTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const pixelBtnVariants = cva("pbtn", {
  variants: {
    variant: {
      primary: "pbtn-primary",
      secondary: "pbtn-secondary",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    fullWidth: false,
  },
});

type PixelBtnProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof pixelBtnVariants> & {
    loading?: boolean;
  };

export function PixelBtn({
  className,
  children,
  disabled,
  loading = false,
  variant,
  fullWidth,
  ...props
}: PixelBtnProps) {
  return (
    <button
      className={cn(pixelBtnVariants({ variant, fullWidth }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
}
