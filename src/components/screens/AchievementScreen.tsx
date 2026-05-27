'use client';
import { useState, useMemo } from 'react';
import { NxCard, NxIcon, NxProgress } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT, useI18n } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { ACHIEVEMENTS, CATEGORY_META, type AchieveCategory, type I18nStr } from '@/data/achievements';
import type { Screen } from '@/types';

interface AchievementScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function AchievementScreen({ onNav, desktop }: AchievementScreenProps) {
  const t = useT();
  const { lang } = useI18n();
  const loc = (s: I18nStr) => s[lang as keyof I18nStr] ?? s.en;
  const { words, stats, level } = useApp();
  const [cat, setCat] = useState<AchieveCategory>('all');

  const ctx = useMemo(() => ({ words, stats, level }), [words, stats, level]);

  const evaluated = useMemo(
    () => ACHIEVEMENTS.map(a => ({ ...a, ...a.check(ctx) })),
    [ctx],
  );

  const filtered = cat === 'all' ? evaluated : evaluated.filter(a => a.category === cat);
  const totalCount   = ACHIEVEMENTS.length;
  const unlockedCount = evaluated.filter(a => a.unlocked).length;

  const catCounts = useMemo(() => {
    const m: Record<string, number> = { all: unlockedCount };
    evaluated.forEach(a => {
      if (a.unlocked) m[a.category] = (m[a.category] ?? 0) + 1;
    });
    return m;
  }, [evaluated, unlockedCount]);

  const catBar = (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
      {CATEGORY_META.map(c => {
        const active = cat === c.id;
        return (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: '5px 11px', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
            border: `1px solid ${active ? 'var(--cyan)' : 'var(--line)'}`,
            background: active ? 'rgba(92,232,255,0.12)' : 'transparent',
            color: active ? 'var(--cyan)' : 'var(--ink-soft)',
            fontFamily: 'var(--mono)', fontSize: 11, whiteSpace: 'nowrap',
            boxShadow: active ? '0 0 10px rgba(92,232,255,0.2)' : 'none',
          }}>
            {c.emoji} {c.label}
            {catCounts[c.id] != null && (
              <span style={{ marginLeft: 5, opacity: 0.65 }}>({catCounts[c.id] ?? 0})</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const cards = filtered.map(a => {
    const pct = Math.min(100, Math.round((a.current / a.max) * 100));
    const glow = a.unlocked ? 'rgba(92,232,255,0.45)' : 'none';
    return (
      <div key={a.id} style={{
        padding: desktop ? 14 : 12,
        borderRadius: 10,
        border: `1px solid ${a.unlocked ? 'rgba(92,232,255,0.35)' : 'rgba(118,138,220,0.18)'}`,
        background: a.unlocked ? 'rgba(92,232,255,0.05)' : 'rgba(14,17,46,0.4)',
        boxShadow: a.unlocked ? `0 0 22px -10px ${glow}` : 'none',
        opacity: a.unlocked ? 1 : 0.6,
        display: 'flex', flexDirection: 'column', gap: 8,
        transition: 'opacity 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0, filter: a.unlocked ? `drop-shadow(0 0 6px rgba(255,255,255,0.4))` : 'grayscale(0.6)' }}>
            {a.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', color: a.unlocked ? 'var(--ink)' : 'var(--ink-soft)' }}>
              {loc(a.name)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2, lineHeight: 1.4 }}>
              {loc(a.desc)}
            </div>
          </div>
          {a.unlocked ? (
            <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--cyan)', display: 'grid', placeItems: 'center', boxShadow: '0 0 8px var(--cyan)', marginTop: 1 }}>
              <NxIcon kind="check" size={11} color="var(--bg-0)" />
            </div>
          ) : (
            <div style={{ flexShrink: 0, opacity: 0.4, marginTop: 1 }}>
              <NxIcon kind="x" size={14} color="var(--ink-mute)" />
            </div>
          )}
        </div>
        {a.type === 'progress' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="nx-mono" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>
                {Math.min(a.current, a.max).toLocaleString()} / {a.max.toLocaleString()}
              </span>
              <span className="nx-mono" style={{ fontSize: 9, color: a.unlocked ? 'var(--cyan)' : 'var(--ink-mute)' }}>
                {pct}%
              </span>
            </div>
            <NxProgress value={pct} thin />
          </div>
        )}
      </div>
    );
  });

  if (desktop) {
    return (
      <NxDesktopShell active="achieve" onNav={onNav}
        title={t('ACHIEVE_HEAD')}
        sub={`${unlockedCount} / ${totalCount} ${t('UNLOCKED')}`}>
        <NxCard style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'rgba(28,34,80,0.4)' }}>
            {catBar}
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
              {cards}
            </div>
          </div>
        </NxCard>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title="ACHIEVEMENTS"
        sub={`${unlockedCount} / ${totalCount} ${t('UNLOCKED')}`}
        left={<span style={{ fontSize: 18, lineHeight: 1 }}>🏆</span>}
      />
      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line)', background: 'rgba(4,5,26,0.4)' }}>
        {catBar}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards}
      </div>
      <NxTabBar active="list" onNav={onNav} />
    </div>
  );
}
