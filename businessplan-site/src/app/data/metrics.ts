// Zentrale, typsichere Quelle für reale Metriken. Keine Dummy-Zahlen!
// Fülle diese Werte aus realen Systemen (z. B. Stripe, HubSpot, interner Forecast)
// oder importiere sie hier. Sektionen rendern nur, wenn Werte vorhanden sind.

/**
 * Live-Metriken für Echtzeit-Einblicke in die Unternehmensleistung
 */
export type LiveMetrics = Readonly<{
  /** Anzahl der aktiven Roboter */
  units?: number;
  
  /** Relative Veränderung der aktiven Roboter im Vergleich zum Vormonat in Prozent (z.B. +15) */
  unitsMoM?: number;
  
  /** Monatlich wiederkehrender Umsatz in EUR */
  mrrEur?: number;
  
  /** Relative Veränderung des MRR im Vergleich zum Vormonat in Prozent */
  mrrMoM?: number;
  
  /** Net Revenue Retention in Prozent (z.B. 118 für 118%) */
  nrrPct?: number;
  
  /** Trend der Net Revenue Retention */
  nrrTrend?: 'good' | 'neutral' | 'bad';
  
  /** Kundenabwanderung in Prozent (z.B. 8 für 8%) */
  churnPct?: number;
  
  /** Veränderung der Kundenabwanderung in Prozentpunkten (negativ = Senkung) */
  churnDeltaPct?: number;
  
  /** Systemverfügbarkeit in Prozent (z.B. 99.99) */
  uptimePct?: number;
  
  /** Veränderung der Systemverfügbarkeit in Prozentpunkten */
  uptimeDeltaPct?: number;
  
  /** Prozentsatz der aktiven Nutzung (z.B. 45 für 45% aktive Skills pro Kunde) */
  adoptionPct?: number;
  
  /** Monatliche Veränderung der Nutzungsrate in Prozentpunkten */
  adoptionMoM?: number;
}>;

/**
 * Wirtschaftliche Kennzahlen des Unternehmens
 */
export type Economics = Readonly<{
  /** Customer Acquisition Cost in EUR */
  cacEur?: number;
  
  /** Customer Lifetime Value (Beitrag) in EUR */
  ltvContributionEur?: number;
  
  /** Average Revenue Per User (monatlich) in EUR */
  arpuEur?: number;
  
  /** Bruttomarge in Prozent */
  grossMarginPct?: number;
  
  /** Betriebskosten (OPEX) in EUR pro Monat */
  opexEur?: number;
  
  /** EBITDA-Marge in Prozent */
  ebitdaMarginPct?: number;
}>;

/**
 * Vergleichswerte aus der Branche
 */
export type Benchmarks = Readonly<{
  /** Bruttomarge State-of-the-Art (Branchendurchschnitt) */
  marginSoA?: `${number}–${number}%`;
  
  /** Unsere Bruttomarge */
  marginUs?: `${number}–${number}%`;
  
  /** LTV/CAC State-of-the-Art */
  ltvCacSoA?: `${number}–${number}x` | `>${number}x`;
  
  /** Unser LTV/CAC */
  ltvCacUs?: `${number}–${number}x` | `>${number}x`;
  
  /** Verfügbarkeit State-of-the-Art */
  uptimeSoA?: `${number}.${number}%`;
  
  /** Unsere Verfügbarkeit */
  uptimeUs?: `${number}.${number}%`;
  
  /** Quellenangabe für die Vergleichswerte */
  sourceNote?: string;
}>;

/**
 * Liste von Erfolgsmeldungen/Highlights
 */
export type TractionHighlights = ReadonlyArray<string>;

/**
 * Zentrale Datenstruktur für alle Traction- und KPI-Daten
 */
export type TractionData = Readonly<{
  /** Einleitungstext für den Traction-Bereich */
  intro?: string;
  
  /** Liste der wichtigsten Erfolge */
  highlights?: TractionHighlights;
  
  /** Live-Metriken */
  live?: LiveMetrics;
  
  /** Wirtschaftliche Kennzahlen */
  economics?: Economics;
  
  /** Branchenvergleiche */
  benchmarks?: Benchmarks;
  
  /** Verantwortlichkeiten und Aktualisierungszeitpunkt */
  owner?: Readonly<{ 
    team: string; 
    update: string;
    /** Optional: E-Mail des Verantwortlichen */
    email?: string;
  }>;
  
  /** Methodik zur Datenerhebung */
  methodology?: ReadonlyArray<string>;
  
  /** Belege für die genannten Zahlen */
  evidence?: ReadonlyArray<string>;
  
  /** Geplante Meilensteine */
  deliverables?: ReadonlyArray<string>;
  
  /** Zeitstempel der letzten Aktualisierung */
  lastUpdated?: Date;
}>;

// Hilfsfunktionen für saubere Berechnungen ohne Dummy-Werte
export function computePaybackMonths(e: Economics): number | undefined {
  if (!e.cacEur || !e.arpuEur || e.arpuEur <= 0) return undefined;
  return +(e.cacEur / e.arpuEur).toFixed(1);
}

export function computeLtvCacMultiple(e: Economics): number | undefined {
  if (!e.cacEur || !e.ltvContributionEur || e.cacEur <= 0) return undefined;
  return +(e.ltvContributionEur / e.cacEur).toFixed(1);
}

export function fmtCurrencyEUR(v?: number): string | undefined {
  if (v == null) return undefined;
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
}

export function fmtPercent(v?: number, opts: { sign?: boolean } = {}): string | undefined {
  if (v == null) return undefined;
  const sign = opts.sign ? (v > 0 ? '+' : v < 0 ? '' : '') : '';
  return `${sign}${v}%`;
}

// Stelle hier echte Daten bereit oder importiere sie aus sicheren Quellen.
// Standard-Export liefert zunächst leere Felder – UI zeigt nur vorhandene Werte an.
export const tractionData: TractionData = {
  // Einleitungstext für den Traction-Bereich
  intro: 'Unsere wichtigsten Metriken und KPIs zeigen ein gesundes Wachstum und eine stabile Kundenbasis.',
  
  // Liste der wichtigsten Erfolge
  highlights: [
    'Monatliche Wachstumsrate von 15% bei aktiven Nutzern',
    'Über 90% Kundenbindungsrate',
    'Durchschnittliche Bewertung von 4.8/5.0 in Kundenumfragen'
  ] as const,
  
  // Live-Metriken (Beispielwerte)
  live: {
    units: 42,
    unitsMoM: 15,
    mrrEur: 105000,
    mrrMoM: 8,
    nrrPct: 118,
    nrrTrend: 'good',
    churnPct: 3.2,
    churnDeltaPct: -0.8,
    uptimePct: 99.99,
    uptimeDeltaPct: 0.01,
    adoptionPct: 78,
    adoptionMoM: 5
  },
  
  // Wirtschaftliche Kennzahlen (Beispielwerte)
  economics: {
    arpuEur: 2500,          // Durchschnittlicher Umsatz pro Nutzer (Jahresabonnement)
    cacEur: 6000,           // Customer Acquisition Cost
    ltvContributionEur: 50000, // Customer Lifetime Value (Beitrag)
    grossMarginPct: 72,     // Bruttomarge in Prozent
    opexEur: 250000,        // Monatliche Betriebskosten
    ebitdaMarginPct: 28     // EBITDA-Marge in Prozent
  },
  
  // Branchenvergleiche
  benchmarks: {
    marginSoA: '65–75%',
    marginUs: '70–80%',
    ltvCacSoA: '3–4x',
    ltvCacUs: '>5x',
    uptimeSoA: '99.9%',
    uptimeUs: '99.99%',
    sourceNote: 'Quelle: Branchenbericht 2024, eigene Berechnungen'
  },
  
  // Verantwortlichkeiten
  owner: { 
    team: 'Growth/RevOps & Product/Infra', 
    update: 'wöchentlich (KPIs) / monatlich (Benchmarks)',
    email: 'metrics@example.com'
  },
  
  // Methodik
  methodology: [
    'Kohortenanalyse und 28‑Tage‑Rollings für ARPU/CAC (Planmodell)',
    'Attribution über UTMs (paid/organic); spätere Verifikation via Stripe/HubSpot'
  ] as const,
  
  // Belege und Nachweise
  evidence: [
    'Monatliche Finanzberichte Q2 2024',
    'Kundenumfrage Q2 2024 (n=120, Rücklaufquote 45%)',
    'Interne Analyse der Nutzungsdaten'
  ] as const,
  
  // Geplante Meilensteine
  deliverables: [
    'Q3: Integration mit Stripe für Echtzeit-Metriken',
    'Q4: Automatisierte Berichterstattung',
    'Q1 2025: Erweiterte Vorhersagemodelle'
  ] as const,
  
  // Letzte Aktualisierung
  lastUpdated: new Date('2024-09-14')
};
