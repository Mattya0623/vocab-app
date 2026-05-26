'use client';
import { NxCard, NxBtn, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { useT } from '@/contexts/I18nContext';
import { NEBULAE } from '@/data/nebulae';
import type { Screen } from '@/types';

interface BoxQuizScreenProps {
  onNav: (s: Screen) => void;
  onAnswer: (ok: boolean) => void;
  onExit: () => void;
  box: number;
  reverse: boolean;
}

export function BoxQuizScreen({ onNav, onAnswer, onExit, box, reverse }: BoxQuizScreenProps) {
  const t = useT();
  const b = NEBULAE[box - 1];
  const queryWord = reverse ? '几帳面な' : 'meticulous';
  const queryIpa  = reverse ? null      : '/ məˈtɪk.jə.ləs /';
  const choices = reverse
    ? ['meticulous', 'obfuscate', 'gregarious', 'lucid']
    : ['几帳面な', '不明瞭にする', '社交的な', '明快な'];

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`${b.name.toUpperCase()} · N${b.n}`}
        sub={`${b.range} · ${b.count} WORDS · ${reverse ? 'JA→EN' : 'EN→JA'}`}
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
        <span className="nx-mono">{t('SESSION')} 3 / 18</span>
        <span className="nx-mono" style={{ color: b.color }}>{b.name.toUpperCase()} · CONTINUOUS</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="mag" bracket="mag" scan style={{ padding: '22px 16px', textAlign: 'center' }}>
          <div className="nx-overline" style={{ color: b.color }}>{t('QUERY')} · 3/18</div>
          <div className="nx-h mag-glow" style={{ fontSize: 38, marginTop: 8, color: b.color }}>{queryWord}</div>
          {queryIpa && <div className="nx-mono" style={{ marginTop: 4 }}>{queryIpa}</div>}
        </NxCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {choices.map((c, i) => (
            <NxBtn key={i} choice onClick={() => onAnswer(i === 0)} style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <span className="nx-mono" style={{ fontSize: 10 }}>{i + 1}</span>
              <span>{c}</span>
            </NxBtn>
          ))}
        </div>
      </div>
      <NxTabBar active="boxes" onNav={onNav} />
    </div>
  );
}
