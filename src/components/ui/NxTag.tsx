'use client';
import type { ReactNode, CSSProperties } from 'react';

interface NxTagProps {
  children?: ReactNode;
  cyan?: boolean;
  mag?: boolean;
  lime?: boolean;
  amber?: boolean;
  red?: boolean;
  green?: boolean;
  solid?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function NxTag({ children, cyan, mag, lime, amber, red, green, solid, className = '', style, onClick }: NxTagProps) {
  const cls = [
    'nx-tag',
    cyan && 'cyan', mag && 'mag', lime && 'lime',
    amber && 'amber', red && 'red', green && 'green',
    solid && 'solid',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} style={style} onClick={onClick}>
      {children}
    </span>
  );
}
