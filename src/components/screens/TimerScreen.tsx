'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { NxBtn, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
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

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const tones = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    tones.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  } catch {}
}

function fmt(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerScreen({ onNav, desktop }: TimerScreenProps) {
  const t = useT();
  const [total, setTotal]     = useState(300);   // selected duration
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState(false);
  const [customH, setCustomH] = useState('');
  const [customM, setCustomM] = useState('');
  const [customS, setCustomS] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (done) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          setDone(true);
          playChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [done]);

  const pause = useCallback(() => {
    setRunning(false);
    clearTimer();
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setRunning(false);
    setDone(false);
    setRemaining(total);
  }, [total]);

  const selectPreset = (secs: number) => {
    clearTimer();
    setRunning(false);
    setDone(false);
    setTotal(secs);
    setRemaining(secs);
    setCustomH('');
    setCustomM('');
    setCustomS('');
  };

  const applyCustom = () => {
    const h = parseInt(customH || '0', 10) || 0;
    const m = parseInt(customM || '0', 10) || 0;
    const s = parseInt(customS || '0', 10) || 0;
    const secs = Math.min(Math.max(h * 3600 + m * 60 + s, 60), 21600);
    clearTimer();
    setRunning(false);
    setDone(false);
    setTotal(secs);
    setRemaining(secs);
  };

  useEffect(() => () => clearTimer(), []);

  const progress = total > 0 ? remaining / total : 0;

  // SVG circular ring
  const R = 90;
  const circ = 2 * Math.PI * R;
  const dash = circ * progress;

  const ring = (
    <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }}>
      {/* track */}
      <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(118,138,220,0.15)" strokeWidth="10" />
      {/* progress arc */}
      <circle
        cx="110" cy="110" r={R}
        fill="none"
        stroke={done ? 'var(--green)' : 'var(--cyan)'}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset="0"
        transform="rotate(-90 110 110)"
        style={{ filter: `drop-shadow(0 0 8px ${done ? 'var(--green)' : 'var(--cyan)'})`, transition: 'stroke-dasharray 0.9s linear' }}
      />
      {/* time text */}
      <text
        x="110" y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={done ? 'var(--green)' : 'var(--ink)'}
        style={{ fontFamily: 'var(--mono)', fontSize: remaining >= 3600 ? 26 : 34, fontWeight: 700, letterSpacing: '0.04em' }}
      >
        {fmt(remaining)}
      </text>
      {done ? (
        <text x="110" y="134" textAnchor="middle" fill="var(--green)" style={{ fontFamily: 'var(--display)', fontSize: 13, letterSpacing: '0.18em' }}>
          {t('TIMER_DONE')}
        </text>
      ) : (
        <text x="110" y="134" textAnchor="middle" fill="var(--ink-mute)" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em' }}>
          {fmt(total)} total
        </text>
      )}
    </svg>
  );

  const controls = (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
      {!running && !done && (
        <NxBtn primary onClick={start} style={{ minWidth: 80 }}>
          <NxIcon kind="bolt" size={14} /> {t('TIMER_START')}
        </NxBtn>
      )}
      {running && (
        <NxBtn ghost onClick={pause} style={{ minWidth: 80 }}>
          {t('TIMER_PAUSE')}
        </NxBtn>
      )}
      {(running || done || remaining < total) && (
        <NxBtn ghost onClick={reset}>
          {t('TIMER_RESET')}
        </NxBtn>
      )}
    </div>
  );

  const presetRow = (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      {PRESETS.map(p => (
        <button
          key={p.secs}
          onClick={() => selectPreset(p.secs)}
          style={{
            padding: '5px 12px',
            borderRadius: 4,
            border: `1px solid ${total === p.secs && remaining === p.secs ? 'var(--cyan)' : 'var(--line)'}`,
            background: total === p.secs && remaining === p.secs ? 'rgba(92,232,255,0.12)' : 'transparent',
            color: total === p.secs && remaining === p.secs ? 'var(--cyan)' : 'var(--ink-soft)',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: total === p.secs && remaining === p.secs ? '0 0 8px rgba(92,232,255,0.25)' : 'none',
          }}
        >
          {p.label}
        </button>
      ))}
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
  };

  const customRow = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
      <span className="nx-overline" style={{ marginRight: 4 }}>{t('TIMER_SET')}:</span>
      <input type="number" min="0" max="5" placeholder="0h" value={customH} onChange={e => setCustomH(e.target.value)} style={inputStyle} />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)' }}>h</span>
      <input type="number" min="0" max="59" placeholder="0m" value={customM} onChange={e => setCustomM(e.target.value)} style={inputStyle} />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)' }}>m</span>
      <input type="number" min="0" max="59" placeholder="0s" value={customS} onChange={e => setCustomS(e.target.value)} style={inputStyle} />
      <span className="nx-mono" style={{ color: 'var(--ink-mute)' }}>s</span>
      <NxBtn ghost onClick={applyCustom} style={{ padding: '5px 12px', fontSize: 12 }}>SET</NxBtn>
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
        sub={done ? t('TIMER_DONE') : running ? '// RUNNING' : '// READY'}
        left={<NxIcon kind="clock" size={18} color="var(--ink-soft)" />}
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
