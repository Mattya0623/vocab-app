'use client';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface NxBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  primary?: boolean;
  mag?: boolean;
  lime?: boolean;
  amber?: boolean;
  red?: boolean;
  green?: boolean;
  ghost?: boolean;
  lg?: boolean;
  block?: boolean;
  choice?: boolean;
  state?: 'correct' | 'wrong';
}

export function NxBtn({
  children, primary, mag, lime, amber, red, green,
  ghost, lg, block, choice, state, className = '', ...rest
}: NxBtnProps) {
  const cls = [
    'nx-btn',
    primary && 'primary',
    mag && 'mag',
    lime && 'lime',
    amber && 'amber',
    red && 'red',
    green && 'green',
    ghost && 'ghost',
    lg && 'lg',
    block && 'block',
    choice && 'choice',
    state === 'correct' && 'correct',
    state === 'wrong'   && 'wrong',
    className,
  ].filter(Boolean).join(' ');

  return <button className={cls} {...rest}>{children}</button>;
}
