type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[--color-surface-2] ring-1 ring-[--color-border-subtle]/50 ${className || ''}`}
    />
  );
}
