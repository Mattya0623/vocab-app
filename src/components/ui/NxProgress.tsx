'use client';
import type { CSSProperties } from 'react';

interface NxProgressProps {
  value?: number;
  max?: number;
  thin?: boolean;
  thick?: boolean;
  amber?: boolean;
  lime?: boolean;
  mag?: boolean;
  style?: CSSProperties;
}

export function NxProgress({ value = 0, max = 100, thin, thick, amber, lime, mag, style }: NxProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const cls = [
    'nx-progress',
    thin && 'thin',
    thick && 'thick',
    amber && 'amber',
    lime && 'lime',
    mag && 'mag',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      <div className="fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
