"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  label?: string;
  successLabel?: string;
  ariaLabel?: string;
};

export default function CopyButton({ text, className, label = "Kopieren", successLabel = "Kopiert", ariaLabel }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={clsx(
        "inline-flex items-center gap-1 rounded-md h-7 px-2 text-[10.5px] md:text-[11px]",
        "ring-1 ring-[--color-border-subtle] text-[--color-foreground-muted]",
        "bg-transparent hover:bg-[--muted]/40 hover:text-[--color-foreground]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]",
        className
      )}
      aria-label={ariaLabel ?? label}
      title={ariaLabel ?? label}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
