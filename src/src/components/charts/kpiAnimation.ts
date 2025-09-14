// Zentralisierte KPI-Animations- und Größenkonstanten für Mini-Charts und CountUp
// Einheitliche, veredelte Animationen mit 50%-Überlappung (links → rechts)

export const KPI_ANIM_DURATION = 3.0;            // Sekunden, einheitlich für MiniBar/MiniSparkline/MiniDonut
export const KPI_ANIM_OVERLAP = 0.5;             // 50% Überlappung: nächstes Element startet bei 50% Progress des vorherigen
export const KPI_ANIM_BASE_DELAY = 0.12;         // Sekunden, Grundverzögerung vor dem ersten Element

export function getKpiDelay(index: number, baseDelay = KPI_ANIM_BASE_DELAY, duration = KPI_ANIM_DURATION, overlap = KPI_ANIM_OVERLAP) {
  return baseDelay + index * (duration * overlap);
}

// Einheitliche Größen (visuell abgestimmt mit Typografie-Clamps in globals.css)
export const KPI_BAR_HEIGHT = 16;    // px
export const KPI_SPARK_HEIGHT = 16;  // px
export const KPI_DONUT_CLASS = 'h-5';

// CountUp – einheitliche Dauer und Delay-Stagger analog Charts (in Millisekunden)
export const COUNTUP_DURATION_MS = 1200;
export function getCountUpDelayMs(index: number, durationMs = COUNTUP_DURATION_MS, overlap = KPI_ANIM_OVERLAP) {
  return Math.round(index * (durationMs * overlap));
}
