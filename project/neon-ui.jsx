/* neon-ui.jsx — primitives + animated constellation background */

// ─── Constellation background ───
// Deterministic star field + lines drawn on an SVG that fills its container.
function Constellation({ density = 1.0, accentLines = true, mode = 'wide' }) {
  // We seed deterministically so reloads don't churn the layout
  const stars = React.useMemo(() => {
    const rng = mulberry32(20260527);
    const W = mode === 'wide' ? 1600 : 600;
    const H = mode === 'wide' ? 900  : 1000;
    const count = Math.floor((mode === 'wide' ? 130 : 90) * density);
    const arr = [];
    for (let i = 0; i < count; i++) {
      const r = rng();
      arr.push({
        x: rng() * W, y: rng() * H,
        r: r < 0.06 ? 1.6 + rng() * 0.8 : r < 0.35 ? 1.0 + rng() * 0.5 : 0.5 + rng() * 0.4,
        bright: r < 0.06, dim: r > 0.7,
        d: 3 + rng() * 5, o: 0.4 + rng() * 0.5,
      });
    }
    return { arr, W, H };
  }, [density, mode]);

  // Pick a few small constellations — pick a star, then connect 3-5 nearest neighbours
  const lines = React.useMemo(() => {
    if (!accentLines) return [];
    const { arr } = stars;
    const ls = [];
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
    return ls;
  }, [stars, accentLines]);

  return (
    <div className="nx-constellation">
      <svg viewBox={`0 0 ${stars.W} ${stars.H}`} preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => (
          <line key={'l'+i} className={'nx-line' + (l.bright ? ' bright' : '')}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        {stars.arr.map((s, i) => (
          <circle key={'s'+i}
            className={'nx-star' + (s.bright ? ' bright' : s.dim ? ' dim' : '') + ' nx-twinkle'}
            cx={s.x} cy={s.y} r={s.r}
            style={{ '--d': s.d + 's', '--o': s.o }}
          />
        ))}
      </svg>
    </div>
  );
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Card / glass surface ───
function NxCard({ children, glow, bright, bracket, className = '', style = {}, scan, ...rest }) {
  const cls = ['nx-glass',
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
      {bracket && (<><span className="nx-br-tl"/><span className="nx-br-br"/></>)}
      {scan && <div className="nx-scan" />}
      {children}
    </div>
  );
}

// ─── Button ───
function NxBtn({ children, primary, mag, lime, amber, red, green, ghost, lg, block, choice,
  state, // 'correct' | 'wrong'
  className = '', ...rest }) {
  const cls = ['nx-btn',
    primary && 'primary',
    mag && 'mag', lime && 'lime', amber && 'amber', red && 'red', green && 'green',
    ghost && 'ghost', lg && 'lg', block && 'block',
    choice && 'choice',
    state === 'correct' && 'correct',
    state === 'wrong'   && 'wrong',
    className,
  ].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

// ─── Tag / chip ───
function NxTag({ children, cyan, mag, lime, amber, red, green, solid, className = '', style = {} }) {
  const cls = ['nx-tag',
    cyan && 'cyan', mag && 'mag', lime && 'lime', amber && 'amber', red && 'red', green && 'green',
    solid && 'solid',
    className,
  ].filter(Boolean).join(' ');
  return <span className={cls} style={style}>{children}</span>;
}

// ─── Progress / XP ───
function NxProgress({ value = 0, max = 100, thin, thick, amber, lime, mag, style = {} }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const cls = ['nx-progress', thin && 'thin', thick && 'thick',
    amber && 'amber', lime && 'lime', mag && 'mag'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      <div className="fill" style={{ width: pct + '%' }} />
    </div>
  );
}

// ─── Input ───
function NxInput({ area, className = '', ...rest }) {
  if (area) return <textarea className={'nx-textarea ' + className} {...rest} />;
  return <input className={'nx-input ' + className} {...rest} />;
}

// ─── Glyph / icon set — line-based, neon-friendly ───
function NxIcon({ kind = 'dot', size = 18, color = 'currentColor', glow = false }) {
  const common = {
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const paths = {
    home:   <><path d="M3 11 L12 4 L21 11" {...common}/><path d="M5 10 V20 H19 V10" {...common}/></>,
    orbit: <><circle cx="12" cy="12" r="3" {...common}/><ellipse cx="12" cy="12" rx="9" ry="4" {...common}/></>,
    list:  <path d="M5 7 H19 M5 12 H19 M5 17 H14" {...common}/>,
    chart: <><path d="M4 19 H20" {...common}/><rect x="6" y="11" width="2.5" height="8" {...common}/><rect x="11" y="7" width="2.5" height="12" {...common}/><rect x="16" y="14" width="2.5" height="5" {...common}/></>,
    plus:  <path d="M12 5 V19 M5 12 H19" {...common}/>,
    trash: <path d="M5 7 H19 M9 7 V5 H15 V7 M7 7 L8 20 H16 L17 7" {...common}/>,
    check: <path d="M5 12 L10 17 L19 7" {...common}/>,
    x:     <path d="M6 6 L18 18 M18 6 L6 18" {...common}/>,
    upload:<><path d="M12 4 V15 M7 9 L12 4 L17 9 M5 18 H19" {...common}/></>,
    arrow: <path d="M6 12 H18 M13 7 L18 12 L13 17" {...common}/>,
    back:  <path d="M18 12 H6 M11 7 L6 12 L11 17" {...common}/>,
    star:  <path d="M12 4 L14.5 10 L21 10.5 L16 14.5 L17.5 21 L12 17.5 L6.5 21 L8 14.5 L3 10.5 L9.5 10 Z" {...common}/>,
    flame: <path d="M12 3 C12 7 17 9 17 14 A5 5 0 0 1 7 14 C7 11 9 11 9 8 C10 9 11 9 12 9 Z" {...common}/>,
    book:  <><path d="M4 5 C8 4 11 5 12 6 C13 5 16 4 20 5 V19 C16 18 13 19 12 20 C11 19 8 18 4 19 Z" {...common}/><path d="M12 6 V20" {...common}/></>,
    medal: <><circle cx="12" cy="14" r="5" {...common}/><path d="M8 9 L6 3 H10 L12 9 M16 9 L18 3 H14 L12 9" {...common}/></>,
    google:<>
      <circle cx="12" cy="12" r="8" {...common}/>
      <path d="M12 12 H16 A4 4 0 1 1 12 8" {...common}/>
    </>,
    settings: <><circle cx="12" cy="12" r="3" {...common}/><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M5.5 18.5 L7.5 16.5 M16.5 7.5 L18.5 5.5" {...common}/></>,
    search:<><circle cx="11" cy="11" r="6" {...common}/><path d="M15 15 L20 20" {...common}/></>,
    dots:  <><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></>,
    sparkle: <>
      <path d="M12 3 V9 M12 15 V21 M3 12 H9 M15 12 H21 M5.5 5.5 L9 9 M15 15 L18.5 18.5 M5.5 18.5 L9 15 M15 9 L18.5 5.5" {...common}/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </>,
    bolt: <path d="M13 3 L5 14 H11 L9 21 L19 9 H13 Z" {...common}/>,
    user: <><circle cx="12" cy="8" r="4" {...common}/><path d="M4 20 C4 16 8 14 12 14 C16 14 20 16 20 20" {...common}/></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ color, filter: glow ? `drop-shadow(0 0 6px ${color})` : '' }}>
      {paths[kind] || paths.dot}
    </svg>
  );
}

// ─── Mobile tab bar ───
function NxTabBar({ active = 'home', onNav = () => {} }) {
  const t = useT();
  const items = [
    { id: 'maps',  label: t('MAPS'),     icon: 'orbit' },
    { id: 'home',  label: t('PLAY'),     icon: 'sparkle' },
    { id: 'boxes', label: t('NEBULAE'),  icon: 'star' },
    { id: 'list',  label: t('CODEX'),    icon: 'list' },
    { id: 'stats', label: t('PROFILE'),  icon: 'user' },
  ];
  return (
    <div className="nx-tabbar">
      {items.map(it => (
        <div key={it.id} className={active === it.id ? 'active' : ''} onClick={() => onNav(it.id)}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <NxIcon kind={it.icon} size={18} glow={active === it.id} />
          </div>
          <div>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Desktop side nav ───
function NxSideNav({ active = 'home', onNav = () => {} }) {
  const t = useT();
  const items = [
    { id: 'maps',     label: t('MAPS'),     sub: t('MAPS_SUB'),     icon: 'orbit' },
    { id: 'home',     label: t('PLAY'),     sub: t('PLAY_SUB'),     icon: 'sparkle' },
    { id: 'boxes',    label: t('NEBULAE'),  sub: t('NEBULAE_SUB'),  icon: 'star' },
    { id: 'list',     label: t('CODEX'),    sub: t('CODEX_SUB'),    icon: 'list' },
    { id: 'import',   label: t('IMPORT'),   sub: t('IMPORT_SUB'),   icon: 'upload' },
    { id: 'stats',    label: t('PROFILE'),  sub: t('PROFILE_SUB'),  icon: 'chart' },
    { id: 'settings', label: t('SETTINGS'), sub: t('SETTINGS_SUB'), icon: 'settings' },
  ];
  return (
    <div className="nx-sidenav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--cyan)',
          display: 'grid', placeItems: 'center', boxShadow: '0 0 16px -4px var(--cyan)' }}>
          <NxIcon kind="sparkle" size={16} color="var(--cyan)" glow />
        </div>
        <div>
          <div className="nx-h glow" style={{ fontSize: 18, lineHeight: 1, color: 'var(--cyan)' }}>VOCAB</div>
          <div className="nx-overline">β / constellation</div>
        </div>
      </div>
      <div style={{ paddingTop: 12 }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <div key={it.id} className={'nx-navitem' + (on ? ' active' : '')} onClick={() => onNav(it.id)}>
              <NxIcon kind={it.icon} size={18} />
              <div style={{ flex: 1, lineHeight: 1.2, minWidth: 0 }}>
                <div className="nx-h" style={{ fontSize: 12, letterSpacing: '0.08em' }}>{it.label}</div>
                <div className="nx-overline" style={{ fontSize: 9, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div className="nx-divider" style={{ margin: '8px 0' }} />
      <SideNavAvatar />
    </div>
  );
}

function SideNavAvatar() {
  const ctx = React.useContext(I18nContext);
  const lv = (ctx && ctx.level) || (window.__currentLevel) || 7;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
      <LevelAvatar lv={lv} size={36} />
      <div style={{ lineHeight: 1.2, minWidth: 0 }}>
        <div style={{ fontSize: 13 }}>Yamada</div>
        <div className="nx-overline" style={{ whiteSpace: 'nowrap', color: levelColor(lv) }}>
          {levelTierName(lv)} · 490 XP
        </div>
      </div>
    </div>
  );
}

// ─── Mobile header ───
function NxMobileHeader({ title, sub, left, right, glowColor = 'cyan' }) {
  return (
    <div style={{
      padding: '14px 16px 10px',
      borderBottom: '1px solid var(--line)',
      background: 'rgba(4, 5, 26, 0.55)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'grid',
      gridTemplateColumns: '36px 1fr 36px',
      alignItems: 'center', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
      <div style={{ textAlign: 'center' }}>
        <div className={'nx-h ' + (glowColor === 'mag' ? 'mag-glow' : 'glow')}
          style={{ fontSize: 15, color: glowColor === 'mag' ? 'var(--mag)' : 'var(--cyan)' }}>{title}</div>
        {sub && <div className="nx-overline" style={{ marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ─── Level system: tiered colors + ascension effects ───
// Every 5 levels the badge color shifts. Every 25 levels you "ascend":
// rotating rainbow halo + sparkles bloom around the badge.
const LEVEL_COLORS = ['#5ce8ff', '#ff5ce0', '#a079ff', '#a6ff5c', '#ffd25c', '#ff5c7a'];
const LEVEL_TIER_NAMES = ['SPECTRA', 'NOVA', 'PULSAR', 'QUASAR', 'STELLAR', 'NEBULA'];
function levelColor(lv) {
  const tier = Math.floor((Math.max(1, lv) - 1) / 5);
  return LEVEL_COLORS[tier % LEVEL_COLORS.length];
}
function levelTier(lv) {
  return Math.floor((Math.max(1, lv) - 1) / 5) + 1;
}
function levelTierName(lv) {
  const idx = Math.floor((Math.max(1, lv) - 1) / 5);
  return LEVEL_TIER_NAMES[idx % LEVEL_TIER_NAMES.length];
}
function levelAscension(lv) { return Math.floor(lv / 25); }

// LevelAvatar — the level badge with tier-based color + ascension halos
function LevelAvatar({ lv = 1, size = 110, withRing = true, ascensionEffect = true }) {
  const c = levelColor(lv);
  const asc = ascensionEffect ? levelAscension(lv) : 0;
  const label = String(lv).padStart(2, '0');
  // sparkle count + intensity grows with ascensions
  const sparkleCount = asc > 0 ? 6 + Math.min(asc, 4) * 2 : 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* outer rainbow halo (ascension) */}
      {asc > 0 && (
        <div style={{
          position: 'absolute', inset: -Math.max(8, size * 0.1),
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #5ce8ff, #ff5ce0, #a079ff, #a6ff5c, #ffd25c, #ff5c7a, #5ce8ff)',
        }} className="nx-spin nx-halo-pulse" />
      )}
      {/* sparkles */}
      {Array.from({ length: sparkleCount }).map((_, i) => {
        const total = sparkleCount;
        const angle = (i * 360 / total) * Math.PI / 180;
        const r = size * 0.62;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const s = 4 + (i % 3);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2,
            transform: `translate(${x}px, ${y}px)`,
            background: '#fff',
            borderRadius: '50%',
            boxShadow: `0 0 8px #fff, 0 0 16px ${c}`,
            animation: `nx-sparkle ${2 + (i % 4) * 0.4}s ease-in-out ${(i * 0.18) % 2}s infinite`,
          }}/>
        );
      })}
      {/* ring — animated for ascension, static otherwise */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        padding: Math.max(2, Math.round(size * 0.03)),
        background: asc > 0
          ? 'conic-gradient(from 220deg, #5ce8ff, #ff5ce0, #a079ff, #a6ff5c, #ffd25c, #ff5c7a, #5ce8ff)'
          : `linear-gradient(135deg, ${c}, ${c}66)`,
        boxShadow: withRing ? `0 0 ${Math.round(size * 0.3)}px ${c}` : 'none',
        boxSizing: 'border-box',
      }} className={asc > 0 ? 'nx-spin-fast' : ''}>
        {/* counter-rotating mask to keep the inner number static */}
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'var(--bg-0)',
          display: 'grid', placeItems: 'center',
          boxSizing: 'border-box',
        }} className={asc > 0 ? 'nx-spin-rev' : ''}>
          {/* the actual label sits inside an UN-rotated container by undoing the spin */}
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
          background: 'var(--bg-0)',
          border: `1px solid ${c}`,
          borderRadius: 10,
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

Object.assign(window, {
  Constellation, NxCard, NxBtn, NxTag, NxProgress, NxInput, NxIcon,
  NxTabBar, NxSideNav, NxMobileHeader,
  LEVEL_COLORS, LEVEL_TIER_NAMES, levelColor, levelTier, levelTierName, levelAscension,
  LevelAvatar,
});
