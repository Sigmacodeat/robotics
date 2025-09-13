"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { Mail, Phone, Globe, MapPin, QrCode } from "lucide-react";

export default function ClosingPage() {
  const t = useTranslations("closingPage");
  const locale = useLocale();
  const format = useFormatter();
  const now = new Date();
  const dateStr = format.dateTime(now, { dateStyle: "long" });
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const activeLocale = locale || "de";
      setUrl(`${origin}/${activeLocale}`);
    }
  }, [locale]);

  return (
    <div
      className={[
        "closing-page",
        "hidden print:block",
        "rounded-2xl ring-1 ring-[--color-border-subtle] bg-[--color-surface] shadow-sm",
        "p-8 md:p-10 max-w-[210mm] mx-auto",
      ].join(" ")}
      role="contentinfo"
      aria-label={t("title", { default: "Kontakt & Nächste Schritte" })}
    >
      <header className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-[--color-foreground-strong]">
          {t("title", { default: "Kontakt & Nächste Schritte" })}
        </h2>
        <p className="text-[--color-foreground-muted]">
          {t("subtitle", { default: "Vielen Dank für Ihr Interesse – wir freuen uns auf das Gespräch." })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-2 text-[14px]">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[--color-foreground-muted]" />
            <a href="mailto:invest@sigmacode.ai" className="text-[--color-foreground]">invest@sigmacode.ai</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[--color-foreground-muted]" />
            <span className="text-[--color-foreground]">+43 660 1234567</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[--color-foreground-muted]" />
            <a href="https://sigmacode.ai" className="text-[--color-foreground]">sigmacode.ai</a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[--color-foreground-muted]" />
            <span className="text-[--color-foreground]">Wien, Österreich</span>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl ring-1 ring-[--color-border-subtle] bg-[--color-surface-2] p-4">
            <h3 className="text-sm font-medium text-[--color-foreground-strong] mb-1">{t("next.title", { default: "Vorschlag nächster Schritt" })}</h3>
            <ul className="m-0 p-0 list-none space-y-1.5 text-[13.5px] text-[--color-foreground]">
              <li>Intro‑Call (30–45min), Fokus: Fit / Ziele</li>
              <li>Deep‑Dive (60min): Produkt, Markt, Zahlen</li>
              <li>Option: Tech‑Demo und Pilot‑Scope</li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-[--color-border-subtle] bg-[--color-surface-2] p-4 flex items-center gap-3">
            <div className="shrink-0">
              {url ? (
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}`}
                  alt="QR"
                  width={120}
                  height={120}
                  unoptimized
                  className="h-[100px] w-[100px] rounded-md ring-1 ring-[--color-border-subtle]"
                />
              ) : (
                <QrCode className="h-20 w-20 text-[--color-foreground-muted]" />
              )}
            </div>
            <div>
              <p className="text-[13.5px] text-[--color-foreground] m-0">
                {t("qr.desc", { default: "Scannen Sie den QR, um die Live‑Version aufzurufen oder einen Termin zu vereinbaren." })}
              </p>
              <p className="text-[12px] text-[--color-foreground-muted] m-0 mt-1">{url}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-6 pt-4 border-t border-[--color-border-subtle] text-[12px] text-[--color-foreground-muted] grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <span>{t("prepared", { default: "Vorbereitet am" })} </span>
          <time suppressHydrationWarning dateTime={now.toISOString()}>{dateStr}</time>
        </div>
        <div className="md:text-right">
          <span>{t("legal", { default: "Vertraulich – ausschließlich für Evaluationszwecke bestimmt." })}</span>
        </div>
      </footer>

      {/* Abschluss: erzwungener Seitenumbruch, falls weitere Inhalte folgen */}
      <div className="page-break-after" />
    </div>
  );
}
