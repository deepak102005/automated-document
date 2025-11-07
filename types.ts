
export interface Summary {
  short: string;
  medium: string;
  detailed: string;
}

export interface QAItem {
  question: string;
  answer: string;
}

export interface AnalysisResult {
  summary: Summary;
  keywords: string[];
  qaHistory: QAItem[];
}

export type DocumentType = 'legal' | 'literary';

export type Tab = 'summary' | 'qa' | 'keywords' | 'export';
