'use client';
import { useMemo } from 'react';

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number; y: number; r: number;
  bright: boolean; dim: boolean;
  d: number; o: number;
}
interface Line {
  x1: number; y1: number; x2: number; y2: number;
  bright: boolean;
}

interface ConstellationProps {
  density?: number;
  accentLines?: boolean;
  mode?: 'wide' | 'tall';
}

export function Constellation({ density = 1.0, accentLines = true, mode = 'wide' }: ConstellationProps) {
  const { starData, lines } = useMemo(() => {
    const rng = mulberry32(20260527);
    const W = mode === 'wide' ? 1600 : 600;
    const H = mode === 'wide' ? 900  : 1000;
    const count = Math.floor((mode === 'wide' ? 130 : 90) * density);
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      const r = rng();
      arr.push({
        x: rng() * W, y: rng() * H,
        r: r < 0.06 ? 1.6 + rng() * 0.8 : r < 0.35 ? 1.0 + rng() * 0.5 : 0.5 + rng() * 0.4,
        bright: r < 0.06,
        dim: r > 0.7,
        d: 3 + rng() * 5,
        o: 0.4 + rng() * 0.5,
      });
    }

    const ls: Line[] = [];
    if (accentLines) {
      const picks = [10, 38, 70, 95, 60, 25];
      picks.forEach((idx) => {
        if (!arr[idx]) return;
        const seed = arr[idx];
        const others = arr
          .map((s, j) => ({ s, j, d: (s.x - seed.x) ** 2 + (s.y - seed.y) ** 2 }))
          .filter(o => o.j !== idx)
          .sort((a, b) => a.d - b.d)
          .slice(0, 4);
        let prev = seed;
        others.forEach((o) => {
          ls.push({ x1: prev.x, y1: prev.y, x2: o.s.x, y2: o.s.y, bright: idx === 38 || idx === 70 });
          prev = o.s;
        });
      });
    }

    return { starData: { arr, W, H }, lines: ls };
  }, [density, accentLines, mode]);

  return (
    <div className="nx-constellation">
      <svg viewBox={`0 0 ${starData.W} ${starData.H}`} preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => (
          <line key={`l${i}`} className={`nx-line${l.bright ? ' bright' : ''}`}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        {starData.arr.map((s, i) => (
          <circle key={`s${i}`}
            className={`nx-star${s.bright ? ' bright' : s.dim ? ' dim' : ''} nx-twinkle`}
            cx={s.x} cy={s.y} r={s.r}
            style={{ '--d': `${s.d}s`, '--o': s.o } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
