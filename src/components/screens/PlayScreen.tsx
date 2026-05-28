'use client';
import { useState, useMemo, useRef } from 'react';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { boxOf, NEBULAE } from '@/data/nebulae';
import type { Screen, Word } from '@/types';

interface PlayScreenProps {
  onNav: (s: Screen) => void;
  onAnswer: (ok: boolean) => void;
  reverse: boolean;
  desktop?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(words: Word[], reverse: boolean) {
  const current = words[Math.floor(Math.random() * words.length)];
  const correct  = reverse ? current.word    : current.meaning;
  const pool     = shuffle(words.filter(w => w.id !== current.id))
    .slice(0, 3)
    .map(w => reverse ? w.word : w.meaning);
  const options  = shuffle([correct, ...pool]);
  return { current, options, correctIdx: options.indexOf(correct) };
}

export function PlayScreen({ onNav, onAnswer, reverse, desktop }: PlayScreenProps) {
  const t = useT();
  const { level, xp, stats, words, recordAnswer, sessionLog, setLastResult, tagFilter, setTagFilter } = useApp();
  const maxXp = 10 * level ** 2;
  const minXp = 10 * (level - 1) ** 2;
  const xpPct  = maxXp > minXp ? Math.round(((xp - minXp) / (maxXp - minXp)) * 100) : 0;

  // All unique tags from the word list
  const allTags = useMemo(() => {
    const s = new Set<string>();
    words.forEach(w => w.tags?.forEach(tg => s.add(tg)));
    return [...s].sort();
  }, [words]);

  // Words filtered by active tag
  const filteredWords = useMemo(() =>
    tagFilter ? words.filter(w => w.tags?.includes(tagFilter)) : words,
    [words, tagFilter]
  );
  const quizPool = filteredWords.length > 0 ? filteredWords : words;

  // Build quiz once per mount — quizPool is stable for this mount since tagFilter lives in context
  const [quiz] = useState(() => buildQuiz(quizPool, reverse));
  const questionStartRef = useRef(Date.now());

  const { current, options, correctIdx } = quiz;
  const nebula = NEBULAE[boxOf(current.accuracy) - 1];

  const slots = [...options, '', '', '', ''].slice(0, 4) as string[];

  const handleAnswer = (idx: number) => {
    const responseMs = Date.now() - questionStartRef.current;
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
    recordAnswer(current.id, ok, responseMs);
    onAnswer(ok);
  };

  const sessionCorrect = sessionLog.filter(l => l.correct).length;
  const sessionWrong   = sessionLog.filter(l => !l.correct).length;
  const sessionAcc     = sessionLog.length > 0
    ? Math.round((sessionCorrect / sessionLog.length) * 100)
    : 0;

  const queryText = reverse ? current.meaning : current.word;
  const wordInfo  = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: desktop ? 18 : 14, flexWrap: 'wrap' }}>
      <NxTag>{t('ATT_SHORT')} {current.attempts}</NxTag>
      <NxTag green={current.accuracy >= 75} amber={current.accuracy >= 40 && current.accuracy < 75}
        style={current.accuracy < 40 ? { color: 'var(--red)', borderColor: 'rgba(255,92,122,0.4)' } : {}}>
        {t('ACC_SHORT')} {current.accuracy}%
      </NxTag>
      <NxTag mag>{nebula.name.toUpperCase()} · N{nebula.n}</NxTag>
    </div>
  );

  // Tag filter bar — shown when there are any tags in the word list
  const tagFilterBar = allTags.length > 0 && (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto', padding: desktop ? '0 0 2px' : '0 16px 2px', scrollbarWidth: 'none' }}>
      <span className="nx-overline" style={{ whiteSpace: 'nowrap', fontSize: 9 }}>TAG</span>
      <span onClick={() => setTagFilter(null)} className="nx-clickable">
        <NxTag cyan={tagFilter === null} style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>ALL</NxTag>
      </span>
      {allTags.map(tg => (
        <span key={tg} onClick={() => setTagFilter(tg === tagFilter ? null : tg)} className="nx-clickable">
          <NxTag cyan={tagFilter === tg} style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>{tg}</NxTag>
        </span>
      ))}
      {tagFilter && (
        <span className="nx-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', whiteSpace: 'nowrap', marginLeft: 4 }}>
          {filteredWords.length} 語
        </span>
      )}
    </div>
  );

  const choiceButtons = (grid: boolean) => (
    <div style={{ display: grid ? 'grid' : 'flex', gridTemplateColumns: grid ? '1fr 1fr' : undefined, flexDirection: grid ? undefined : 'column', gap: grid ? 12 : 10 }}>
      {slots.map((c, i) =>
        c ? (
          <NxBtn key={i} choice onClick={() => handleAnswer(i)} style={{ padding: grid ? '18px 16px' : undefined, fontSize: grid ? 17 : undefined }}>
            <span style={{ width: grid ? 30 : 24, height: grid ? 30 : 24, border: '1px solid var(--line-bright)', borderRadius: grid ? 6 : 4, display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)', marginRight: grid ? 10 : 4, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ flex: 1 }}>{c}</span>
          </NxBtn>
        ) : (
          <div key={i} style={{ height: grid ? 58 : 48, border: '1px dashed rgba(118,138,220,0.2)', borderRadius: 8, opacity: 0.4 }} />
        )
      )}
    </div>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="home" onNav={onNav}
        title={`${t('PLAY')} · ${t('PLAY_SUB')}`}
        sub={`${reverse ? 'JA → EN' : 'EN → JA'} · ${quizPool.length} ${t('ENTRIES')}${tagFilter ? ` · ${tagFilter}` : ''}`}
        right={<>
          {tagFilterBar}
          <NxTag amber>▲ {stats.currentStreak} {t('STREAK')}</NxTag>
          <NxTag cyan>LV·{String(level).padStart(2, '0')}</NxTag>
          <div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}>
            <NxIcon kind="settings" size={20} color="var(--ink-soft)" />
          </div>
        </>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <NxCard glow="cyan" bracket scan style={{ padding: 36, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')}</div>
              <div className="nx-h glow" style={{ fontSize: 72, marginTop: 14, letterSpacing: '0.02em', lineHeight: 1 }}>{queryText}</div>
              {wordInfo}
            </NxCard>
            {choiceButtons(true)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NxCard style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="nx-h" style={{ fontSize: 12 }}>{t('SESSION')}</span>
                <span className="nx-mono">{sessionLog.length} ANS</span>
              </div>
              <NxProgress value={xpPct} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                {[
                  { label: t('CORRECT_LOG'), val: sessionCorrect, color: 'var(--green)', bg: 'rgba(92,255,157,0.08)',  border: 'rgba(92,255,157,0.3)' },
                  { label: t('WRONG_LOG'),   val: sessionWrong,   color: 'var(--red)',   bg: 'rgba(255,92,122,0.08)',  border: 'rgba(255,92,122,0.3)' },
                  { label: t('ACC_SHORT'),   val: `${sessionAcc}%`, color: 'var(--cyan)', bg: 'rgba(92,232,255,0.08)', border: 'rgba(92,232,255,0.3)' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: s.bg, border: `1px solid ${s.border}` }}>
                    <div className="nx-overline">{s.label}</div>
                    <div className="nx-h" style={{ fontSize: 18, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </NxCard>
            <NxCard style={{ padding: 14 }}>
              <span className="nx-h" style={{ fontSize: 12 }}>{t('SHORTCUTS')}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, fontSize: 13 }}>
                {[['1—4', t('SHORT_PICK')], ['SPACE', t('SHORT_NEXT')], ['?', t('SHORT_HINT')], ['S', t('SHORT_SPEAK')]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="nx-mono" style={{ border: '1px solid var(--line-bright)', padding: '2px 8px', borderRadius: 4, fontSize: 11, minWidth: 56, textAlign: 'center', color: 'var(--cyan)' }}>{k}</span>
                    <span style={{ color: 'var(--ink-soft)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </NxCard>
            <NxCard style={{ padding: 14, flex: 1, overflow: 'hidden' }}>
              <span className="nx-h" style={{ fontSize: 12 }}>{t('RECENT_LOG')}</span>
              <div style={{ marginTop: 8, overflow: 'auto', maxHeight: '100%' }}>
                {sessionLog.length === 0 && (
                  <div className="nx-overline" style={{ color: 'var(--ink-mute)', textAlign: 'center', marginTop: 16 }}>
                    // まだ回答がありません
                  </div>
                )}
                {sessionLog.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(118,138,220,0.1)', fontSize: 13 }}>
                    <NxIcon kind={entry.correct ? 'check' : 'x'} size={14} color={entry.correct ? 'var(--green)' : 'var(--red)'} glow />
                    <span style={{ flex: 1 }}>{entry.word}</span>
                    <span className="nx-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{(entry.responseMs / 1000).toFixed(1)}s</span>
                    <span className="nx-mono" style={{ color: entry.correct ? 'var(--green)' : 'var(--ink-mute)' }}>{entry.correct ? '+1 XP' : '+0'}</span>
                  </div>
                ))}
              </div>
            </NxCard>
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`${t('PLAY')} · ${t('PLAY_SUB')}`}
        sub={`${reverse ? 'JA → EN' : 'EN → JA'} · ${quizPool.length} ${t('ENTRIES')}${tagFilter ? ` · ${tagFilter}` : ''}`}
        left={<div onClick={() => onNav('maps')} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>}
        right={<div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}><NxIcon kind="settings" size={18} color="var(--ink-soft)" /></div>}
      />
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <NxTag cyan>LV·{String(level).padStart(2, '0')}</NxTag>
        <NxProgress value={xpPct} style={{ flex: 1 }} />
        <span className="nx-mono">{xp}/{maxXp} XP</span>
      </div>
      {allTags.length > 0 && (
        <div style={{ padding: '6px 0 0' }}>
          {tagFilterBar}
        </div>
      )}
      <div style={{ padding: '6px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-mono">{t('SESSION')} {sessionLog.length} ANS</span>
        <span className="nx-mono" style={{ color: 'var(--amber)' }}>▲ {stats.currentStreak} {t('STREAK')}</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="cyan" bracket scan style={{ padding: '24px 18px', textAlign: 'center', flexShrink: 0 }}>
          <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')}</div>
          <div className="nx-h glow" style={{ fontSize: 44, marginTop: 8, letterSpacing: '0.02em', lineHeight: 1.1 }}>{queryText}</div>
          {wordInfo}
        </NxCard>
        <div className="nx-overline" style={{ textAlign: 'center', color: 'var(--ink-mute)' }}>
          {reverse ? t('PICK_WORD') : t('PICK_MEANING')}
        </div>
        {choiceButtons(false)}
      </div>
      <NxTabBar active="home" onNav={onNav} />
    </div>
  );
}
