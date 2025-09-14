"use client";

import { Printer } from "lucide-react";
import clsx from "clsx";

type Props = {
  className?: string;
};

export default function PrintButton({ className }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={clsx(
        "inline-flex items-center justify-center rounded-md",
        "h-8 w-8 text-[--color-foreground-muted] hover:text-[--color-foreground]",
        "ring-1 ring-[--color-border-subtle] hover:ring-[--color-border]",
        "bg-[--color-surface] hover:bg-[--color-surface-2]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]",
        className
      )}
      aria-label="Drucken"
      title="Drucken"
    >
      <Printer className="h-4 w-4" aria-hidden />
    </button>
  );
}
