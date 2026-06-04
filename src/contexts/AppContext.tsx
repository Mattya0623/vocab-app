'use client';
import {
  createContext, useContext, useState, useCallback, useMemo, useEffect, useRef,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Word, UserStats, Screen, LastResult, DayRecord } from '@/types';

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
  sessionLog: Array<{ word: string; correct: boolean; responseMs: number }>;
  lastResult: LastResult | null;
  tagFilter: string | null;
  timerTotal: number;
  timerRemaining: number;
  timerRunning: boolean;
  timerDone: boolean;
  timerStart: () => void;
  timerPause: () => void;
  timerReset: () => void;
  timerSet: (secs: number) => void;
  setScreen: (s: Screen) => void;
  setPickedBox: (n: number) => void;
  setSessionSource: (s: 'home' | 'box') => void;
  setSelectedMap: (i: number) => void;
  setLastResult: (r: LastResult) => void;
  setTagFilter: (t: string | null) => void;
  masteredTags: Record<string, number>;
  tagBestTimes: Record<string, number>;
  dailyLog: Record<string, DayRecord>;
  masterTag: (tag: string, timeMs?: number) => void;
  showResult: boolean;
  setShowResult: (v: boolean) => void;
  quizKey: number;
  recordAnswer: (wordId: string, correct: boolean, responseMs: number) => void;
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
  const [sessionLog, setSessionLog]       = useState<Array<{ word: string; correct: boolean; responseMs: number }>>([]);
  const [lastResult, setLastResult]       = useState<LastResult | null>(null);
  const [tagFilter, setTagFilter]         = useState<string | null>(null);
  const [masteredTags, setMasteredTags]   = useState<Record<string, number>>({});
  const [tagBestTimes, setTagBestTimes]   = useState<Record<string, number>>({});
  const [dailyLog, setDailyLog]           = useState<Record<string, DayRecord>>({});
  const [showResult, setShowResult]       = useState(true);
  const [quizKey, setQuizKey]             = useState(0);
  const showResultRef                     = useRef(true);
  const [timerTotal, setTimerTotal]       = useState(300);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning]   = useState(false);
  const [timerDone, setTimerDone]         = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerTotalRef    = useRef(300);

  // Refs let callbacks access current state without stale closures
  const userRef           = useRef<User | null>(null);
  const wordsRef          = useRef<Word[]>([]);
  const maxStreakRef      = useRef(0);
  const dbRef             = useRef<Firestore | undefined>(undefined);
  const wordsUnsubRef     = useRef<(() => void) | undefined>(undefined);
  const dailyLogRef       = useRef<Record<string, DayRecord>>({});
  const dailySaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { userRef.current     = user; },       [user]);
  useEffect(() => { wordsRef.current    = words; },      [words]);
  useEffect(() => { maxStreakRef.current = maxStreak; }, [maxStreak]);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);
  useEffect(() => { dailyLogRef.current = dailyLog; },   [dailyLog]);

  const scheduleDailyLogSave = useCallback(() => {
    if (dailySaveTimerRef.current) clearTimeout(dailySaveTimerRef.current);
    dailySaveTimerRef.current = setTimeout(() => {
      const u = userRef.current; const db = dbRef.current;
      if (u && !u.isAnonymous && db) {
        import('@/lib/firestore').then(({ saveDailyLog }) =>
          saveDailyLog(db, u.uid, dailyLogRef.current).catch(console.error)
        );
      }
    }, 4000);
  }, []);

  // Persist maxStreak to Firestore whenever it increases
  useEffect(() => {
    const u = userRef.current;
    const db = dbRef.current;
    if (!u || u.isAnonymous || !db || maxStreak === 0) return;
    import('@/lib/firestore').then(({ saveMaxStreak }) =>
      saveMaxStreak(db, u.uid, maxStreak).catch(console.error)
    );
  }, [maxStreak]);

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
          if (profile.maxStreak) setMaxStreak(profile.maxStreak);
          if (profile.masteredTags) {
            const raw = profile.masteredTags;
            if (Array.isArray(raw)) {
              const converted: Record<string, number> = {};
              raw.forEach(tag => { converted[tag] = 1; });
              setMasteredTags(converted);
            } else {
              setMasteredTags(raw as Record<string, number>);
            }
          }
          if (profile.tagBestTimes) setTagBestTimes(profile.tagBestTimes);
          if (profile.dailyLog)    setDailyLog(profile.dailyLog as Record<string, DayRecord>);
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
      await saveProfile(db, u.uid, name, maxStreakRef.current);
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
    setMaxStreak(0);
    setCurrentStreak(0);
    setSessionLog([]);
    setScreen('login');
  }, []);

  // ── Stats / XP / Level ─────────────────────────────────────────────────
  const stats = useMemo<UserStats>(() => {
    const totalAttempts   = words.reduce((s, w) => s + w.attempts, 0);
    const totalCorrect    = words.reduce((s, w) => s + w.correct_answers, 0);
    const totalResponseMs = words.reduce((s, w) => s + (w.avgResponseMs ?? 0) * w.attempts, 0);
    return { totalAttempts, totalCorrect, maxStreak, currentStreak, wordsCount: words.length, totalResponseMs };
  }, [words, maxStreak, currentStreak]);

  const xp    = stats.totalCorrect;
  const level = useMemo(() => Math.floor(xp / 50) + 1, [xp]);

  // ── Word mutations ─────────────────────────────────────────────────────
  const recordAnswer = useCallback((wordId: string, correct: boolean, responseMs: number) => {
    if (correct) {
      setCurrentStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
    } else {
      setCurrentStreak(0);
    }

    const word = wordsRef.current.find(w => w.id === wordId);
    if (!word) return;

    setSessionLog(prev => [{ word: word.word, correct, responseMs }, ...prev].slice(0, 10));

    const attempts        = word.attempts + 1;
    const correct_answers = word.correct_answers + (correct ? 1 : 0);
    const accuracy        = Math.round((correct_answers / attempts) * 100);
    const prevAvg         = word.avgResponseMs ?? responseMs;
    const avgResponseMs   = Math.round((prevAvg * (attempts - 1) + responseMs) / attempts);
    const updated         = { ...word, attempts, correct_answers, accuracy, avgResponseMs };

    setWords(prev => prev.map(w => w.id === wordId ? updated : w));

    const u  = userRef.current;
    const db = dbRef.current;
    if (u && !u.isAnonymous && db) {
      import('@/lib/firestore').then(({ upsertWord }) =>
        upsertWord(db, u.uid, updated).catch(console.error)
      );
    }

    // Track daily flashcard count
    const today = getToday();
    setDailyLog(prev => {
      const day  = prev[today] ?? { answers: 0, masters: {} };
      const next = { ...prev, [today]: { ...day, answers: day.answers + 1 } };
      dailyLogRef.current = next;
      scheduleDailyLogSave();
      return next;
    });
  }, [scheduleDailyLogSave]);

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

  // ── Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerRunning) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }
    timerIntervalRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          setTimerRunning(false);
          setTimerDone(true);
          import('@/lib/audio').then(({ playChime }) => playChime());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerRunning]);

  const timerStart = useCallback(() => setTimerRunning(true), []);
  const timerPause = useCallback(() => setTimerRunning(false), []);
  const timerReset = useCallback(() => {
    setTimerRunning(false);
    setTimerDone(false);
    setTimerRemaining(timerTotalRef.current);
  }, []);
  const timerSet = useCallback((secs: number) => {
    setTimerRunning(false);
    setTimerDone(false);
    timerTotalRef.current = secs;
    setTimerTotal(secs);
    setTimerRemaining(secs);
  }, []);

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const masterTag = useCallback((tag: string, timeMs?: number) => {
    const today = getToday();

    // Update mastered count
    setMasteredTags(prev => {
      const next = { ...prev, [tag]: (prev[tag] ?? 0) + 1 };
      const u = userRef.current; const db = dbRef.current;
      if (u && !u.isAnonymous && db) {
        import('@/lib/firestore').then(({ saveMasteredTags }) =>
          saveMasteredTags(db, u.uid, next).catch(console.error)
        );
      }
      return next;
    });

    // Update best time
    if (timeMs !== undefined) {
      setTagBestTimes(prev => {
        const prevBest = prev[tag];
        if (prevBest !== undefined && prevBest <= timeMs) return prev;
        const next = { ...prev, [tag]: timeMs };
        const u = userRef.current; const db = dbRef.current;
        if (u && !u.isAnonymous && db) {
          import('@/lib/firestore').then(({ saveTagBestTimes }) =>
            saveTagBestTimes(db, u.uid, next).catch(console.error)
          );
        }
        return next;
      });
    }

    // Update daily log
    setDailyLog(prev => {
      const day  = prev[today] ?? { answers: 0, masters: {} };
      const next = { ...prev, [today]: { ...day, masters: { ...day.masters, [tag]: (day.masters[tag] ?? 0) + 1 } } };
      dailyLogRef.current = next;
      scheduleDailyLogSave();
      return next;
    });
  }, [scheduleDailyLogSave]);

  const go = useCallback((s: Screen) => {
    if (s !== 'boxquiz' && s !== 'result_ok' && s !== 'result_ng') setSessionSource('home');
    setScreen(s);
  }, []);

  const onAnswer = useCallback((ok: boolean) => {
    if (showResultRef.current) {
      setScreen(ok ? 'result_ok' : 'result_ng');
    } else {
      setQuizKey(k => k + 1);
    }
  }, []);
  const onNext        = useCallback(()              => { setScreen(sessionSource === 'box' ? 'boxquiz' : 'home'); }, [sessionSource]);
  const onExitSession = useCallback(()              => { setSessionSource('home'); setScreen('boxes'); }, []);
  const onPick        = useCallback((n: number)     => { setPickedBox(n); setSessionSource('box'); setScreen('boxquiz'); }, []);

  return (
    <AppContext.Provider value={{
      user, username, authReady,
      words, stats, level, xp, screen,
      pickedBox, sessionSource, selectedMap, sessionLog, lastResult, tagFilter,
      masteredTags, tagBestTimes, dailyLog, masterTag,
      showResult, setShowResult, quizKey,
      timerTotal, timerRemaining, timerRunning, timerDone,
      timerStart, timerPause, timerReset, timerSet,
      setScreen, setPickedBox, setSessionSource, setSelectedMap, setLastResult, setTagFilter,
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
