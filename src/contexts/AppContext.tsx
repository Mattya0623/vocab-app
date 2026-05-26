'use client';
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { SAMPLE_WORDS } from '@/data/words';
import { NEBULAE, boxOf } from '@/data/nebulae';
import type { Word, UserStats, Screen } from '@/types';

interface AppContextValue {
  words: Word[];
  stats: UserStats;
  level: number;
  xp: number;
  screen: Screen;
  pickedBox: number;
  sessionSource: 'home' | 'box';
  selectedMap: number;
  setScreen: (s: Screen) => void;
  setPickedBox: (n: number) => void;
  setSessionSource: (s: 'home' | 'box') => void;
  setSelectedMap: (i: number) => void;
  recordAnswer: (wordId: string, correct: boolean) => void;
  addWords: (newWords: Omit<Word, 'id'>[]) => void;
  deleteWords: (ids: string[]) => void;
  go: (s: Screen) => void;
  onAnswer: (ok: boolean) => void;
  onNext: () => void;
  onExitSession: () => void;
  onPick: (n: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [words, setWords] = useState<Word[]>(SAMPLE_WORDS);
  const [screen, setScreen] = useState<Screen>('login');
  const [pickedBox, setPickedBox] = useState(2);
  const [sessionSource, setSessionSource] = useState<'home' | 'box'>('home');
  const [selectedMap, setSelectedMap] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const stats = useMemo<UserStats>(() => {
    const totalAttempts = words.reduce((s, w) => s + w.attempts, 0);
    const totalCorrect = words.reduce((s, w) => s + w.correct_answers, 0);
    return {
      totalAttempts,
      totalCorrect,
      maxStreak,
      currentStreak,
      wordsCount: words.length,
    };
  }, [words, maxStreak, currentStreak]);

  // XP = total correct answers; level from XP
  const xp = stats.totalCorrect;
  const level = useMemo(() => Math.max(1, Math.floor(Math.sqrt(xp / 10)) + 1), [xp]);

  const recordAnswer = useCallback((wordId: string, correct: boolean) => {
    setWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      const attempts = w.attempts + 1;
      const correct_answers = w.correct_answers + (correct ? 1 : 0);
      const accuracy = attempts > 0 ? Math.round((correct_answers / attempts) * 100) : 0;
      return { ...w, attempts, correct_answers, accuracy };
    }));
    if (correct) {
      setCurrentStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setCurrentStreak(0);
    }
  }, []);

  const addWords = useCallback((newWords: Omit<Word, 'id'>[]) => {
    const withIds = newWords.map((w, i) => ({
      ...w,
      id: `${Date.now()}-${i}`,
    }));
    setWords(prev => [...prev, ...withIds]);
  }, []);

  const deleteWords = useCallback((ids: string[]) => {
    setWords(prev => prev.filter(w => !ids.includes(w.id)));
  }, []);

  const go = useCallback((s: Screen) => {
    if (s !== 'boxquiz' && s !== 'result_ok' && s !== 'result_ng') {
      setSessionSource('home');
    }
    setScreen(s);
  }, []);

  const onAnswer = useCallback((ok: boolean) => {
    setScreen(ok ? 'result_ok' : 'result_ng');
  }, []);

  const onNext = useCallback(() => {
    if (sessionSource === 'box') setScreen('boxquiz');
    else setScreen('home');
  }, [sessionSource]);

  const onExitSession = useCallback(() => {
    setSessionSource('home');
    setScreen('boxes');
  }, []);

  const onPick = useCallback((n: number) => {
    setPickedBox(n);
    setSessionSource('box');
    setScreen('boxquiz');
  }, []);

  return (
    <AppContext.Provider value={{
      words, stats, level, xp, screen,
      pickedBox, sessionSource, selectedMap,
      setScreen, setPickedBox, setSessionSource, setSelectedMap,
      recordAnswer, addWords, deleteWords,
      go, onAnswer, onNext, onExitSession, onPick,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
