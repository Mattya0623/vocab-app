'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT, useI18n } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import type { Screen, Word } from '@/types';

const GOLD = 'var(--amber)';
const GOLD_SHADOW = '0 0 14px var(--amber)';

interface MasterModeScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

type Phase = 'select' | 'quiz' | 'fail' | 'success';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(tagWords: Word[]): Word[] {
  return [...shuffle(tagWords), ...shuffle(tagWords), ...shuffle(tagWords)];
}

function buildChoices(current: Word, allWords: Word[], reverse: boolean): string[] {
  const correct = reverse ? current.word : current.meaning;
  const pool    = shuffle(allWords.filter(w => w.id !== current.id))
    .slice(0, 3)
    .map(w => reverse ? w.word : w.meaning);
  return shuffle([correct, ...pool]);
}

function fmtMs(ms: number) {
  const s = ms / 1000;
  return s >= 60 ? `${Math.floor(s / 60)}m ${(s % 60).toFixed(1)}s` : `${s.toFixed(1)}s`;
}

export function MasterModeScreen({ onNav, desktop }: MasterModeScreenProps) {
  const t    = useT();
  const { reverse } = useI18n();
  const { words, masteredTags, masterTag } = useApp();

  const [phase,       setPhase]       = useState<Phase>('select');
  const [activeTag,   setActiveTag]   = useState('');
  const [queue,       setQueue]       = useState<Word[]>([]);
  const [idx,         setIdx]         = useState(0);
  const [choices,     setChoices]     = useState<string[]>([]);
  const [elapsed,     setElapsed]     = useState(0);
  const [mistakes,    setMistakes]    = useState(0);
  const [failReason,  setFailReason]  = useState('');

  const startTimeRef    = useRef(0);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    words.forEach(w => w.tags?.forEach(tg => s.add(tg)));
    return [...s].sort();
  }, [words]);

  // Tick timer while in quiz phase
  useEffect(() => {
    if (phase !== 'quiz') {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startQuiz = (tag: string) => {
    const tagWords = words.filter(w => w.tags?.includes(tag));
    if (tagWords.length < 2) return; // need at least 2 for choice variety
    const q = buildQueue(tagWords);
    const c = buildChoices(q[0], words, reverse);
    setActiveTag(tag);
    setQueue(q);
    setIdx(0);
    setChoices(c);
    setElapsed(0);
    setMistakes(0);
    startTimeRef.current = Date.now();
    setPhase('quiz');
  };

  const handleAnswer = (choiceIdx: number) => {
    const current   = queue[idx];
    const correct   = reverse ? current.word : current.meaning;
    const chosen    = choices[choiceIdx];
    const isCorrect = chosen === correct;

    if (!isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 3) {
        setFailReason('wrong');
        setPhase('fail');
        return;
      }
      // Still alive — advance to next question
      const nextIdx = idx + 1;
      if (nextIdx >= queue.length) {
        // Finished all questions but had too many mistakes — shouldn't reach here (caught above)
        setFailReason('wrong');
        setPhase('fail');
        return;
      }
      setIdx(nextIdx);
      setChoices(buildChoices(queue[nextIdx], words, reverse));
      return;
    }

    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) {
      // All questions done — check time
      const totalMs     = Date.now() - startTimeRef.current;
      const n           = queue.length / 3;
      const timeLimitMs = n * 4000;
      if (totalMs > timeLimitMs) {
        setElapsed(totalMs);
        setFailReason('slow');
        setPhase('fail');
      } else {
        setElapsed(totalMs);
        masterTag(activeTag);
        setPhase('success');
      }
      return;
    }

    setIdx(nextIdx);
    setChoices(buildChoices(queue[nextIdx], words, reverse));
  };

  const retry = () => startQuiz(activeTag);
  const exit  = () => { setPhase('select'); setActiveTag(''); };

  // ── SELECT PHASE ────────────────────────────────────────────────────────
  const selectContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {allTags.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
          <div style={{ fontSize: 32 }}>🏷️</div>
          <div className="nx-overline" style={{ marginTop: 8 }}>タグが見つかりません</div>
          <div className="nx-mono" style={{ marginTop: 4, fontSize: 11 }}>単語にタグを追加してください</div>
        </div>
      )}
      {allTags.map(tag => {
        const tagWords  = words.filter(w => w.tags?.includes(tag));
        const n         = tagWords.length;
        const mastered  = masteredTags.includes(tag);
        const timeLimitS = (n * 4).toFixed(0);
        const canStart  = n >= 2;
        const c         = mastered ? GOLD : 'var(--cyan)';
        return (
          <div key={tag}
            onClick={() => canStart && startQuiz(tag)}
            style={{
              padding: desktop ? '14px 18px' : '12px 16px',
              borderRadius: 10,
              border: `1px solid ${mastered ? 'rgba(255,210,92,0.5)' : 'rgba(92,232,255,0.3)'}`,
              background: mastered ? 'rgba(255,210,92,0.06)' : 'rgba(92,232,255,0.04)',
              boxShadow: mastered ? `0 0 20px -8px ${GOLD}` : 'none',
              cursor: canStart ? 'pointer' : 'default',
              opacity: canStart ? 1 : 0.45,
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.2s',
            }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>{mastered ? '🏆' : '🏷️'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="nx-h" style={{ fontSize: 14, color: c, textShadow: mastered ? GOLD_SHADOW : undefined }}>
                {tag}
              </div>
              <div className="nx-overline" style={{ marginTop: 2, fontSize: 9 }}>
                {n}語 · 3×{n}問 · ミス3回まで · {timeLimitS}s以内
              </div>
            </div>
            {mastered ? (
              <NxTag amber>MASTERED</NxTag>
            ) : (
              <NxIcon kind="arrow" size={14} color="var(--ink-mute)" />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── QUIZ PHASE ──────────────────────────────────────────────────────────
  const current       = queue[idx];
  const n             = queue.length / 3;
  const timeLimitMs   = n * 4000;
  const timePct       = Math.min(100, Math.round((elapsed / timeLimitMs) * 100));
  const timeOver      = elapsed > timeLimitMs;
  const queryText     = current ? (reverse ? current.meaning : current.word) : '';

  // Auto-fail if time runs out
  useEffect(() => {
    if (phase === 'quiz' && timeOver) {
      setFailReason('slow');
      setPhase('fail');
    }
  }, [phase, timeOver]);

  const quizContent = current && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: desktop ? 16 : 12, height: '100%' }}>
      {/* Progress + timer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="nx-mono" style={{ fontSize: 11 }}>
            {idx + 1} / {queue.length}
            <span style={{ marginLeft: 8, color: 'var(--ink-mute)' }}>全問連続正解必須</span>
          </span>
          <span className="nx-mono" style={{ fontSize: 11, color: timePct > 80 ? 'var(--red)' : 'var(--amber)' }}>
            {fmtMs(elapsed)} / {fmtMs(timeLimitMs)}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(118,138,220,0.15)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${timePct}%`,
            background: timePct > 80
              ? 'linear-gradient(90deg,var(--amber),var(--red))'
              : 'linear-gradient(90deg,var(--amber),var(--amber)88)',
            boxShadow: `0 0 8px var(--amber)`,
            borderRadius: 2, transition: 'width 0.1s',
          }} />
        </div>
        <NxProgress value={Math.round(((idx) / queue.length) * 100)} thin />
      </div>

      {/* Question card */}
      <NxCard bracket="amber" scan style={{
        flex: 1, padding: desktop ? 36 : '24px 18px',
        textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div className="nx-overline" style={{ color: GOLD }}>// QUERY</div>
        <div className="nx-h glow" style={{
          fontSize: desktop ? 64 : 44, marginTop: 10, lineHeight: 1.1, letterSpacing: '0.02em',
          color: GOLD, textShadow: GOLD_SHADOW,
        }}>{queryText}</div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 6 }}>
          <NxTag amber>{activeTag}</NxTag>
          <NxTag amber>ATT {current.attempts}</NxTag>
        </div>
      </NxCard>

      {/* Choices */}
      <div style={{ display: desktop ? 'grid' : 'flex', gridTemplateColumns: desktop ? '1fr 1fr' : undefined, flexDirection: desktop ? undefined : 'column', gap: desktop ? 12 : 10 }}>
        {choices.map((c, i) => (
          <NxBtn key={i} choice onClick={() => handleAnswer(i)}
            style={{ padding: desktop ? '18px 16px' : undefined, fontSize: desktop ? 17 : undefined }}>
            <span style={{
              width: desktop ? 30 : 24, height: desktop ? 30 : 24,
              border: '1px solid rgba(255,210,92,0.5)', borderRadius: desktop ? 6 : 4,
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--mono)', fontSize: 11, color: GOLD,
              marginRight: desktop ? 10 : 4, flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ flex: 1 }}>{c}</span>
          </NxBtn>
        ))}
      </div>
    </div>
  );

  // ── FAIL PHASE ──────────────────────────────────────────────────────────
  const failContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 16px rgba(255,92,122,0.6))' }}>💥</div>
      <div className="nx-h" style={{ fontSize: 32, color: 'var(--red)', textShadow: '0 0 20px var(--red)' }}>FAILED</div>
      <div className="nx-overline" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
        {failReason === 'wrong'
          ? '不正解がありました。全問連続正解が必要です。'
          : `時間超過。${fmtMs(elapsed)} / 制限 ${fmtMs(n * 2500)}`}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <NxBtn onClick={retry} style={{ color: GOLD, borderColor: 'rgba(255,210,92,0.4)' }}>もう一度</NxBtn>
        <NxBtn onClick={exit}>タグ選択に戻る</NxBtn>
      </div>
    </div>
  );

  // ── SUCCESS PHASE ────────────────────────────────────────────────────────
  const successContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 56, filter: `drop-shadow(0 0 20px ${GOLD})` }}>🏆</div>
      <div className="nx-h" style={{ fontSize: 32, color: GOLD, textShadow: GOLD_SHADOW }}>MASTERED!</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <NxTag amber>{activeTag}</NxTag>
        <NxTag amber>{fmtMs(elapsed)} / {fmtMs(n * 2500)}</NxTag>
        <NxTag amber>{queue.length}問全正解</NxTag>
      </div>
      <div className="nx-overline" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
        このタグはゴールドに昇格しました
      </div>
      <NxBtn onClick={exit} style={{ color: GOLD, borderColor: 'rgba(255,210,92,0.4)' }}>タグ一覧に戻る</NxBtn>
    </div>
  );

  const title    = t('MASTER_HEAD');
  const subText  = phase === 'quiz'
    ? `${activeTag} · ${idx + 1}/${queue.length}`
    : `${masteredTags.length} MASTERED`;
  const bodyContent = phase === 'select' ? selectContent
    : phase === 'quiz'    ? quizContent
    : phase === 'fail'    ? failContent
    : successContent;

  if (desktop) {
    return (
      <NxDesktopShell active="master" onNav={onNav} title={title} sub={subText}
        right={phase === 'quiz' ? <NxTag amber>▲ {idx}/{queue.length}</NxTag> : undefined}>
        <div style={{ height: '100%', overflow: phase === 'select' ? 'auto' : 'hidden', display: 'flex', flexDirection: 'column' }}>
          {bodyContent}
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={title} sub={subText}
        left={phase !== 'select'
          ? <div onClick={exit} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>
          : <div onClick={() => onNav('home')} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>
        }
      />
      <div style={{ flex: 1, padding: phase === 'select' ? '12px 16px' : '12px 16px', overflow: phase === 'select' ? 'auto' : 'hidden', display: 'flex', flexDirection: 'column' }}>
        {bodyContent}
      </div>
      <NxTabBar active="master" onNav={onNav} />
    </div>
  );
}
