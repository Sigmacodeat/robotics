// Zentrale Typendefinitionen für i18n

export interface TranslationKey {
  [key: string]:
    | string
    | readonly string[]
    | number
    | boolean
    | TranslationKey
    | readonly TranslationKey[]
    | undefined
}

export interface BusinessModelContent extends TranslationKey {
  description: readonly string[]
  revenueStreams: ReadonlyArray<{
    type: string
    description: string
  }>
  pricing: readonly string[]
  valueProp: readonly string[]
  // Weitere spezifische Felder für das Geschäftsmodell
}

export interface MarketContent extends TranslationKey {
  title: string
  description: readonly string[]
  segments: ReadonlyArray<{
    name: string
    size: string
    growth: string
  }>
  // Weitere Markt-spezifische Felder
}

export interface ImpactContent extends TranslationKey {
  title: string
  description: readonly string[]
  // Weitere Impact-spezifische Felder
}

// Füge hier weitere Inhalts-Typen hinzu, falls benötigt

// Hinweis: Die Locale-TS-Dateien verwenden oft `as const` und erzeugen dadurch readonly-Arrays.
// Damit der Import kompatibel ist, halten wir BpTranslations absichtlich generisch.
export type BpTranslations = Record<string, unknown>;
