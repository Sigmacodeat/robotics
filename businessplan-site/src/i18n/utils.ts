import { BpTranslations } from './types'
import de from './locales/de'
import en from './locales/en'

type Locale = 'de' | 'en'

const registry: Record<Locale, BpTranslations> = {
  de,
  en,
}

export const useTranslations = (locale: Locale) => {
  const translations = registry[locale] ?? registry.de

  const t = (key: string, params?: Record<string, string>): any => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[i18n] key not found: ${key}`)
        }
        return key // Fallback
      }
    }

    if (params && typeof value === 'string') {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(new RegExp(`\\{${param}\\}`, 'g'), val),
        value
      )
    }

    return value
  }

  return { t }
}
