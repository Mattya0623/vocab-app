'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { TR, LANGS } from '@/data/i18n';
import type { Lang } from '@/types';

interface I18nContextValue {
  lang: Lang;
  reverse: boolean;
  setLang: (l: Lang) => void;
  setReverse: (v: boolean) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'ja',
  reverse: false,
  setLang: () => {},
  setReverse: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja');
  const [reverse, setReverse] = useState(false);

  const t = useCallback((key: string, fallback?: string): string => {
    const entry = TR[key];
    if (!entry) return fallback ?? key;
    return entry[lang] || entry.ja || fallback || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, reverse, setLang, setReverse, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() { return useContext(I18nContext); }
export function useT() {
  const { t } = useI18n();
  return t;
}
export { LANGS };
