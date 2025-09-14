import React from 'react';
import { useTranslations } from '@/i18n/utils';

interface BusinessModelCardProps {
  locale: 'de' | 'en';
}

export function BusinessModelCard({ locale }: BusinessModelCardProps) {
  const { t } = useTranslations(locale);

  // Type-safe access to translations
  const businessModel = t('businessModel');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {businessModel.title || 'Business Model'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Value Proposition</h3>
          <ul className="list-none pl-0 space-y-1">
            {businessModel.valueProp?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Revenue Streams</h3>
          <div className="space-y-3">
            {businessModel.revenueStreams?.map((stream: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-blue-600">{stream.type}</h4>
                <p className="text-sm text-gray-600">{stream.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
