'use client';
import { Constellation, NxCard, NxBtn, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import type { Screen } from '@/types';

interface EmptyScreenProps {
  onNav: (s: Screen) => void;
  onImport?: () => void;
  desktop?: boolean;
}

export function EmptyScreen({ onNav, onImport, desktop }: EmptyScreenProps) {
  const content = (
    <div style={{ height: desktop ? '100%' : undefined, display: 'grid', placeItems: 'center' }}>
      <NxCard glow="cyan" bracket style={{ padding: desktop ? 40 : 28, textAlign: 'center', maxWidth: 460 }}>
        <div style={{ width: 140, height: 140, margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,232,255,0.2) 0%, transparent 70%)' }} />
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <circle cx="50" cy="50" r="30" fill="none" stroke="var(--cyan)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5"/>
            <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="var(--mag)" strokeWidth="0.4" opacity="0.6" transform="rotate(-15 50 50)"/>
            <circle cx="50" cy="50" r="5" fill="var(--cyan)" filter="url(#gBlur)"/>
            <defs><filter id="gBlur"><feGaussianBlur stdDeviation="2"/></filter></defs>
          </svg>
          <div className="nx-pulse" style={{ inset: '32%' }} />
        </div>
        <div className="nx-h glow" style={{ fontSize: 24, marginTop: 12 }}>NO SIGNAL</div>
        <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
          まだ単語がありません。<br />CSV をペーストして、銀河を起動しましょう。
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <NxBtn primary lg onClick={() => onImport?.()}><NxIcon kind="upload" size={16} /> インポート</NxBtn>
        </div>
      </NxCard>
    </div>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="list" onNav={onNav} title="CODEX · 単語管理" sub="EMPTY">
        {content}
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Constellation density={0.7} mode="tall" />
      <NxMobileHeader title="CODEX" sub="EMPTY · NO ENTRIES" />
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {content}
      </div>
      <NxTabBar active="list" onNav={onNav} />
    </div>
  );
}
