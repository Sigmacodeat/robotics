export type ChapterTheme = {
  name: string;
  // Primärfarbe für Charts/Highlights
  primary: string;
  // Akzentfarben für Badges/Cards
  success: string;
  warning: string;
  info: string;
  neutral: string;
  accent1: string;
  accent2: string;
};

const THEMES: Record<string, ChapterTheme> = {
  // 1 – Executive
  'executive': {
    name: 'Executive',
    primary: '#0ea5e9', // sky-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    info: '#38bdf8', // sky-400
    neutral: '#64748b', // slate-500
    accent1: '#22d3ee', // cyan-400
    accent2: '#818cf8', // indigo-400
  },
  // 2 – Business Model
  'business-model': {
    name: 'Business Model',
    primary: '#3b82f6', // blue-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    info: '#06b6d4', // cyan-500
    neutral: '#64748b', // slate-500
    accent1: '#8b5cf6', // violet-500
    accent2: '#14b8a6', // teal-500
  },
  // 3 – Market
  'market': {
    name: 'Market',
    primary: '#22c55e', // green-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#0ea5e9',
    neutral: '#64748b',
    accent1: '#84cc16', // lime-500
    accent2: '#06b6d4', // cyan-500
  },
  // 4 – Go-to-Market
  'gtm': {
    name: 'Go-to-Market',
    primary: '#0ea5e9', // sky-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#38bdf8',
    neutral: '#64748b',
    accent1: '#22d3ee',
    accent2: '#3b82f6',
  },
  // 5 – Finance
  'finance': {
    name: 'Finance',
    primary: '#f59e0b', // amber-500
    success: '#10b981',
    warning: '#ef4444', // red-500
    info: '#06b6d4',
    neutral: '#64748b',
    accent1: '#3b82f6',
    accent2: '#8b5cf6',
  },
  // 6 – Technology
  'technology': {
    name: 'Technology',
    primary: '#8b5cf6', // violet-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#06b6d4',
    neutral: '#64748b',
    accent1: '#22c55e',
    accent2: '#0ea5e9',
  },
  // 7 – Team
  'team': {
    name: 'Team',
    primary: '#f43f5e', // rose-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#0ea5e9',
    neutral: '#64748b',
    accent1: '#3b82f6',
    accent2: '#a78bfa',
  },
  // 8 – Risks
  'risks': {
    name: 'Risks',
    primary: '#ef4444', // red-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#06b6d4',
    neutral: '#64748b',
    accent1: '#f97316', // orange-500
    accent2: '#22c55e',
  },
  // 9 – Traction / KPIs
  'traction-kpis': {
    name: 'Traction & KPIs',
    primary: '#22c55e', // green-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#0ea5e9',
    neutral: '#64748b',
    accent1: '#84cc16',
    accent2: '#3b82f6',
  },
  // 10 – Impact
  'impact': {
    name: 'Impact',
    primary: '#14b8a6', // teal-500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#0ea5e9',
    neutral: '#64748b',
    accent1: '#22c55e',
    accent2: '#06b6d4',
  },
  // 11 – Exit
  'exit-strategy': {
    name: 'Exit',
    primary: '#a78bfa', // indigo-400/500
    success: '#10b981',
    warning: '#f59e0b',
    info: '#0ea5e9',
    neutral: '#64748b',
    accent1: '#3b82f6',
    accent2: '#22c55e',
  },
};

export function getChapterTheme(slug: string): ChapterTheme {
  return THEMES[slug] ?? {
    name: slug,
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#06b6d4',
    neutral: '#64748b',
    accent1: '#8b5cf6',
    accent2: '#14b8a6',
  };
}
