export type TimelineItem = {
  period: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  kind?: 'work' | 'education' | 'charity';
};

export type TimelineGroup = {
  year: string;
  items: TimelineItem[];
};

export type SizePreset = 'sm' | 'md' | 'lg';

export type TimelineCommonProps = {
  size?: SizePreset;
};
