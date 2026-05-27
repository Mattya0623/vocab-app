'use client';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon, LevelAvatar } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { levelColor, levelTierName, levelAscension, levelToMinXp, levelToMaxXp, LEVEL_TIER_NAMES, LEVEL_COLORS } from '@/lib/level';
import { NEBULAE, boxOf } from '@/data/nebulae';
import { ACHIEVEMENTS } from '@/data/achievements';
import type { Screen } from '@/types';

interface ProfileScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function ProfileScreen({ onNav, desktop }: ProfileScreenProps) {
  const t = useT();
  const { level, xp, stats, username, words } = useApp();
  const nebulaWordCounts = NEBULAE.map(b => words.filter(w => boxOf(w.accuracy) === b.n).length);

  const ctx = { words, stats, level };
  const earnedBadges = ACHIEVEMENTS
    .map(a => ({ ...a, ...a.check(ctx) }))
    .filter(a => a.unlocked)
    .slice(0, desktop ? 6 : 4);
  const c = levelColor(level);
  const tierName = levelTierName(level);
  const asc = levelAscension(level);
  const minXp = levelToMinXp(level);
  const maxXp = levelToMaxXp(level);
  const xpPct = maxXp > minXp ? Math.round(((xp - minXp) / (maxXp - minXp)) * 100) : 0;

  const heroCard = (size: number, fontSize: number) => (
    <NxCard glow="mag" bracket="mag" scan style={{ padding: desktop ? 18 : 16, ...(desktop ? { display: 'flex', gap: 18, alignItems: 'center', minWidth: 0 } : {}) }}>
      <div style={{ display: desktop ? 'contents' : 'flex', alignItems: 'center', gap: 14 }}>
        <LevelAvatar lv={level} size={size} />
        <div style={{ flex: 1, minWidth: 0, ...(desktop ? {} : {}) }}>
          {username && (
            <div className="nx-h" style={{ fontSize: fontSize + 2, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 2 }}>
              {username}
            </div>
          )}
          <div className="nx-h mag-glow" style={{ fontSize: fontSize - 4, color: c, textShadow: `0 0 ${desktop ? 12 : 10}px ${c}` }}>{t('RANK_APPRENTICE')}</div>
          <div className="nx-overline" style={{ marginBottom: 8 }}>
            <span style={{ color: c }}>{tierName}</span> · LV·{String(level).padStart(2, '0')}
            {asc > 0 && <> · <span style={{ color: c }}>★ ASCENSION {asc}</span></>}
          </div>
          <NxProgress value={xpPct} mag thick={desktop} />
          <div className="nx-mono" style={{ marginTop: desktop ? 6 : 4, fontSize: 11 }}>
            {xp} / {maxXp} XP · 残り {Math.max(0, maxXp - xp)}
          </div>
        </div>
      </div>
    </NxCard>
  );

  const kpiGrid = (cols: number) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, minWidth: 0 }}>
      {[
        [t('STAT_TOTAL'),      String(stats.totalAttempts), 'cyan'],
        [t('STAT_AVG'),        `${stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0}%`, 'green'],
        [t('STAT_MAX_STREAK'), String(stats.maxStreak),    'amber'],
        [t('STAT_WORDS'),      String(stats.wordsCount),   'mag'],
      ].map(([k, v, cc], i) => (
        <NxCard key={i} style={{ padding: desktop ? 10 : 12, minWidth: 0, overflow: 'hidden' }}
          bracket={cc === 'amber' ? 'amber' : cc === 'mag' ? 'mag' : undefined}>
          <div className="nx-overline" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</div>
          <div className="nx-h" style={{ fontSize: 28, marginTop: 4, lineHeight: 1, color: `var(--${cc})`, textShadow: `0 0 14px var(--${cc})` }}>{v}</div>
        </NxCard>
      ))}
    </div>
  );

  const nebulaChart = (
    <NxCard style={{ padding: 14, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', flex: desktop ? undefined : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>進捗</span>
        <span className="nx-overline" style={{ whiteSpace: 'nowrap', fontSize: 9 }}>{t('FOCUS_ZONE')}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 12, minHeight: 80 }}>
        {NEBULAE.map((b, i) => {
          const count = nebulaWordCounts[i];
          const maxCount = Math.max(...nebulaWordCounts, 1);
          return (
            <div key={b.n} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span className="nx-mono" style={{ fontSize: 10 }}>{count}</span>
              <div style={{ width: '70%', height: Math.max(4, Math.round((count / maxCount) * 90)), background: count > 0 ? `linear-gradient(180deg, ${b.color}, ${b.color}55)` : 'rgba(118,138,220,0.15)', border: `1px solid ${count > 0 ? b.color : 'rgba(118,138,220,0.3)'}`, boxShadow: count > 0 ? `0 0 14px ${b.color}88` : 'none', borderRadius: '4px 4px 0 0' }} />
              <div className="nx-h" style={{ fontSize: 10, color: b.color, textShadow: count > 0 ? `0 0 6px ${b.color}` : 'none', marginTop: 2, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {b.name.toUpperCase().slice(0, 3)}
              </div>
              <div className="nx-overline" style={{ fontSize: 8, whiteSpace: 'nowrap' }}>N{b.n} · {b.range}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, borderTop: '1px solid rgba(118,138,220,0.15)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NEBULAE.map((b, i) => {
          const wCount = nebulaWordCounts[i];
          const attempts = words.filter(w => boxOf(w.accuracy) === b.n).reduce((s, w) => s + w.attempts, 0);
          return (
            <div key={b.n} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 40px 40px', gap: 6, alignItems: 'center', fontSize: 11 }}>
              <span className="nx-overline" style={{ color: b.color, fontSize: 9 }}>N{b.n} · {b.range}</span>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(118,138,220,0.12)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, wCount > 0 ? Math.max(4, Math.round((wCount / Math.max(...nebulaWordCounts, 1)) * 100)) : 0)}%`, background: b.color, boxShadow: wCount > 0 ? `0 0 6px ${b.color}` : 'none', borderRadius: 2, transition: 'width 0.4s' }} />
              </div>
              <span className="nx-mono" style={{ textAlign: 'right', fontSize: 10, color: 'var(--ink-soft)' }}>{wCount}語</span>
              <span className="nx-mono" style={{ textAlign: 'right', fontSize: 10, color: b.color }}>{attempts}回</span>
            </div>
          );
        })}
      </div>
    </NxCard>
  );

  const badgeAndCurve = (
    <NxCard style={{ padding: 12, minWidth: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('BADGES')}</span>
        <span onClick={() => onNav('achieve')} className="nx-clickable nx-overline" style={{ fontSize: 9, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>
          すべて見る →
        </span>
      </div>
      {earnedBadges.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '16px 0', opacity: 0.5 }}>
          <div style={{ fontSize: 24 }}>🔒</div>
          <div className="nx-overline" style={{ marginTop: 6, fontSize: 9 }}>まだアチーブメントがありません</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${desktop ? Math.min(earnedBadges.length, 6) : Math.min(earnedBadges.length, 4)}, 1fr)`, gap: 6, marginTop: 8 }}>
          {earnedBadges.map(bg => (
            <div key={bg.id} style={{ padding: desktop ? 6 : 8, textAlign: 'center', borderRadius: desktop ? 6 : 8, border: '1px solid rgba(92,232,255,0.35)', background: 'rgba(92,232,255,0.05)', boxShadow: '0 0 16px -8px rgba(92,232,255,0.5)' }}>
              <div style={{ fontSize: desktop ? 22 : 20, lineHeight: 1 }}>{bg.emoji}</div>
              <div className="nx-overline" style={{ fontSize: 8, marginTop: 4, color: 'var(--cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bg.name}</div>
            </div>
          ))}
        </div>
      )}
      {desktop && (
        <>
          <div className="nx-divider" style={{ margin: '10px 0' }} />
          <span className="nx-h" style={{ fontSize: 11 }}>{t('LEVEL_CURVE')}</span>
          <div className="nx-overline" style={{ marginTop: 2, fontSize: 9 }}>{t('XP_FORMULA')}</div>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 48, marginTop: 8 }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(lv => {
              const isCurrent = lv === Math.min(level, 12);
              const tierC = LEVEL_COLORS[Math.floor((lv - 1) / 5) % LEVEL_COLORS.length];
              return (
                <div key={lv} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{ height: 4 + lv * 3.2, background: isCurrent ? `linear-gradient(180deg, ${tierC}, ${c})` : tierC + '40', boxShadow: isCurrent ? `0 0 10px ${tierC}` : 'none', borderRadius: 2, border: `1px solid ${tierC}${isCurrent ? '' : '60'}` }} />
                  <div className="nx-overline" style={{ fontSize: 8, marginTop: 2, color: isCurrent ? tierC : 'var(--ink-mute)' }}>L{lv}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </NxCard>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="stats" onNav={onNav}
        title={t('PROFILE_HEAD')}
        sub={`LV·${String(level).padStart(2, '0')} · ${tierName} · ${xp} / ${maxXp} XP${asc > 0 ? ` · ★ ASC ${asc}` : ''}`}
        right={<NxTag amber>▲ {stats.currentStreak} {t('STREAK')}</NxTag>}>
        <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 14, alignItems: 'start' }}>
            <div>{heroCard(100, 24)}</div>
            <div>{kpiGrid(2)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1, minHeight: 280 }}>
            <div style={{ minHeight: 0 }}>{nebulaChart}</div>
            <div style={{ minHeight: 0 }}>{badgeAndCurve}</div>
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('PROFILE')} sub={`LV·${String(level).padStart(2, '0')} · ${tierName}${asc > 0 ? ` · ★${asc}` : ''}`} />
      <div style={{ flex: 1, padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {heroCard(72, 18)}
        {kpiGrid(2)}
        {nebulaChart}
        {badgeAndCurve}
      </div>
      <NxTabBar active="stats" onNav={onNav} />
    </div>
  );
}
