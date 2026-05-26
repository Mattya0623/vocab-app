'use client';
import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';

type GlowColor = 'cyan' | 'mag' | 'lime' | 'red';
type BracketColor = true | 'mag' | 'amber';

interface NxCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  glow?: GlowColor;
  bright?: boolean;
  bracket?: BracketColor;
  scan?: boolean;
  style?: CSSProperties;
}

export function NxCard({ children, glow, bright, bracket, scan, className = '', style, ...rest }: NxCardProps) {
  const cls = [
    'nx-glass',
    glow === 'cyan' && 'glow-cyan',
    glow === 'mag'  && 'glow-mag',
    glow === 'lime' && 'glow-lime',
    glow === 'red'  && 'glow-red',
    bright && 'bright',
    bracket && 'nx-bracket',
    bracket === 'mag' && 'mag',
    bracket === 'amber' && 'amber',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      {bracket && (
        <>
          <span className="nx-br-tl" />
          <span className="nx-br-br" />
        </>
      )}
      {scan && <div className="nx-scan" />}
      {children}
    </div>
  );
}
