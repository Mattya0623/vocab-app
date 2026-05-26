'use client';
import type { ReactNode } from 'react';

interface NxMobileHeaderProps {
  title: string;
  sub?: string;
  left?: ReactNode;
  right?: ReactNode;
  glowColor?: 'cyan' | 'mag';
}

export function NxMobileHeader({ title, sub, left, right, glowColor = 'cyan' }: NxMobileHeaderProps) {
  return (
    <div style={{
      padding: '14px 16px 10px',
      borderBottom: '1px solid var(--line)',
      background: 'rgba(4, 5, 26, 0.55)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'grid',
      gridTemplateColumns: '36px 1fr 36px',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
      <div style={{ textAlign: 'center' }}>
        <div className={`nx-h ${glowColor === 'mag' ? 'mag-glow' : 'glow'}`}
          style={{ fontSize: 15, color: glowColor === 'mag' ? 'var(--mag)' : 'var(--cyan)' }}>
          {title}
        </div>
        {sub && <div className="nx-overline" style={{ marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}
