'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useI18n } from '@/contexts/I18nContext';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { EmptyScreen } from '@/components/screens/EmptyScreen';
import { PlayScreen } from '@/components/screens/PlayScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { NebulaeScreen } from '@/components/screens/NebulaeScreen';
import { BoxQuizScreen } from '@/components/screens/BoxQuizScreen';
import { CodexScreen } from '@/components/screens/CodexScreen';
import { ImportScreen } from '@/components/screens/ImportScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { CosmosMapScreen } from '@/components/screens/CosmosMapScreen';
import type { Screen } from '@/types';

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return desktop;
}

export default function Home() {
  const { screen, words, go, onAnswer, onNext, onExitSession, onPick, pickedBox } = useApp();
  const { reverse } = useI18n();
  const desktop = useIsDesktop();

  const nav = (s: Screen) => go(s);
  const isEmpty = words.length === 0;

  const renderScreen = () => {
    if (screen === 'login') {
      return <LoginScreen onNav={nav} desktop={desktop} />;
    }
    if (isEmpty && screen !== 'import' && screen !== 'settings') {
      return <EmptyScreen onNav={nav} desktop={desktop} />;
    }

    switch (screen) {
      case 'maps':
        return <CosmosMapScreen onNav={nav} desktop={desktop} />;
      case 'home':
        return <PlayScreen onNav={nav} onAnswer={onAnswer} reverse={reverse} desktop={desktop} />;
      case 'result_ok':
        return <ResultScreen ok onNav={nav} onNext={onNext} onExit={onExitSession} />;
      case 'result_ng':
        return <ResultScreen ok={false} onNav={nav} onNext={onNext} onExit={onExitSession} />;
      case 'boxes':
        return <NebulaeScreen onNav={nav} onPick={onPick} selected={pickedBox} desktop={desktop} />;
      case 'boxquiz':
        return <BoxQuizScreen onNav={nav} onAnswer={onAnswer} onExit={onExitSession} box={pickedBox} reverse={reverse} />;
      case 'list':
        return <CodexScreen onNav={nav} desktop={desktop} />;
      case 'import':
        return <ImportScreen onNav={nav} desktop={desktop} />;
      case 'stats':
        return <ProfileScreen onNav={nav} desktop={desktop} />;
      case 'settings':
        return <SettingsScreen onNav={nav} desktop={desktop} />;
      case 'empty':
        return <EmptyScreen onNav={nav} desktop={desktop} />;
      default:
        return <PlayScreen onNav={nav} onAnswer={onAnswer} reverse={reverse} desktop={desktop} />;
    }
  };

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', background: 'var(--bg-0)', color: 'var(--ink)' }}>
      {renderScreen()}
    </div>
  );
}
