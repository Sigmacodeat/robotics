import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
  getLocale: async () => 'de',
  getTranslations: async () => ((key: string) => key) as any,
}));

// Mock messages
let mockedMessages: any = {};
jest.mock('@/i18n/messages', () => ({ getMessages: async () => mockedMessages }));

import MarketPage from '@/chapters/market/page';

async function renderWithMessages(bp: any) {
  mockedMessages = { bp };
  const tree = await (MarketPage as any)();
  render(tree as any);
}

describe('MarketAnalysisPage – parseToBillion (indirekt über Text-Outputs)', () => {
  test('"900 Mio" -> 0,9 Mrd. in SAM (Service)', async () => {
    await renderWithMessages({
      market: {
        volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '10%' },
        size: { service: { sam: '900 Mio' } },
      },
    });
    // SAM-Text sollte "Service: 0,9 Mrd." enthalten
    expect(screen.getByText(/Service:\s*0,9\s*Mrd\./)).toBeInTheDocument();
  });

  test('"~15B" -> 15 Mrd. in SAM (Humanoid)', async () => {
    await renderWithMessages({
      market: {
        volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '10%' },
        size: { humanoid: { sam: '~15B' } },
      },
    });
    expect(screen.getByText(/Humanoid:\s*15\s*Mrd\./)).toBeInTheDocument();
  });

  test('"30" (ohne Einheit) -> 30 Mrd. in SOM (Service)', async () => {
    await renderWithMessages({
      market: {
        volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '10%' },
        size: { service: { som: '30' } },
      },
    });
    expect(screen.getByText(/Service:\s*30\s*Mrd\./)).toBeInTheDocument();
  });
});
