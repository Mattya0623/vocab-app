'use client';
import { levelColor, levelAscension } from '@/lib/level';

interface LevelAvatarProps {
  lv?: number;
  size?: number;
  withRing?: boolean;
  ascensionEffect?: boolean;
}

export function LevelAvatar({ lv = 1, size = 110, withRing = true, ascensionEffect = true }: LevelAvatarProps) {
  const c = levelColor(lv);
  const asc = ascensionEffect ? levelAscension(lv) : 0;
  const label = String(lv).padStart(2, '0');
  const sparkleCount = asc > 0 ? 6 + Math.min(asc, 4) * 2 : 0;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* outer rainbow halo (ascension) */}
      {asc > 0 && (
        <div style={{
          position: 'absolute',
          inset: -Math.max(8, Math.round(size * 0.1)),
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #5ce8ff, #ff5ce0, #a079ff, #a6ff5c, #ffd25c, #ff5c7a, #5ce8ff)',
        }} className="nx-spin nx-halo-pulse" />
      )}

      {/* sparkles */}
      {Array.from({ length: sparkleCount }).map((_, i) => {
        const angle = (i * 360 / sparkleCount) * Math.PI / 180;
        const r = size * 0.62;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const s = 4 + (i % 3);
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2,
            transform: `translate(${x}px, ${y}px)`,
            background: '#fff', borderRadius: '50%',
            boxShadow: `0 0 8px #fff, 0 0 16px ${c}`,
            animation: `nx-sparkle ${2 + (i % 4) * 0.4}s ease-in-out ${(i * 0.18) % 2}s infinite`,
          }} />
        );
      })}

      {/* ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        padding: Math.max(2, Math.round(size * 0.03)),
        background: asc > 0
          ? 'conic-gradient(from 220deg, #5ce8ff, #ff5ce0, #a079ff, #a6ff5c, #ffd25c, #ff5c7a, #5ce8ff)'
          : `linear-gradient(135deg, ${c}, ${c}66)`,
        boxShadow: withRing ? `0 0 ${Math.round(size * 0.3)}px ${c}` : 'none',
        boxSizing: 'border-box',
      }} className={asc > 0 ? 'nx-spin-fast' : ''}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'var(--bg-0)',
          display: 'grid', placeItems: 'center',
          boxSizing: 'border-box',
        }} className={asc > 0 ? 'nx-spin-rev' : ''}>
          <div style={{
            display: 'grid', placeItems: 'center', width: '100%', height: '100%',
            animation: asc > 0 ? 'nx-rotate 14s linear infinite reverse' : 'none',
          }}>
            <div style={{
              fontFamily: 'var(--display)', fontWeight: 900,
              color: c, textShadow: `0 0 ${Math.round(size * 0.16)}px ${c}`,
              fontSize: Math.round(size * 0.42), lineHeight: 1,
            }}>{label}</div>
          </div>
        </div>
      </div>

      {/* ascension count badge */}
      {asc > 0 && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          background: 'var(--bg-0)', border: `1px solid ${c}`, borderRadius: 10,
          padding: '2px 6px',
          fontFamily: 'var(--display)', fontSize: Math.max(8, Math.round(size * 0.09)),
          fontWeight: 900, letterSpacing: '0.06em',
          color: c, textShadow: `0 0 6px ${c}`,
          boxShadow: `0 0 12px ${c}`,
          zIndex: 2,
        }}>★{asc}</div>
      )}
    </div>
  );
}
