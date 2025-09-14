"use client";

import {NextIntlClientProvider} from "next-intl";
import React from "react";

export type I18nProviderProps = {
  messages: Record<string, unknown>;
  locale: string;
  timeZone?: string;
  children: React.ReactNode;
};

export default function I18nProvider({messages, locale, timeZone, children}: I18nProviderProps) {
  const providerProps = {
    messages,
    locale,
    onError: (error: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[i18n]", error);
      }
    },
    // Vermeidet sichtbare Key-Ausgabe wie "nav.brand" während Hydration
    getMessageFallback: () => ""
  } as const;

  return (
    // timeZone nur anfügen, wenn definiert, um Typkonflikte zu vermeiden
    <NextIntlClientProvider {...(timeZone ? { ...providerProps, timeZone } : providerProps)}>
      {children}
    </NextIntlClientProvider>
  );
}
