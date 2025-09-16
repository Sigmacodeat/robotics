const config = {
  locales: ['de', 'en'] as const,
  defaultLocale: 'de' as const,
  // Default locale ohne Prefix, andere mit Prefix
  localePrefix: 'as-needed' as const,
  // Globale Zeitzone für konsistentes Markup zwischen Server & Client
  timeZone: 'Europe/Berlin' as const
};

export default config;
