'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useI18n } from '@/contexts/I18nContext';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { SetupScreen } from '@/components/screens/SetupScreen';
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
import { TimerScreen } from '@/components/screens/TimerScreen';
import { AchievementScreen } from '@/components/screens/AchievementScreen';
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
  const { screen, words, go, onAnswer, onNext, onExitSession, onPick, pickedBox, authReady, setPickedBox } = useApp();
  const { reverse } = useI18n();
  const desktop = useIsDesktop();

  const nav = (s: Screen) => go(s);
  const isEmpty = words.length === 0;

  const renderScreen = () => {
    if (screen === 'login') return <LoginScreen onNav={nav} desktop={desktop} />;
    if (screen === 'setup') return <SetupScreen />;
    // Only block screens that genuinely need words to function
    const requiresWords = ['home', 'boxes', 'boxquiz', 'result_ok', 'result_ng'].includes(screen);
    if (isEmpty && requiresWords) {
      return <EmptyScreen onNav={nav} onImport={() => nav('import')} desktop={desktop} />;
    }

    switch (screen) {
      case 'maps':
        return <CosmosMapScreen onNav={nav} desktop={desktop} />;
      case 'timer':
        return <TimerScreen onNav={nav} desktop={desktop} />;
      case 'home':
        return <PlayScreen onNav={nav} onAnswer={onAnswer} reverse={reverse} desktop={desktop} />;
      case 'result_ok':
        return <ResultScreen ok onNav={nav} onNext={onNext} onExit={onExitSession} />;
      case 'result_ng':
        return <ResultScreen ok={false} onNav={nav} onNext={onNext} onExit={onExitSession} />;
      case 'boxes':
        return <NebulaeScreen onNav={nav} onPick={onPick} onSelect={setPickedBox} selected={pickedBox} desktop={desktop} />;
      case 'boxquiz':
        return <BoxQuizScreen onNav={nav} onAnswer={onAnswer} onExit={onExitSession} box={pickedBox} reverse={reverse} />;
      case 'list':
        return <CodexScreen onNav={nav} desktop={desktop} />;
      case 'import':
        return <ImportScreen onNav={nav} desktop={desktop} />;
      case 'achieve':
        return <AchievementScreen onNav={nav} desktop={desktop} />;
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

  // Show a minimal splash while Firebase resolves the auth state
  if (!authReady) {
    return (
      <div style={{ height: '100dvh', background: 'var(--bg-0)', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="nx-h glow" style={{ fontSize: 42, letterSpacing: '0.18em', color: 'var(--cyan)' }}>VOCAB</div>
          <div className="nx-overline" style={{ marginTop: 8 }}>// LOADING…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', background: 'var(--bg-0)', color: 'var(--ink)' }}>
      {renderScreen()}
    </div>
  );
}
