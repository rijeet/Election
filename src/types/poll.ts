export type LocaleKey = 'bn' | 'en';

export interface PollOption {
  key: string;
  label: Record<LocaleKey, string>;
  votes: number;
}

export interface PollQuestion {
  question: Record<LocaleKey, string>;
  tooltip?: Record<LocaleKey, string>;
  options: PollOption[];
}

export interface PollTitle {
  bn: string;
  en: string;
}

export interface PollDTO {
  _id: string;
  slug: string;
  title: PollTitle;
  isGroup: boolean;
  questions: PollQuestion[];
  createdAt: string;
  updatedAt: string;
}


