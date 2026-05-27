'use client';
import { useState } from 'react';
import { NxCard, NxBtn, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { NEBULAE, boxOf } from '@/data/nebulae';
import type { Screen, Word } from '@/types';

interface BoxQuizScreenProps {
  onNav: (s: Screen) => void;
  onAnswer: (ok: boolean) => void;
  onExit: () => void;
  box: number;
  reverse: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildBoxQuiz(boxWords: Word[], allWords: Word[], reverse: boolean) {
  // Question is always from the selected box; distractors drawn from full pool
  const current = boxWords[Math.floor(Math.random() * boxWords.length)];
  const correct  = reverse ? current.word    : current.meaning;
  const pool     = shuffle(allWords.filter(w => w.id !== current.id))
    .slice(0, 3)
    .map(w => reverse ? w.word : w.meaning);
  const options  = shuffle([correct, ...pool]);
  return { current, options, correctIdx: options.indexOf(correct) };
}

export function BoxQuizScreen({ onNav, onAnswer, onExit, box, reverse }: BoxQuizScreenProps) {
  const t = useT();
  const { words, stats, recordAnswer, sessionLog, setLastResult } = useApp();
  const b = NEBULAE[box - 1];

  const boxWords = words.filter(w => boxOf(w.accuracy) === box);

  const [quiz] = useState(() => buildBoxQuiz(
    boxWords.length > 0 ? boxWords : words,
    words,
    reverse,
  ));
  const { current, options, correctIdx } = quiz;

  const slots = [...options, '', '', '', ''].slice(0, 4) as string[];

  const sessionCount = sessionLog.length;

  const handleAnswer = (idx: number) => {
    const ok = idx === correctIdx;
    const chosen = slots[idx] || '';
    const newAttempts = current.attempts + 1;
    const newCorrect  = current.correct_answers + (ok ? 1 : 0);
    const newAccuracy = Math.round((newCorrect / newAttempts) * 100);
    setLastResult({
      word: current.word,
      meaning: current.meaning,
      accuracy: newAccuracy,
      attempts: newAttempts,
      correct: ok,
      chosenAnswer: chosen,
      nebula: NEBULAE[boxOf(current.accuracy) - 1],
      prevStreak: stats.currentStreak,
    });
    recordAnswer(current.id, ok);
    onAnswer(ok);
  };

  const queryText = reverse ? current.meaning : current.word;

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`${b.name.toUpperCase()} · N${b.n}`}
        sub={`${b.range} · ${boxWords.length} WORDS · ${reverse ? 'JA→EN' : 'EN→JA'}`}
        glowColor="mag"
        left={<div onClick={onExit} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>}
        right={<NxBtn ghost style={{ padding: '3px 8px', fontSize: 10 }} onClick={onExit}>{t('EXIT_SESSION')}</NxBtn>}
      />
      <div style={{ padding: '10px 14px 0', display: 'flex', gap: 4 }}>
        {NEBULAE.map(n => (
          <div key={n.n} style={{ flex: 1, height: 4, borderRadius: 2, background: n.n === box ? n.color : 'rgba(255,255,255,0.08)', boxShadow: n.n === box ? `0 0 8px ${n.color}` : 'none' }} />
        ))}
      </div>
      <div style={{ padding: '6px 16px 0', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-mono">{t('SESSION')} {sessionCount} ANS</span>
        <span className="nx-mono" style={{ color: b.color }}>{b.name.toUpperCase()} · N{b.n}</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="mag" bracket="mag" scan style={{ padding: '22px 16px', textAlign: 'center' }}>
          <div className="nx-overline" style={{ color: b.color }}>{t('QUERY')}</div>
          <div className="nx-h mag-glow" style={{ fontSize: 38, marginTop: 8, color: b.color }}>{queryText}</div>
        </NxCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {slots.map((c, i) =>
            c ? (
              <NxBtn key={i} choice onClick={() => handleAnswer(i)} style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                <span className="nx-mono" style={{ fontSize: 10 }}>{i + 1}</span>
                <span>{c}</span>
              </NxBtn>
            ) : (
              <div key={i} style={{ border: '1px dashed rgba(118,138,220,0.2)', borderRadius: 8, opacity: 0.4 }} />
            )
          )}
        </div>
      </div>
      <NxTabBar active="boxes" onNav={onNav} />
    </div>
  );
}
