# i18n Migration Guide

## Overview
This guide explains how to update your components to use the new i18n structure.

## Before (Old Structure)
```typescript
// Old import style
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('bp.content.businessModel');
  return <div>{t('description.0')}</div>;
}
```

## After (New Structure)
```typescript
// New import style
import { useTranslations } from '@/i18n/utils';

function MyComponent() {
  const { t } = useTranslations('de'); // or 'en'
  
  // Type-safe access with autocomplete
  const description = t('businessModel.description.0');
  
  return <div>{description}</div>;
}
```

## Key Changes
1. Import `useTranslations` from `@/i18n/utils`
2. Destructure `t` from the hook
3. Use dot notation for nested properties
4. Get full TypeScript support and autocomplete

## Benefits
- Type safety for all translations
- Better code completion in IDEs
- Easier maintenance with centralized types
- Consistent structure across the application
