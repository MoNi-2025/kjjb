export enum NewsCategory {
  AI = 'Artificial Intelligence',
  US_BIG7 = 'US Tech Giants',
  CN_BIG7 = 'China Tech Giants',
  POLICY = 'Global Policy'
}

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string; // Event overview (max 100 words)
  impact: string; // Impact analysis (max 50 words)
  dataPoint: string; // Key statistic
  source: string; // Authority source
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}