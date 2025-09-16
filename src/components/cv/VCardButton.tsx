"use client";

import { Contact2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  fullName: string;
  email: string;
  location?: string;
  className?: string;
};

export default function VCardButton({ fullName, email, location = "Wien, AT", className }: Props) {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${fullName};;;;`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `ADR;TYPE=HOME:;;${location};;;;`,
    "END:VCARD",
  ].join("\n");
  const href = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;

  return (
    <a
      href={href}
      download={`${fullName.replace(/\s+/g, "_")}.vcf`}
      className={clsx(
        "inline-flex items-center gap-1 rounded-md h-7 px-2 text-[10.5px] md:text-[11px]",
        "ring-1 ring-[--color-border-subtle] text-[--color-foreground-muted]",
        "bg-transparent hover:bg-[--muted]/40 hover:text-[--color-foreground]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]",
        className
      )}
      aria-label="Als Kontakt speichern"
      title="Als Kontakt speichern"
    >
      <Contact2 className="h-3.5 w-3.5" aria-hidden />
      <span>Kontakt</span>
    </a>
  );
}
