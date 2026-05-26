/* wf-ui.jsx — sketchy wireframe primitives shared between canvas + prototype */

// ─── basic boxes ───
function SkBox({ children, className = '', style = {}, dashed, thick, shaded, deep, shadow, accent, ...rest }) {
  const cls = ['sk-box', dashed && 'dashed', thick && 'thick', shaded && 'shaded', deep && 'deep',
    shadow === 'accent' ? 'sk-shadow-accent' : shadow === 'soft' ? 'sk-shadow-soft' : shadow ? 'sk-shadow' : '',
    className].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...rest}>{children}</div>;
}

function SkBtn({ children, primary, ghost, danger, correct, wrong, className = '', ...rest }) {
  const cls = ['sk-btn', primary && 'primary', ghost && 'ghost', danger && 'danger',
    correct && 'correct', wrong && 'wrong', className].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

function SkInput({ area, ...rest }) {
  return area
    ? <textarea className="sk-input area" {...rest} />
    : <input className="sk-input" {...rest} />;
}

function SkHR({ style }) { return <div className="sk-hr" style={style} />; }

function SkPlaceholder({ children, style = {} }) {
  return <div className="sk-placeholder" style={style}>{children}</div>;
}

function SkTag({ children, accent, green, red, style = {} }) {
  const cls = ['sk-tag', accent && 'accent', green && 'green', red && 'red'].filter(Boolean).join(' ');
  return <span className={cls} style={style}>{children}</span>;
}

function SkProgress({ value = 0, max = 100, style = {} }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="sk-progress" style={style}>
      <div className="fill" style={{ width: pct + '%' }} />
    </div>
  );
}

// ─── tiny scribbled icons (CSS only) ───
function SkIcon({ kind = 'dot', size = 22, color = 'currentColor' }) {
  const s = { width: size, height: size, color };
  const stroke = 1.6;
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 11 L12 4 L21 11" {...common}/><path d="M5 10 V20 H19 V10" {...common}/></>,
    box: <><rect x="3.5" y="5" width="17" height="14" rx="1" {...common}/><path d="M3.5 9 H20.5" {...common}/></>,
    list: <><path d="M5 7 H19 M5 12 H19 M5 17 H14" {...common}/></>,
    chart: <><path d="M4 19 H20" {...common}/><rect x="6" y="11" width="2.5" height="8" {...common}/><rect x="11" y="7" width="2.5" height="12" {...common}/><rect x="16" y="14" width="2.5" height="5" {...common}/></>,
    plus: <><path d="M12 5 V19 M5 12 H19" {...common}/></>,
    trash: <><path d="M5 7 H19 M9 7 V5 H15 V7 M7 7 L8 20 H16 L17 7" {...common}/></>,
    check: <><path d="M5 12 L10 17 L19 7" {...common}/></>,
    x: <><path d="M6 6 L18 18 M18 6 L6 18" {...common}/></>,
    upload: <><path d="M12 4 V15 M7 9 L12 4 L17 9 M5 18 H19" {...common}/></>,
    arrow: <><path d="M6 12 H18 M13 7 L18 12 L13 17" {...common}/></>,
    back: <><path d="M18 12 H6 M11 7 L6 12 L11 17" {...common}/></>,
    star: <path d="M12 4 L14.5 10 L21 10.5 L16 14.5 L17.5 21 L12 17.5 L6.5 21 L8 14.5 L3 10.5 L9.5 10 Z" {...common}/>,
    flame: <><path d="M12 3 C12 7 17 9 17 14 A5 5 0 0 1 7 14 C7 11 9 11 9 8 C10 9 11 9 12 9 Z" {...common}/></>,
    book: <><path d="M4 5 C8 4 11 5 12 6 C13 5 16 4 20 5 V19 C16 18 13 19 12 20 C11 19 8 18 4 19 Z" {...common}/><path d="M12 6 V20" {...common}/></>,
    medal: <><circle cx="12" cy="14" r="5" {...common}/><path d="M8 9 L6 3 H10 L12 9 M16 9 L18 3 H14 L12 9" {...common}/></>,
    google: <><circle cx="12" cy="12" r="8" {...common}/><path d="M12 8 V12 H16" {...common}/></>,
    settings: <><circle cx="12" cy="12" r="3" {...common}/><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M5.5 18.5 L7.5 16.5 M16.5 7.5 L18.5 5.5" {...common}/></>,
    search: <><circle cx="11" cy="11" r="6" {...common}/><path d="M15 15 L20 20" {...common}/></>,
    dots: <><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[kind] || paths.dot}</svg>;
}

// ─── annotation pointer for design canvas (an arrow + script-y label) ───
function SkAnno({ children, style = {}, dir = 'right' }) {
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 4, ...style }}>
      {dir === 'left' && <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>↳</span>}
      <span className="sk-anno">{children}</span>
      {dir === 'right' && <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>↲</span>}
    </div>
  );
}

// ─── responsive nav scaffolds ───
function MobileTabBar({ active = 'home', onNav = () => {} }) {
  const items = [
    { id: 'home', label: '出題', icon: 'home' },
    { id: 'boxes', label: 'ボックス', icon: 'box' },
    { id: 'list', label: '単語', icon: 'list' },
    { id: 'stats', label: '統計', icon: 'chart' },
  ];
  return (
    <div className="sk-tabbar">
      {items.map(it => (
        <div key={it.id} className={'sk-hit ' + (active === it.id ? 'active' : '')} onClick={() => onNav(it.id)}>
          {active === it.id && <span className="dot" />}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <SkIcon kind={it.icon} size={18} />
          </div>
          <div>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function DesktopSideNav({ active = 'home', onNav = () => {} }) {
  const items = [
    { id: 'home', label: '全単語モード', icon: 'home' },
    { id: 'boxes', label: 'ボックス別', icon: 'box' },
    { id: 'list', label: '単語の管理', icon: 'list' },
    { id: 'import', label: 'インポート', icon: 'upload' },
    { id: 'stats', label: '統計 & レベル', icon: 'chart' },
  ];
  return (
    <div style={{
      width: 200, padding: 14, borderRight: '1.6px dashed var(--ink-soft)',
      background: 'var(--paper-soft)', display: 'flex', flexDirection: 'column', gap: 4,
      fontFamily: 'var(--hand)', height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ fontFamily: 'var(--script)', fontSize: 26, lineHeight: 1, marginBottom: 4 }}>Vocab</div>
      <div className="sk-callout-sub" style={{ marginBottom: 10 }}>// β · wireframe</div>
      {items.map(it => {
        const on = active === it.id;
        return (
          <div key={it.id} className="sk-hit" onClick={() => onNav(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
            border: on ? '1.4px solid var(--ink)' : '1.4px solid transparent',
            borderRadius: '6px 10px 6px 10px',
            background: on ? 'var(--paper)' : 'transparent',
            boxShadow: on ? '1.5px 2px 0 var(--ink)' : 'none',
            fontWeight: on ? 700 : 400, fontSize: 14,
          }}>
            <SkIcon kind={it.icon} size={18} />
            <span>{it.label}</span>
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <SkHR />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', fontSize: 13 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%', border: '1.4px solid var(--ink)',
          background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', fontWeight: 700,
        }}>Y</div>
        <div>
          <div style={{ lineHeight: 1.1 }}>Yamada</div>
          <div className="sk-callout-sub">Lv. 7</div>
        </div>
      </div>
    </div>
  );
}

// ─── tiny header bar for mobile screens ───
function MobileHeader({ title, left, right, sub }) {
  return (
    <div style={{
      padding: '10px 14px 8px',
      borderBottom: '1.4px dashed var(--ink-soft)',
      background: 'var(--paper)',
      display: 'grid',
      gridTemplateColumns: '32px 1fr 32px',
      alignItems: 'center', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--hand)', fontWeight: 700, fontSize: 16 }}>{title}</div>
        {sub && <div className="sk-callout-sub">{sub}</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

Object.assign(window, {
  SkBox, SkBtn, SkInput, SkHR, SkPlaceholder, SkTag, SkProgress, SkIcon,
  SkAnno, MobileTabBar, DesktopSideNav, MobileHeader,
});
