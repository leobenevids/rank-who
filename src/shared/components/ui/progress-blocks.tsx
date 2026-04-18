import { cn } from "@/shared/lib/utils";

type ProgressBlocksProps = {
  value: number;
  total: number;
  className?: string;
};

export function ProgressBlocks({
  value,
  total,
  className,
}: ProgressBlocksProps) {
  const safeTotal = Math.max(total, 1);
  const safeValue = Math.min(Math.max(value, 0), safeTotal);

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      aria-label={`Progress ${safeValue} of ${safeTotal}`}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const active = index < safeValue;

        return (
          <span
            key={`${safeTotal}-${index}`}
            className={cn("progress-block", active && "progress-block-active")}
          />
        );
      })}
    </div>
  );
}
