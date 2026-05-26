'use client';
import { Constellation, NxCard, NxBtn, NxTag, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { NEBULAE } from '@/data/nebulae';
import { SAMPLE_WORDS } from '@/data/words';
import { boxOf } from '@/data/nebulae';
import type { Screen } from '@/types';

const POSITIONS_MOBILE = [
  { x: 8, y: 78 }, { x: 22, y: 60 }, { x: 36, y: 46 }, { x: 50, y: 38 },
  { x: 64, y: 32 }, { x: 78, y: 22 }, { x: 92, y: 12 },
];
const POSITIONS_DESKTOP = [
  { x: 8, y: 82 }, { x: 21, y: 64 }, { x: 34, y: 50 }, { x: 47, y: 40 },
  { x: 60, y: 32 }, { x: 73, y: 24 }, { x: 85, y: 18 },
];

interface NebulaeScreenProps {
  onNav: (s: Screen) => void;
  onPick: (n: number) => void;
  selected: number;
  desktop?: boolean;
}

export function NebulaeScreen({ onNav, onPick, selected, desktop }: NebulaeScreenProps) {
  const t = useT();
  const sel = NEBULAE[selected - 1];
  const positions = desktop ? POSITIONS_DESKTOP : POSITIONS_MOBILE;

  const StarMap = ({ height }: { height: number }) => (
    <div style={{
      position: 'relative', height, margin: desktop ? 0 : '14px 14px 8px',
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--line)',
      background: 'radial-gradient(ellipse at 20% 90%, rgba(255,92,224,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(92,232,255,0.18) 0%, transparent 60%), #07091e',
    }}>
      <Constellation density={desktop ? 2.2 : 1.6} mode="wide" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="armGrad" x1="0" y1="100%" x2="100%" y2="0">
            <stop offset="0%" stopColor="#ff5ce0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#5ce8ff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          d={desktop
            ? "M 8 82 Q 22 54, 34 50 T 60 32 T 85 18"
            : "M 8 78 Q 24 50, 36 46 T 64 32 T 92 12"}
          fill="none" stroke="url(#armGrad)" strokeWidth="0.4" strokeDasharray="1 1.5" />
      </svg>
      {NEBULAE.map((b, i) => {
        const p = positions[i];
        const r = desktop ? 9 + b.n * 1.6 : 6 + b.n * 1.2;
        const on = b.n === selected;
        return (
          <div key={b.n} onClick={() => onPick(b.n)} className="nx-clickable"
            style={{ position: 'absolute', left: `calc(${p.x}% - ${r}px)`, top: `calc(${p.y}% - ${r}px)`, width: r * 2, height: r * 2 }}>
            <div style={{ position: 'absolute', inset: desktop ? -16 : -8, borderRadius: '50%', background: `radial-gradient(circle, ${b.color}55 0%, transparent 70%)`, filter: on && !desktop ? 'brightness(1.6)' : 'none' }} />
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: b.color, boxShadow: `0 0 ${on ? (desktop ? 32 : 24) : (desktop ? 14 : 10)}px ${b.color}` }} />
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: desktop ? 10 : 8, whiteSpace: 'nowrap', textAlign: 'center', fontFamily: 'var(--display)' }}>
              <div style={{ fontSize: desktop ? 13 : 10, letterSpacing: '0.1em', color: on ? b.color : 'var(--ink-soft)', textShadow: on ? `0 0 8px ${b.color}` : 'none' }}>
                {b.name.toUpperCase()}
              </div>
              {desktop && <div className="nx-overline" style={{ fontSize: 9, marginTop: 2 }}>{b.range}</div>}
            </div>
          </div>
        );
      })}
      {desktop && (
        <>
          <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span><span style={{ color: 'var(--mag)' }}>◄</span> {t('WEAK')}</span>
            <span style={{ color: 'var(--cyan)' }}>{t('STRONG')} ►</span>
          </div>
          <div style={{ position: 'absolute', right: 14, top: 14 }}>
            <NxTag cyan>{t('STAR_MAP')}</NxTag>
          </div>
        </>
      )}
    </div>
  );

  if (desktop) {
    const wordsInSel = SAMPLE_WORDS.filter(w => boxOf(w.accuracy) === selected || (selected === 4 && boxOf(w.accuracy) === 5)).slice(0, 6);
    return (
      <NxDesktopShell active="boxes" onNav={onNav} title={t('NEBULAE_HEAD')} sub={t('NEBULAE_SUBHEAD')}
        right={<NxBtn primary onClick={() => onPick(selected)}><NxIcon kind="bolt" size={14} /> {t('PLAY_FROM_CLUSTER')} →</NxBtn>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, height: '100%' }}>
          <NxCard bracket style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
            <StarMap height={0} />
            <div style={{ position: 'absolute', inset: 0 }}><StarMap height={0} /></div>
          </NxCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NxCard glow="mag" bracket="mag" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: sel.color, boxShadow: `0 0 22px ${sel.color}`, display: 'grid', placeItems: 'center', fontFamily: 'var(--display)', fontWeight: 900, color: 'var(--bg-0)', fontSize: 22 }}>N{sel.n}</div>
                <div>
                  <div className="nx-h" style={{ fontSize: 26, color: sel.color, textShadow: `0 0 12px ${sel.color}` }}>{sel.name.toUpperCase()}</div>
                  <div className="nx-overline">{sel.range} · {sel.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <NxTag>{sel.count} WORDS</NxTag>
                <NxTag cyan>累計 72 ANS</NxTag>
                <NxTag green>AVG 34%</NxTag>
              </div>
              <NxBtn primary lg block style={{ marginTop: 14 }} onClick={() => onPick(selected)}>
                <NxIcon kind="bolt" size={14} /> {t('PLAY_FROM_CLUSTER')}
              </NxBtn>
            </NxCard>
            <NxCard style={{ padding: 14, flex: 1, overflow: 'hidden' }}>
              <span className="nx-h" style={{ fontSize: 12 }}>{t('WORDS_EXCERPT')}</span>
              <div style={{ marginTop: 8 }}>
                {wordsInSel.map((w, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 50px', gap: 10, padding: '6px 0', fontSize: 13, borderBottom: '1px solid rgba(118,138,220,0.1)' }}>
                    <span style={{ fontWeight: 600 }}>{w.word}</span>
                    <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                    <span className="nx-mono" style={{ textAlign: 'right', color: sel.color }}>{w.accuracy}%</span>
                  </div>
                ))}
              </div>
              <div className="nx-overline" style={{ marginTop: 6 }}>{t('MORE_OTHERS')}</div>
            </NxCard>
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title="NEBULAE" sub="LEITNER · 7 BOXES" glowColor="mag" right={<NxIcon kind="search" size={18} color="var(--ink-soft)" />} />
      <StarMap height={280} />
      <div style={{ padding: '4px 14px 10px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NxCard glow="mag" bracket="mag" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: sel.color, boxShadow: `0 0 18px ${sel.color}`, display: 'grid', placeItems: 'center', fontFamily: 'var(--display)', fontWeight: 900, color: 'var(--bg-0)', fontSize: 18 }}>{sel.n}</div>
            <div style={{ flex: 1 }}>
              <div className="nx-h" style={{ fontSize: 20, color: sel.color, textShadow: `0 0 10px ${sel.color}` }}>{sel.name.toUpperCase()}</div>
              <div className="nx-overline">N{sel.n} · {sel.range} · {sel.desc}</div>
            </div>
            <NxTag>{sel.count}</NxTag>
          </div>
          <NxBtn primary lg block style={{ marginTop: 12 }} onClick={() => onPick(selected)}>
            <NxIcon kind="bolt" size={14} /> {sel.name.toUpperCase()} で出題
          </NxBtn>
        </NxCard>
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NEBULAE.filter(b => b.n !== selected).map((b) => (
            <div key={b.n} className="nx-clickable" onClick={() => onPick(b.n)}
              style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto auto', gap: 10, alignItems: 'center', padding: '6px 12px', background: 'rgba(18,22,58,0.5)', border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: b.color, boxShadow: `0 0 8px ${b.color}`, justifySelf: 'center' }} />
              <div className="nx-h" style={{ fontSize: 12, color: b.color }}>{b.name.toUpperCase()}</div>
              <span className="nx-mono">{b.range}</span>
              <NxTag>{b.count}</NxTag>
            </div>
          ))}
        </div>
      </div>
      <NxTabBar active="boxes" onNav={onNav} />
    </div>
  );
}
