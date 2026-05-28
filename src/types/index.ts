export interface Word {
  id: string;
  word: string;
  meaning: string;
  attempts: number;
  correct_answers: number;
  accuracy: number;
  avgResponseMs?: number;
  tags?: string[];
  userId?: string;
  createdAt?: Date;
}

export interface UserStats {
  totalAttempts: number;
  totalCorrect: number;
  maxStreak: number;
  currentStreak: number;
  wordsCount: number;
}

export interface Nebula {
  n: number;
  name: string;
  range: string;
  count: number;
  color: string;
  desc: string;
}

export interface Stage {
  name: string;
  sub: string;
}

export interface CosmosMap {
  id: number;
  name: string;
  en: string;
  color: string;
  stages: Stage[];
}

export type Lang = 'ja' | 'en' | 'zh' | 'ko';
export type Screen =
  | 'login' | 'setup' | 'empty' | 'maps' | 'home' | 'timer'
  | 'result_ok' | 'result_ng' | 'boxes' | 'boxquiz'
  | 'list' | 'import' | 'achieve' | 'stats' | 'settings';

export type SortKey = 'default' | 'acc_asc' | 'acc_desc' | 'att_desc' | 'az';

export interface LastResult {
  word: string;
  meaning: string;
  accuracy: number;
  attempts: number;
  correct: boolean;
  chosenAnswer: string;
  nebula: { name: string; n: number; color: string };
  prevStreak: number;
}
