'use client';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import type { Screen } from '@/types';

interface PlayScreenProps {
  onNav: (s: Screen) => void;
  onAnswer: (ok: boolean) => void;
  reverse: boolean;
  desktop?: boolean;
}

export function PlayScreen({ onNav, onAnswer, reverse, desktop }: PlayScreenProps) {
  const t = useT();
  const { level, xp, stats } = useApp();
  const maxXp = 10 * level ** 2;
  const minXp = 10 * (level - 1) ** 2;
  const xpPct = maxXp > minXp ? Math.round(((xp - minXp) / (maxXp - minXp)) * 100) : 0;

  const queryWord = reverse ? 'りんご' : 'apple';
  const queryIpa = reverse ? null : '/ ˈæp.əl /';
  const choices = reverse
    ? ['apple', 'ephemeral', 'gregarious', 'serendipity']
    : ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];

  if (desktop) {
    return (
      <NxDesktopShell active="home" onNav={onNav}
        title={`${t('PLAY')} · ${t('PLAY_SUB')}`}
        sub={`ALL · 142 WORDS · ${reverse ? 'JA → EN' : 'EN → JA'}`}
        right={<>
          <NxTag amber>▲ {stats.currentStreak} {t('STREAK')}</NxTag>
          <NxTag cyan>LV·{String(level).padStart(2, '0')}</NxTag>
          <div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}>
            <NxIcon kind="settings" size={20} color="var(--ink-soft)" />
          </div>
        </>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <NxCard glow="cyan" bracket scan style={{ padding: 36, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')} · CARD #042</div>
              <div className="nx-h glow" style={{ fontSize: 96, marginTop: 14, letterSpacing: '0.02em' }}>{queryWord}</div>
              {queryIpa && <div className="nx-mono" style={{ marginTop: 8, fontSize: 13 }}>{queryIpa}</div>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
                <NxTag>{t('ATT_SHORT')} 12</NxTag>
                <NxTag green>{t('ACC_SHORT')} 92%</NxTag>
                <NxTag amber>POLARIS · N6</NxTag>
              </div>
            </NxCard>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {choices.map((c, i) => (
                <NxBtn key={i} choice onClick={() => onAnswer(i === 0)} style={{ padding: '18px 16px', fontSize: 17 }}>
                  <span style={{ width: 30, height: 30, border: '1px solid var(--line-bright)', borderRadius: 6, display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 12, marginRight: 10, color: 'var(--cyan)', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1 }}>{c}</span>
                </NxBtn>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NxCard style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="nx-h" style={{ fontSize: 12 }}>{t('SESSION')}</span>
                <span className="nx-mono">8 / 50</span>
              </div>
              <NxProgress value={16} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                {[
                  { label: t('CORRECT_LOG'), val: stats.currentStreak, color: 'var(--green)', bg: 'rgba(92,255,157,0.08)', border: 'rgba(92,255,157,0.3)' },
                  { label: t('WRONG_LOG'),   val: 3,                   color: 'var(--red)',   bg: 'rgba(255,92,122,0.08)',  border: 'rgba(255,92,122,0.3)' },
                  { label: t('ACC_SHORT'),   val: '62%',               color: 'var(--cyan)',  bg: 'rgba(92,232,255,0.08)',  border: 'rgba(92,232,255,0.3)' },
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
              <div style={{ marginTop: 8 }}>
                {[['serendipity', true, '+1'], ['lucid', true, '+1'], ['obfuscate', false, '+0'], ['gregarious', false, '+0'], ['pragmatic', true, '+1']].map(([w, ok, xp], i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(118,138,220,0.1)', fontSize: 13 }}>
                    <NxIcon kind={ok ? 'check' : 'x'} size={14} color={ok ? 'var(--green)' : 'var(--red)'} glow />
                    <span style={{ flex: 1 }}>{w}</span>
                    <span className="nx-mono" style={{ color: ok ? 'var(--green)' : 'var(--ink-mute)' }}>{xp} XP</span>
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
        sub={`ALL · 142 WORDS · ${reverse ? 'JA → EN' : 'EN → JA'}`}
        left={<NxIcon kind="back" size={18} color="var(--ink-soft)" />}
        right={<div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}><NxIcon kind="settings" size={18} color="var(--ink-soft)" /></div>}
      />
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <NxTag cyan>LV·{String(level).padStart(2, '0')}</NxTag>
        <NxProgress value={xpPct} style={{ flex: 1 }} />
        <span className="nx-mono">{xp}/{maxXp} XP</span>
      </div>
      <div style={{ padding: '6px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-mono">{t('SESSION')} 8 / 50</span>
        <span className="nx-mono" style={{ color: 'var(--amber)' }}>▲ {stats.currentStreak} {t('STREAK')}</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="cyan" bracket scan style={{ padding: '24px 18px', textAlign: 'center', flexShrink: 0 }}>
          <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')}</div>
          <div className="nx-h glow" style={{ fontSize: 44, marginTop: 8, letterSpacing: '0.02em' }}>{queryWord}</div>
          {queryIpa && <div className="nx-mono" style={{ marginTop: 4 }}>{queryIpa}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            <NxTag>{t('ATT_SHORT')} 12</NxTag>
            <NxTag green>{t('ACC_SHORT')} 92%</NxTag>
            <NxTag mag>POLARIS · N6</NxTag>
          </div>
        </NxCard>
        <div className="nx-overline" style={{ textAlign: 'center', color: 'var(--ink-mute)' }}>
          {reverse ? t('PICK_WORD') : t('PICK_MEANING')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {choices.map((c, i) => (
            <NxBtn key={i} choice onClick={() => onAnswer(i === 0)}>
              <span style={{ width: 24, height: 24, border: '1px solid var(--line-bright)', borderRadius: 4, display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', marginRight: 4, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{c}</span>
            </NxBtn>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="nx-mono">⌃ {t('HINT')}</span>
          <NxBtn ghost style={{ padding: '6px 10px', fontSize: 11 }}>{t('SKIP')} →</NxBtn>
        </div>
      </div>
      <NxTabBar active="home" onNav={onNav} />
    </div>
  );
}
