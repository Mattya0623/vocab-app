'use client';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon, LevelAvatar } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { levelColor, levelTierName, levelAscension, levelToMinXp, levelToMaxXp, LEVEL_TIER_NAMES, LEVEL_COLORS } from '@/lib/level';
import { NEBULAE } from '@/data/nebulae';
import type { Screen } from '@/types';

interface ProfileScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

const BADGES = [
  { icon: 'flame' as const, label: 'STREAK 10', c: 'amber', got: true },
  { icon: 'medal' as const, label: '100 ANS',   c: 'cyan',  got: true },
  { icon: 'star'  as const, label: 'LV·5',      c: 'mag',   got: true },
  { icon: 'book'  as const, label: '満NEBULA',  c: 'lime',  got: false },
];

export function ProfileScreen({ onNav, desktop }: ProfileScreenProps) {
  const t = useT();
  const { level, xp, stats, username } = useApp();
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
        <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>{t('NEBULAE_BREAKDOWN')}</span>
        <span className="nx-overline" style={{ whiteSpace: 'nowrap', fontSize: 9 }}>{t('FOCUS_ZONE')}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 12, minHeight: 80 }}>
        {NEBULAE.map(b => (
          <div key={b.n} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="nx-mono" style={{ fontSize: 10 }}>{b.count * 4}</span>
            <div style={{ width: '70%', height: Math.min(110, 14 + b.count * 2.4), background: `linear-gradient(180deg, ${b.color}, ${b.color}55)`, border: `1px solid ${b.color}`, boxShadow: `0 0 14px ${b.color}88`, borderRadius: '4px 4px 0 0' }} />
            <div className="nx-h" style={{ fontSize: 10, color: b.color, textShadow: `0 0 6px ${b.color}`, marginTop: 2, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              {b.name.toUpperCase().slice(0, 3)}
            </div>
            <div className="nx-overline" style={{ fontSize: 8, whiteSpace: 'nowrap' }}>N{b.n}</div>
          </div>
        ))}
      </div>
    </NxCard>
  );

  const badgeAndCurve = (
    <NxCard style={{ padding: 12, minWidth: 0, overflow: 'hidden' }}>
      <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('BADGES')}</span>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${desktop ? 5 : 4}, 1fr)`, gap: 6, marginTop: 8 }}>
        {(desktop
          ? [...BADGES, { icon: 'medal' as const, label: '1000', c: 'amber', got: false }]
          : BADGES
        ).map((bg, i) => (
          <div key={i} style={{ padding: desktop ? 6 : 8, textAlign: 'center', borderRadius: desktop ? 6 : 8, border: `1px solid ${bg.got ? `var(--${bg.c})` : 'var(--line)'}`, background: bg.got ? `rgba(255,255,255,0.04)` : 'rgba(18,22,58,0.4)', boxShadow: bg.got ? `0 0 ${desktop ? 18 : 16}px -8px var(--${bg.c})` : 'none', opacity: bg.got ? 1 : 0.45 }}>
            <NxIcon kind={bg.icon} size={desktop ? 22 : 20} color={bg.got ? `var(--${bg.c})` : 'var(--ink-mute)'} glow={bg.got} />
            <div className="nx-overline" style={{ fontSize: 8, marginTop: 4, color: bg.got ? `var(--${bg.c})` : 'var(--ink-mute)', whiteSpace: 'nowrap' }}>{bg.label}</div>
          </div>
        ))}
      </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gridTemplateRows: 'auto 1fr', gap: 14, height: '100%', minWidth: 0 }}>
          <div style={{ gridColumn: '1 / 2' }}>{heroCard(100, 24)}</div>
          <div style={{ gridColumn: '2 / 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, minWidth: 0 }}>
            {kpiGrid(1)}
          </div>
          <div style={{ gridColumn: '1 / 2' }}>{nebulaChart}</div>
          <div style={{ gridColumn: '2 / 3', minWidth: 0 }}>{badgeAndCurve}</div>
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
