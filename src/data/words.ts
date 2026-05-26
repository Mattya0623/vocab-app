import type { Word } from '@/types';

export const SAMPLE_WORDS: Word[] = [
  { id: '1', word: 'apple',       meaning: 'りんご',        attempts: 12, correct_answers: 11, accuracy: 92 },
  { id: '2', word: 'meticulous',  meaning: '几帳面な',      attempts: 8,  correct_answers: 3,  accuracy: 38 },
  { id: '3', word: 'ephemeral',   meaning: '儚い・短命の',  attempts: 6,  correct_answers: 5,  accuracy: 83 },
  { id: '4', word: 'gregarious',  meaning: '社交的な',      attempts: 4,  correct_answers: 1,  accuracy: 25 },
  { id: '5', word: 'serendipity', meaning: '偶然の幸運',    attempts: 14, correct_answers: 13, accuracy: 93 },
  { id: '6', word: 'obfuscate',   meaning: '不明瞭にする',  attempts: 5,  correct_answers: 2,  accuracy: 40 },
  { id: '7', word: 'lucid',       meaning: '明快な',        attempts: 9,  correct_answers: 7,  accuracy: 78 },
  { id: '8', word: 'pragmatic',   meaning: '実用的な',      attempts: 10, correct_answers: 4,  accuracy: 40 },
];
