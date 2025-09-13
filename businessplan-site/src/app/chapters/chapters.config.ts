export type Subchapter = { id: string; title: string };
export type Chapter = {
  id: number;
  slug: string;
  title: string;
  titleKey: string;
  requiredFields: string[];
  subchapters?: Subchapter[];
};

export const chapters: Chapter[] = [
  // High-end investor & FFG/aws friendly order
  { id: 1, slug: 'executive', title: 'Executive Summary', titleKey: 'executive', requiredFields: ['problem','solution','market','businessModel','usps'], subchapters: [
    { id: 'executive', title: 'Überblick' },
    { id: 'company', title: 'Unternehmen' },
    { id: 'teamOrg', title: 'Team & Organisation' },
  ] },
  { id: 2, slug: 'business-model', title: 'Business Model', titleKey: 'businessModel', requiredFields: ['valueProp','pricing','revenue','unitEconomics','sales','partnerships'], subchapters: [
    { id: 'businessModel', title: 'Geschäftsmodell' },
    { id: 'kpis', title: 'KPIs' }
  ] },
  { id: 3, slug: 'market', title: 'Market', titleKey: 'market', requiredFields: ['size','target','competition','trends'], subchapters: [
    { id: 'market', title: 'Markt' },
    { id: 'market-details', title: 'Wettbewerb' }
  ] },
  { id: 4, slug: 'gtm', title: 'Go-to-Market', titleKey: 'gtm', requiredFields: ['phases','tactics','kpis'] },
  { id: 5, slug: 'finance', title: 'Finance', titleKey: 'finance', requiredFields: ['capital','funding','roi','forecast'] },
  { id: 6, slug: 'technology', title: 'Technology', titleKey: 'technology', requiredFields: ['architecture','robotics','innovation','ip'], subchapters: [
    { id: 'technology', title: 'Technologie' },
    { id: 'state-of-the-art', title: 'Stand der Technik' }
  ] },
  { id: 7, slug: 'team', title: 'Team', titleKey: 'team', requiredFields: ['org','hiring','roles','esop'] },
  { id: 8, slug: 'risks', title: 'Risks', titleKey: 'risks', requiredFields: ['tech-risk','market-risk','finance-risk','mitigation'], subchapters: [
    { id: 'tech-risk', title: 'Technologie' },
    { id: 'market-risk', title: 'Markt' },
    { id: 'finance-risk', title: 'Finanzen' },
    { id: 'regulatory', title: 'Regulatorik' },
    { id: 'operations', title: 'Betrieb' },
    { id: 'mitigation', title: 'Mitigation' },
  ] },
  { id: 9, slug: 'traction-kpis', title: 'Traction / KPIs', titleKey: 'tractionKpis', requiredFields: ['traction','kpis'] },
  { id: 10, slug: 'impact', title: 'Impact', titleKey: 'impact', requiredFields: [] },
  { id: 11, slug: 'exit-strategy', title: 'Exit', titleKey: 'exit', requiredFields: [] },
];

export const totalChapters = chapters.length;
