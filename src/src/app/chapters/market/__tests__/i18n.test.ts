import { fetchMarketI18n } from '../i18n';

jest.mock('next-intl/server', () => {
  return {
    getTranslations: jest.fn(),
  };
});

const { getTranslations } = jest.requireMock('next-intl/server') as {
  getTranslations: jest.Mock;
};

function mockGetTranslations(impl: (ns: string) => any) {
  (getTranslations as jest.Mock).mockImplementation(async (ns: string) => impl(ns));
}

describe('fetchMarketI18n', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('liefert korrekt typisierte Arrays im Happy Path (t.raw())', async () => {
    mockGetTranslations((ns) => {
      if (ns === 'bp') {
        return (key: string) => {
          if (key.startsWith('required.')) return `LBL_${key}`;
          if (key === 'sections.market') return 'Markt';
          return `BP_${key}`;
        };
      }
      if (ns === 'content') {
        const t: any = (key: string) => `S_${key}`;
        t.raw = (key: string) => {
          switch (key) {
            case 'market.segments':
              return [
                { label: 'Care & Health', share: 35 },
                { label: 'Hospitality', share: 25 },
              ];
            case 'marketCompetitive.overview':
              return ['Punkt 1', 'Punkt 2'];
            case 'market.details':
              return ['Detail 1', 'Detail 2'];
            case 'marketCompetitive.hardware':
              return ['HW 1'];
            case 'marketCompetitive.software':
              return ['SW 1'];
            case 'marketCompetitive.differentiation':
              return ['DIFF 1'];
            case 'swot.strengths':
              return ['S1'];
            case 'swot.weaknesses':
              return ['W1'];
            case 'swot.opportunities':
              return ['O1'];
            case 'swot.threats':
              return ['T1'];
            case 'gtm.phase1':
              return ['P1'];
            default:
              return undefined;
          }
        };
        return t;
      }
      throw new Error('unknown namespace');
    });

    const data = await fetchMarketI18n();
    expect(data.segments).toEqual([
      { label: 'Care & Health', share: 35 },
      { label: 'Hospitality', share: 25 },
    ]);
    expect(data.pestel).toEqual(['Punkt 1', 'Punkt 2']);
    expect(data.marketDetails).toEqual(['Detail 1', 'Detail 2']);
    expect(data.hardwarePlayers).toEqual(['HW 1']);
    expect(data.softwarePlayers).toEqual(['SW 1']);
    expect(data.diffPoints).toEqual(['DIFF 1']);
    expect(data.swotStrengths).toEqual(['S1']);
    expect(data.swotWeaknesses).toEqual(['W1']);
    expect(data.swotOpportunities).toEqual(['O1']);
    expect(data.swotThreats).toEqual(['T1']);
    expect(data.gtmPhase1).toEqual(['P1']);
    expect(typeof data.tam).toBe('string');
    expect(typeof data.sam).toBe('string');
    expect(typeof data.som).toBe('string');
    expect(data.tBpSectionMarket).toBe('Markt');
  });

  it('Fallbacks: fehlende Keys oder falsche Typen werden als leere Arrays gemappt', async () => {
    mockGetTranslations((ns) => {
      if (ns === 'bp') {
        return (key: string) => (key === 'sections.market' ? 'Markt' : `LBL_${key}`);
      }
      if (ns === 'content') {
        const t: any = (key: string) => {
          if (key === 'market.tam') return 'TAM-Text';
          if (key === 'market.sam') return 'SAM-Text';
          if (key === 'market.som') return 'SOM-Text';
          return `S_${key}`;
        };
        t.raw = (key: string) => {
          switch (key) {
            case 'market.segments':
              return undefined; // fehlt -> []
            case 'marketCompetitive.overview':
              return { wrong: 'type' }; // falscher typ -> []
            case 'market.details':
              return ['ok'];
            case 'marketCompetitive.hardware':
              return ['ok'];
            case 'marketCompetitive.software':
              return ['ok'];
            case 'marketCompetitive.differentiation':
              return ['ok'];
            case 'swot.strengths':
              return 'oops'; // falscher typ
            case 'swot.weaknesses':
              return ['ok'];
            case 'swot.opportunities':
              return ['ok'];
            case 'swot.threats':
              return ['ok'];
            case 'gtm.phase1':
              return []; // leer erlaubt
            default:
              return undefined;
          }
        };
        return t;
      }
      throw new Error('unknown namespace');
    });

    const data = await fetchMarketI18n();
    expect(data.segments).toEqual([]);
    expect(data.pestel).toEqual([]);
    expect(data.marketDetails).toEqual(['ok']);
    expect(data.swotStrengths).toEqual([]);
    expect(data.gtmPhase1).toEqual([]);
    // TAM/SAM/SOM weiterhin vorhanden
    expect(data.tam).toBe('TAM-Text');
    expect(data.sam).toBe('SAM-Text');
    expect(data.som).toBe('SOM-Text');
  });

  it('Segmenttyp-Validierung: only label:string & share:number zulässig', async () => {
    mockGetTranslations((ns) => {
      if (ns === 'bp') {
        return (key: string) => (key === 'sections.market' ? 'Markt' : `LBL_${key}`);
      }
      if (ns === 'content') {
        const t: any = (key: string) => `S_${key}`;
        t.raw = (key: string) => {
          switch (key) {
            case 'market.segments':
              return [{ label: 'X' }, { label: 'Y', share: 'x' }]; // invalid -> []
            default:
              return undefined;
          }
        };
        return t;
      }
      throw new Error('unknown namespace');
    });

    const data = await fetchMarketI18n();
    expect(data.segments).toEqual([]);
  });
});
