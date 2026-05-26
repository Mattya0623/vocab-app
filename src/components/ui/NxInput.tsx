'use client';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface NxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  area?: false;
}
interface NxTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  area: true;
}

export function NxInput(props: NxInputProps | NxTextareaProps) {
  if (props.area) {
    const { area: _, className = '', ...rest } = props as NxTextareaProps;
    return <textarea className={`nx-textarea ${className}`} {...rest} />;
  }
  const { area: _, className = '', ...rest } = props as NxInputProps;
  return <input className={`nx-input ${className}`} {...rest} />;
}
