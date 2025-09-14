import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';

// Wir mocken next-intl/server und i18n/messages, um deterministische Inhalte zu haben
jest.mock('next-intl/server', () => {
  return {
    getLocale: async () => 'de',
    getTranslations: async () => ((key: string) => key) as any,
  };
});

// Hilfsfunktion, um dynamisch verschiedene Payloads für getMessages zu injizieren
let mockedMessages: any = {};
jest.mock('@/i18n/messages', () => ({
  getMessages: async () => mockedMessages,
}));

// Nach Mocks importieren
import MarketPage, { generateMetadata } from '@/app/chapters/market/page';

// Helper: rendere Seite mit gemockten Messages
async function renderWithMessages(bp: any) {
  // Vorherige Render bereinigen, um Duplikate in document.body zu vermeiden
  cleanup();
  mockedMessages = { bp };
  const tree = await (MarketPage as any)();
  render(tree as any);
}

describe('MarketAnalysisPage – Rendering & Logik', () => {
  afterEach(() => {
    cleanup();
    mockedMessages = {};
  });

  test('Unterkapitel-Nummerierung ist konsistent (Kapitel 3 – Einstiegsmärkte: 3.3.x)', async () => {
    await renderWithMessages({
      market: {
        volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '10%' },
        segments: [
          { label: 'SegA', share: 60 },
          { label: 'SegB', share: 40 },
        ],
      },
      marketCompetitive: {},
      swot: {},
      gtm: {},
    });
    // Kapitelindex für Market ist 3, Einstiegsmärkte ist drittes Unterkapitel => 3.3.1 u. 3.3.2
    expect(screen.getByText('3.3.1')).toBeInTheDocument();
    expect(screen.getByText('3.3.2')).toBeInTheDocument();
  });
  test('rendert KPI-Karten mit Fallbacks und EU‑Anteil aus bp.market.volume.eu', async () => {
    await renderWithMessages({
      market: {
        volume: {
          service: { global: '12 B', cagr: '15% (2024–2029)' },
          humanoid: { global: '1.2 B' },
          eu: '25 %',
          sources: ['https://example.com/service', 'https://example.com/humanoid'],
        },
        segments: [
          { name: 'Healthcare', share: 40 },
          { label: 'Hospitality', share: 35 },
          { label: 'Invalid no share' },
        ],
        details: ['Detail A', 'Detail B'],
      },
      marketCompetitive: {
        overview: ['Punkt 1', 'Punkt 2'],
        hardware: ['Tesla Bot', 'Boston Dynamics'],
        software: ['Figure AI', 'Agility'],
        differentiation: ['Appstore', 'RaaS'],
        overviewSources: ['https://ov.example.com'],
      },
      swot: { strengths: ['S1'], weaknesses: ['W1'], opportunities: ['O1'], threats: ['T1'] },
      gtm: { phase1: ['Phase 1 A', 'Phase 1 B'] },
    });

    // H1 vorhanden
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBeGreaterThan(0);

    // KPI-Karten greifen wir robust über Container-Klasse ab; EU ist Karte Nr. 4 (Index 3)
    const kpiContainers = document.querySelectorAll('.kpi-card--bm');
    expect(kpiContainers.length).toBeGreaterThanOrEqual(4);
    const euCard = kpiContainers[3] as HTMLElement;
    const euWithin = within(euCard);
    expect(euWithin.getByText(/25\s?%/)).toBeInTheDocument();
  });

  test('Sources werden als Links mit letztem Token als href gerendert', async () => {
    await renderWithMessages({
      market: {
        volume: {
          service: { global: '10 B', cagr: '10%' },
          humanoid: { global: '0.5 B' },
          eu: '7,5 %',
          // erster Source hat einen Titel + URL — die URL ist letztes Token
          sources: ['MarketsandMarkets https://mm.example.com/page', 'https://plain.example.com'],
        },
        segments: [{ label: 'Edu', share: 20 }],
        details: [],
      },
      marketCompetitive: { overview: [] },
      swot: {},
      gtm: {},
    });

    const links = screen.getAllByRole('link');
    const hrefs = links.map((a) => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['https://mm.example.com/page', 'https://plain.example.com']));
  });

  test('Segment-Normalisierung: akzeptiert {name,share} und {label,share}, filtert invalide', async () => {
    await renderWithMessages({
      market: {
        volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '10%' },
        segments: [
          { name: 'Alpha', share: 50 },
          { label: 'Beta', share: 30 },
          { label: 'Gamma' },
          { label: 123, share: 20 },
          { label: 'Delta', share: Number.NaN },
        ],
      },
      marketCompetitive: {},
      swot: {},
      gtm: {},
    });

    // Einstiegsmärkte-Section lokalisieren und innerhalb prüfen
    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Beta').length).toBeGreaterThan(0);
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
    expect(screen.queryByText('Delta')).not.toBeInTheDocument();
  });

  test('generateMetadata liefert canonical mit korrektem Kapitelindex (market)', async () => {
    // getLocale ist gemockt auf 'de'
    const meta = await generateMetadata();
    expect(meta.alternates?.canonical).toMatch(/\/chapters\/\d+$/);
  });

  test('EU-Parsing: "7,5 %" wird angezeigt', async () => {
    await renderWithMessages({
      market: { volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: 'z' }, eu: '7,5 %' } },
      marketCompetitive: {}, swot: {}, gtm: {},
    });
    const allCards1 = Array.from(document.querySelectorAll('.kpi-card--bm')) as HTMLElement[];
    const euCard1 = allCards1.find((el) => /EU\s*‑?Anteil/i.test(el.textContent || '')) as HTMLElement;
    expect(euCard1).toBeTruthy();
    expect(within(euCard1).getByText(/7,5\s?%/)).toBeInTheDocument();
  });

  test('EU-Parsing: invalider Wert -> EU-Card zeigt keinen konkreten Prozentwert', async () => {
    await renderWithMessages({
      market: { volume: { service: { global: 'x', cagr: 'y' }, humanoid: { global: '' }, eu: '' } },
      marketCompetitive: {}, swot: {}, gtm: {},
    });
    const allCards2 = Array.from(document.querySelectorAll('.kpi-card--bm')) as HTMLElement[];
    const euCard2 = allCards2.find((el) => /EU\s*‑?Anteil/i.test(el.textContent || '')) as HTMLElement;
    expect(euCard2).toBeTruthy();
    // Erwartung: Kein konkreter Prozentwert im Value, da invalides EU-Input => "–"
    expect(within(euCard2).queryByText(/\d+\s?%/)).not.toBeInTheDocument();
  });
});
