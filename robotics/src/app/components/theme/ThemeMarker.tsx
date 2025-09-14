"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * ThemeMarker
 * Spiegelt das aktive Theme (light/dark) in html[data-theme] wider.
 * Dadurch sind E2E-Tests unabhängig von Klassen-Implementierungen.
 */
export default function ThemeMarker() {
  const { theme, resolvedTheme, systemTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const current = (resolvedTheme || theme || systemTheme || "light") as string;
    try {
      root.setAttribute("data-theme", current);
    } catch {
      // noop
    }
  }, [theme, resolvedTheme, systemTheme]);

  return null;
}
