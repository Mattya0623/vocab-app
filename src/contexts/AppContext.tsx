'use client';
import {
  createContext, useContext, useState, useCallback, useMemo, useEffect, useRef,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Word, UserStats, Screen } from '@/types';

interface AppContextValue {
  user: User | null;
  username: string;
  authReady: boolean;
  words: Word[];
  stats: UserStats;
  level: number;
  xp: number;
  screen: Screen;
  pickedBox: number;
  sessionSource: 'home' | 'box';
  selectedMap: number;
  sessionLog: Array<{ word: string; correct: boolean }>;
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
  logout: () => Promise<void>;
  saveUsername: (name: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                   = useState<User | null>(null);
  const [username, setUsername]           = useState('');
  const [authReady, setAuthReady]         = useState(false);
  const [words, setWords]                 = useState<Word[]>([]);
  const [screen, setScreen]               = useState<Screen>('login');
  const [pickedBox, setPickedBox]         = useState(2);
  const [sessionSource, setSessionSource] = useState<'home' | 'box'>('home');
  const [selectedMap, setSelectedMap]     = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak]         = useState(0);
  const [sessionLog, setSessionLog]       = useState<Array<{ word: string; correct: boolean }>>([]);

  // Refs let callbacks access current state without stale closures
  const userRef        = useRef<User | null>(null);
  const wordsRef       = useRef<Word[]>([]);
  const dbRef          = useRef<Firestore | undefined>(undefined);
  const wordsUnsubRef  = useRef<(() => void) | undefined>(undefined);

  useEffect(() => { userRef.current  = user; },  [user]);
  useEffect(() => { wordsRef.current = words; }, [words]);

  // ── Firebase auth subscription ──────────────────────────────────────────
  useEffect(() => {
    let authUnsub: (() => void) | undefined;

    (async () => {
      const { auth, db, firebaseReady } = await import('@/lib/firebase');

      if (!firebaseReady || !auth || !db) {
        setAuthReady(true);  // no Firebase config → app runs in guest-local mode
        return;
      }

      dbRef.current = db;

      const { onAuthStateChanged, getRedirectResult } = await import('firebase/auth');
      const { getProfile, subscribeWords }            = await import('@/lib/firestore');

      // Resolve any pending mobile redirect login before subscribing
      getRedirectResult(auth).catch(() => {});

      authUnsub = onAuthStateChanged(auth, async (firebaseUser) => {
        // Always clean up previous words subscription on auth change
        wordsUnsubRef.current?.();
        wordsUnsubRef.current = undefined;

        setUser(firebaseUser);
        setAuthReady(true);

        if (!firebaseUser) {
          setWords([]);
          setUsername('');
          setScreen('login');
          return;
        }

        // Anonymous / guest — local state only, skip Firestore
        if (firebaseUser.isAnonymous) {
          setScreen(s => s === 'login' ? 'maps' : s);
          return;
        }

        // Google user — load profile from Firestore
        try {
          const profile = await getProfile(db, firebaseUser.uid);

          if (!profile) {
            // First-time login → username setup
            setScreen('setup');
            return;
          }

          setUsername(profile.username);
          setScreen(s => (s === 'login' || s === 'setup') ? 'maps' : s);
          wordsUnsubRef.current = subscribeWords(db, firebaseUser.uid, setWords);
        } catch (e) {
          // Firestore unavailable (rules not set, network issue) → graceful fallback
          console.error('Firestore profile load failed:', e);
          setScreen(s => s === 'login' ? 'maps' : s);
        }
      });
    })();

    return () => {
      authUnsub?.();
      wordsUnsubRef.current?.();
    };
  }, []);

  // Called from SetupScreen after username is submitted
  const saveUsername = useCallback(async (name: string) => {
    const u  = userRef.current;
    const db = dbRef.current;

    if (u && !u.isAnonymous && db) {
      const { saveProfile, subscribeWords } = await import('@/lib/firestore');
      await saveProfile(db, u.uid, name);
      wordsUnsubRef.current?.();
      wordsUnsubRef.current = subscribeWords(db, u.uid, setWords);
    }

    setUsername(name);
    setScreen('maps');
  }, []);

  const logout = useCallback(async () => {
    wordsUnsubRef.current?.();
    wordsUnsubRef.current = undefined;

    const { auth, firebaseReady } = await import('@/lib/firebase');
    if (firebaseReady && auth) {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    }
    setUser(null);
    setWords([]);
    setUsername('');
    setScreen('login');
  }, []);

  // ── Stats / XP / Level ─────────────────────────────────────────────────
  const stats = useMemo<UserStats>(() => {
    const totalAttempts = words.reduce((s, w) => s + w.attempts, 0);
    const totalCorrect  = words.reduce((s, w) => s + w.correct_answers, 0);
    return { totalAttempts, totalCorrect, maxStreak, currentStreak, wordsCount: words.length };
  }, [words, maxStreak, currentStreak]);

  const xp    = stats.totalCorrect;
  const level = useMemo(() => Math.max(1, Math.floor(Math.sqrt(xp / 10)) + 1), [xp]);

  // ── Word mutations ─────────────────────────────────────────────────────
  const recordAnswer = useCallback((wordId: string, correct: boolean) => {
    if (correct) {
      setCurrentStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
    } else {
      setCurrentStreak(0);
    }

    const word = wordsRef.current.find(w => w.id === wordId);
    if (!word) return;

    setSessionLog(prev => [{ word: word.word, correct }, ...prev].slice(0, 10));

    const attempts        = word.attempts + 1;
    const correct_answers = word.correct_answers + (correct ? 1 : 0);
    const accuracy        = Math.round((correct_answers / attempts) * 100);
    const updated         = { ...word, attempts, correct_answers, accuracy };

    // Always update local state immediately for instant UI feedback
    setWords(prev => prev.map(w => w.id === wordId ? updated : w));

    const u  = userRef.current;
    const db = dbRef.current;
    if (u && !u.isAnonymous && db) {
      import('@/lib/firestore').then(({ upsertWord }) =>
        upsertWord(db, u.uid, updated).catch(console.error)
      );
    }
  }, []);

  const addWords = useCallback((newWords: Omit<Word, 'id'>[]) => {
    const withIds = newWords.map((w, i) => ({ ...w, id: `${Date.now()}-${i}` }));

    // Always update local state immediately
    setWords(prev => [...prev, ...withIds]);

    const u  = userRef.current;
    const db = dbRef.current;
    if (u && !u.isAnonymous && db) {
      import('@/lib/firestore').then(({ upsertWord }) =>
        Promise.all(withIds.map(w => upsertWord(db, u.uid, w))).catch(console.error)
      );
    }
  }, []);

  const deleteWords = useCallback((ids: string[]) => {
    // Always update local state immediately
    setWords(prev => prev.filter(w => !ids.includes(w.id)));

    const u  = userRef.current;
    const db = dbRef.current;
    if (u && !u.isAnonymous && db) {
      import('@/lib/firestore').then(({ removeWords }) =>
        removeWords(db, u.uid, ids).catch(console.error)
      );
    }
  }, []);

  const go = useCallback((s: Screen) => {
    if (s !== 'boxquiz' && s !== 'result_ok' && s !== 'result_ng') setSessionSource('home');
    setScreen(s);
  }, []);

  const onAnswer      = useCallback((ok: boolean)  => { setScreen(ok ? 'result_ok' : 'result_ng'); }, []);
  const onNext        = useCallback(()              => { setScreen(sessionSource === 'box' ? 'boxquiz' : 'home'); }, [sessionSource]);
  const onExitSession = useCallback(()              => { setSessionSource('home'); setScreen('boxes'); }, []);
  const onPick        = useCallback((n: number)     => { setPickedBox(n); setSessionSource('box'); setScreen('boxquiz'); }, []);

  return (
    <AppContext.Provider value={{
      user, username, authReady,
      words, stats, level, xp, screen,
      pickedBox, sessionSource, selectedMap, sessionLog,
      setScreen, setPickedBox, setSessionSource, setSelectedMap,
      recordAnswer, addWords, deleteWords,
      go, onAnswer, onNext, onExitSession, onPick,
      logout, saveUsername,
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
