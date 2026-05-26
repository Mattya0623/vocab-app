'use client';
import type { ReactNode } from 'react';
import { NxSideNav } from './NxSideNav';
import type { Screen } from '@/types';

interface NxDesktopShellProps {
  active: Screen;
  onNav: (s: Screen) => void;
  title: string;
  sub?: string;
  right?: ReactNode;
  children: ReactNode;
}

export function NxDesktopShell({ active, onNav, title, sub, right, children }: NxDesktopShellProps) {
  return (
    <div style={{ height: '100%', display: 'flex', position: 'relative' }}>
      <NxSideNav active={active} onNav={onNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <div style={{
          padding: '16px 26px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '1px solid var(--line)',
          background: 'rgba(4,5,26,0.4)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nx-h glow" style={{ fontSize: 22, color: 'var(--cyan)' }}>{title}</div>
            {sub && <div className="nx-overline" style={{ marginTop: 2 }}>{sub}</div>}
          </div>
          {right && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{right}</div>}
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: 24, position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
