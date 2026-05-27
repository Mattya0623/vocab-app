'use client';
import { useState } from 'react';
import { NxBtn, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import type { Screen } from '@/types';

interface TimerScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

const PRESETS = [
  { label: '1m',  secs: 60 },
  { label: '5m',  secs: 300 },
  { label: '10m', secs: 600 },
  { label: '25m', secs: 1500 },
  { label: '30m', secs: 1800 },
  { label: '1h',  secs: 3600 },
  { label: '2h',  secs: 7200 },
  { label: '3h',  secs: 10800 },
  { label: '6h',  secs: 21600 },
];

function fmt(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerScreen({ onNav, desktop }: TimerScreenProps) {
  const t = useT();
  const { timerTotal, timerRemaining, timerRunning, timerDone, timerStart, timerPause, timerReset, timerSet } = useApp();

  // Custom input lives here — it's transient UI state, not worth persisting
  const [customH, setCustomH] = useState('');
  const [customM, setCustomM] = useState('');
  const [customS, setCustomS] = useState('');
  const [justSet, setJustSet] = useState(false);

  const selectPreset = (secs: number) => {
    timerSet(secs);
    setCustomH('');
    setCustomM('');
    setCustomS('');
    setJustSet(false);
  };

  const applyCustom = () => {
    const h = Math.max(0, parseInt(customH, 10) || 0);
    const m = Math.max(0, parseInt(customM, 10) || 0);
    const s = Math.max(0, parseInt(customS, 10) || 0);
    const secs = Math.min(h * 3600 + m * 60 + s, 21600);
    if (secs < 1) return; // nothing entered
    timerSet(secs);
    setJustSet(true);
    setTimeout(() => setJustSet(false), 1200);
  };

  const progress = timerTotal > 0 ? timerRemaining / timerTotal : 0;
  const R = 90;
  const circ = 2 * Math.PI * R;
  const dash = circ * progress;

  const ring = (
    <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }}>
      <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(118,138,220,0.15)" strokeWidth="10" />
      <circle
        cx="110" cy="110" r={R}
        fill="none"
        stroke={timerDone ? 'var(--green)' : 'var(--cyan)'}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset="0"
        transform="rotate(-90 110 110)"
        style={{
          filter: `drop-shadow(0 0 8px ${timerDone ? 'var(--green)' : 'var(--cyan)'})`,
          transition: 'stroke-dasharray 0.9s linear',
        }}
      />
      <text
        x="110" y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={timerDone ? 'var(--green)' : 'var(--ink)'}
        style={{ fontFamily: 'var(--mono)', fontSize: timerRemaining >= 3600 ? 26 : 34, fontWeight: 700, letterSpacing: '0.04em' }}
      >
        {fmt(timerRemaining)}
      </text>
      {timerDone ? (
        <text x="110" y="134" textAnchor="middle" fill="var(--green)"
          style={{ fontFamily: 'var(--display)', fontSize: 13, letterSpacing: '0.18em' }}>
          {t('TIMER_DONE')}
        </text>
      ) : (
        <text x="110" y="134" textAnchor="middle" fill="var(--ink-mute)"
          style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em' }}>
          {timerRunning ? '// RUNNING' : fmt(timerTotal) + ' total'}
        </text>
      )}
    </svg>
  );

  const controls = (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {!timerRunning && !timerDone && (
        <NxBtn primary onClick={timerStart} style={{ minWidth: 80 }}>
          <NxIcon kind="bolt" size={14} /> {t('TIMER_START')}
        </NxBtn>
      )}
      {timerRunning && (
        <NxBtn ghost onClick={timerPause} style={{ minWidth: 80 }}>
          {t('TIMER_PAUSE')}
        </NxBtn>
      )}
      {(timerRunning || timerDone || timerRemaining < timerTotal) && (
        <NxBtn ghost onClick={timerReset}>
          {t('TIMER_RESET')}
        </NxBtn>
      )}
    </div>
  );

  const presetRow = (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      {PRESETS.map(p => {
        const active = timerTotal === p.secs && timerRemaining === p.secs && !justSet;
        return (
          <button
            key={p.secs}
            onClick={() => selectPreset(p.secs)}
            style={{
              padding: '5px 12px',
              borderRadius: 4,
              border: `1px solid ${active ? 'var(--cyan)' : 'var(--line)'}`,
              background: active ? 'rgba(92,232,255,0.12)' : 'transparent',
              color: active ? 'var(--cyan)' : 'var(--ink-soft)',
              fontFamily: 'var(--mono)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: active ? '0 0 8px rgba(92,232,255,0.25)' : 'none',
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: 52,
    padding: '5px 6px',
    background: 'rgba(28,34,80,0.6)',
    border: '1px solid var(--line)',
    borderRadius: 4,
    color: 'var(--ink)',
    fontFamily: 'var(--mono)',
    fontSize: 14,
    textAlign: 'center',
    outline: 'none',
  };

  const customRow = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
      <span className="nx-overline" style={{ marginRight: 4 }}>{t('TIMER_SET')}:</span>
      <input
        type="number" min="0" max="5" placeholder="h"
        value={customH} onChange={e => setCustomH(e.target.value)}
        style={inputStyle}
      />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)', fontSize: 11 }}>h</span>
      <input
        type="number" min="0" max="59" placeholder="m"
        value={customM} onChange={e => setCustomM(e.target.value)}
        style={inputStyle}
      />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)', fontSize: 11 }}>m</span>
      <input
        type="number" min="0" max="59" placeholder="s"
        value={customS} onChange={e => setCustomS(e.target.value)}
        style={inputStyle}
      />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)', fontSize: 11 }}>s</span>
      <NxBtn
        ghost
        onClick={applyCustom}
        style={{
          padding: '5px 12px',
          fontSize: 12,
          ...(justSet ? { borderColor: 'var(--green)', color: 'var(--green)' } : {}),
        }}
      >
        {justSet ? '✓ SET' : 'SET'}
      </NxBtn>
    </div>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="timer" onNav={onNav} title={t('TIMER_HEAD')} sub={t('TIMER_SUB')}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 28 }}>
          <div style={{ width: '100%', maxWidth: 320 }}>{ring}</div>
          {controls}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 420, padding: '0 16px' }}>
            {presetRow}
            {customRow}
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`TIMER · ${t('TIMER_SUB')}`}
        sub={timerDone ? t('TIMER_DONE') : timerRunning ? '// RUNNING' : '// READY'}
        left={<NxIcon kind="clock" size={18} color={timerRunning ? 'var(--cyan)' : 'var(--ink-soft)'} glow={timerRunning} />}
      />
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '16px 20px' }}>
        <div style={{ width: '100%', maxWidth: 280 }}>{ring}</div>
        {controls}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {presetRow}
          {customRow}
        </div>
      </div>
      <NxTabBar active="timer" onNav={onNav} />
    </div>
  );
}
