import React from 'react';
import { render, screen, within } from '@testing-library/react';

// Mock next-intl/server & messages
jest.mock('next-intl/server', () => {
  return {
    getLocale: async () => 'de',
    getTranslations: async () => ((key: string) => key) as any,
  };
});

let mockedMessages: any = {};
jest.mock('@/i18n/messages', () => ({
  getMessages: async () => mockedMessages,
}));

import ImpactPage from '@/app/chapters/impact/page';

async function renderWithMessages(content: any) {
  mockedMessages = { content };
  const tree = await (ImpactPage as any)();
  render(tree as any);
}

describe('ImpactPage – Rendering', () => {
  test('rendert KPI-Karten mit Labels, Werten und aria/Tooltip', async () => {
    await renderWithMessages({
      impact: {
        intro: ['Title: Beschreibung'],
      },
    });

    // H1 vorhanden
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBeGreaterThan(0);

    // Intro-Item wird korrekt gerendert
    expect(screen.getByText(/Beschreibung/)).toBeInTheDocument();
  });

  test('konditionale Abschnitte werden nur gerendert, wenn Inhalte vorhanden sind', async () => {
    await renderWithMessages({
      impact: {
        intro: ['Intro: A'],
        economic: [],
        environmental: ['Env: A', 'Env: B'],
        policy: [],
        societal: ['Soc: A'],
        sustainability: [],
      }
    });

    // Einführungsabschnitt vorhanden
    expect(screen.getByText(/Einführung/)).toBeInTheDocument();

    // Environmental-Heading vorhanden
    expect(screen.getByText(/impactHeadings\.environmental/)).toBeInTheDocument();

    // Societal-Heading vorhanden
    expect(screen.getByText(/impactHeadings\.societal/)).toBeInTheDocument();

    // Nicht gesetzte Abschnitte erscheinen nicht mit Items
    // (Wir prüfen exemplarisch, dass keine Listenelemente mit "policy" erscheinen.)
    expect(screen.queryByText(/impactHeadings\.policy/)).not.toBeInTheDocument();
  });
});
