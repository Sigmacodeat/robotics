'use client';

import { useState } from 'react';
import { BusinessModelCard } from '@/components/examples/BusinessModelCard';

export default function I18nTestPage() {
  const [locale, setLocale] = useState<'de' | 'en'>('de');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">i18n Test Page</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setLocale('de')}
              className={`px-4 py-2 rounded ${locale === 'de' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Deutsch
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-4 py-2 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Business Model</h2>
            <BusinessModelCard locale={locale} />
          </div>

          {/* Add more test components here */}
        </div>
      </div>
    </div>
  );
}
