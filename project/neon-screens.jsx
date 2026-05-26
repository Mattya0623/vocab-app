/* neon-screens.jsx — vocab screens, neon × constellation aesthetic
   API matches the wireframe set: every screen takes { onNav, onAnswer, onNext, onImport, onPick } */

const NX_WORDS = [
  { word: 'apple',       meaning: 'りんご',        attempts: 12, correct: 11, acc: 92 },
  { word: 'meticulous',  meaning: '几帳面な',      attempts: 8,  correct: 3,  acc: 38 },
  { word: 'ephemeral',   meaning: '儚い・短命の',  attempts: 6,  correct: 5,  acc: 83 },
  { word: 'gregarious',  meaning: '社交的な',      attempts: 4,  correct: 1,  acc: 25 },
  { word: 'serendipity', meaning: '偶然の幸運',    attempts: 14, correct: 13, acc: 93 },
  { word: 'obfuscate',   meaning: '不明瞭にする',  attempts: 5,  correct: 2,  acc: 40 },
  { word: 'lucid',       meaning: '明快な',        attempts: 9,  correct: 7,  acc: 78 },
  { word: 'pragmatic',   meaning: '実用的な',      attempts: 10, correct: 4,  acc: 40 },
];

// 7 Leitner boxes reframed as Nebulae — named after famous stars
const NEBULAE = [
  { n: 1, name: 'Vega',       range: '0–25%',   count: 12, color: '#ff5c7a', desc: 'Weaver · 織女' },
  { n: 2, name: 'Altair',     range: '26–40%',  count: 18, color: '#ff5ce0', desc: 'Eagle · 彦星' },
  { n: 3, name: 'Sirius',     range: '41–55%',  count: 23, color: '#a079ff', desc: 'Dog Star · 天狼' },
  { n: 4, name: 'Betelgeuse', range: '56–75%',  count: 29, color: '#5ce8ff', desc: "Orion's Shoulder" },
  { n: 5, name: 'Rigel',      range: '76–90%',  count: 19, color: '#5cffd6', desc: "Orion's Foot" },
  { n: 6, name: 'Polaris',    range: '91–95%',  count: 9,  color: '#a6ff5c', desc: 'North Star · 北辰' },
  { n: 7, name: 'Antares',    range: '96–100%', count: 4,  color: '#ffd25c', desc: 'Heart of Scorpius' },
];

const boxOf = (acc) => {
  if (acc <= 25) return 1;
  if (acc <= 40) return 2;
  if (acc <= 55) return 3;
  if (acc <= 75) return 4;
  if (acc <= 90) return 5;
  if (acc <= 95) return 6;
  return 7;
};

// ───────────────────────────── 1. LOGIN ─────────────────────────────
function NxLogin({ onNav = () => {} }) {
  const t = useT();
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 }}>
      <div style={{ position: 'absolute', inset: 0 }}><Constellation density={1.1} mode="tall" /></div>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,232,255,0.4) 0%, rgba(92,232,255,0) 70%)',
            display: 'grid', placeItems: 'center', position: 'relative',
          }}>
            <NxIcon kind="sparkle" size={56} color="var(--cyan)" glow />
            <div className="nx-pulse" />
          </div>
        </div>
        <div>
          <div className="nx-h glow" style={{ fontSize: 56, letterSpacing: '0.18em', color: 'var(--cyan)', lineHeight: 1 }}>VOCAB</div>
          <div className="nx-overline" style={{ marginTop: 6, color: 'var(--ink-soft)' }}>// LEXICON ⋅ CONSTELLATION ⋅ β</div>
        </div>
        <NxCard glow="cyan" style={{ padding: 16, maxWidth: 320 }}>
          <div style={{ fontSize: 17, lineHeight: 1.5 }}>
            {t('TAGLINE_1')}<br/><span style={{ color: 'var(--mag)' }}>{t('TAGLINE_2')}</span>
          </div>
        </NxCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <NxBtn primary lg block onClick={() => onNav('home')}>
            <NxIcon kind="google" size={18} /> {t('LOGIN_GOOGLE')}
          </NxBtn>
          <NxBtn ghost block onClick={() => onNav('home')}>{t('LOGIN_GUEST')}</NxBtn>
        </div>

        <div className="nx-overline" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>
          {t('LOGIN_FINE')}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── 2. MAIN (PLAY) ─────────────────────────────
function NxMain({ onNav = () => {}, onAnswer = () => {}, reverse = false }) {
  const t = useT();
  const queryWord = reverse ? 'りんご' : 'apple';
  const queryIpa  = reverse ? null     : '/ ˈæp.əl /';
  const cs = reverse
    ? ['apple', 'ephemeral', 'gregarious', 'serendipity']
    : ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={t('PLAY') + ' · ' + t('PLAY_SUB')}
        sub={`ALL · 142 WORDS · ${reverse ? 'JA → EN' : 'EN → JA'}`}
        left={<NxIcon kind="back" size={18} color="var(--ink-soft)" />}
        right={<div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}><NxIcon kind="settings" size={18} color="var(--ink-soft)" /></div>}
      />
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <NxTag cyan>LV·07</NxTag>
        <NxProgress value={62} style={{ flex: 1 }} />
        <span className="nx-mono">490/640 XP</span>
      </div>
      <div style={{ padding: '6px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-mono">{t('SESSION')} 8 / 50</span>
        <span className="nx-mono" style={{ color: 'var(--amber)' }}>▲ 5 {t('STREAK')}</span>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="cyan" bracket scan style={{ padding: '24px 18px', textAlign: 'center', flex: '0 0 auto' }}>
          <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')}</div>
          <div className="nx-h glow" style={{ fontSize: 44, marginTop: 8, letterSpacing: '0.02em' }}>{queryWord}</div>
          {queryIpa && <div className="nx-mono" style={{ marginTop: 4 }}>{queryIpa}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            <NxTag>{t('ATT_SHORT')} 12</NxTag>
            <NxTag green>{t('ACC_SHORT')} 92%</NxTag>
            <NxTag mag>POLARIS · N6</NxTag>
          </div>
        </NxCard>

        <div className="nx-overline" style={{ textAlign: 'center', color: 'var(--ink-mute)' }}>
          {reverse ? t('PICK_WORD') : t('PICK_MEANING')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {cs.map((c, i) => (
            <NxBtn key={i} choice onClick={() => onAnswer(i === 0)}>
              <span style={{
                width: 24, height: 24, border: '1px solid var(--line-bright)', borderRadius: 4,
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)',
                marginRight: 4, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{c}</span>
            </NxBtn>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="nx-mono">⌃ {t('HINT')}</span>
          <NxBtn ghost style={{ padding: '6px 10px', fontSize: 11 }}>{t('SKIP')} →</NxBtn>
        </div>
      </div>

      <NxTabBar active="home" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 3. RESULT — CORRECT ─────────────────────────────
function NxResultOK({ onNav = () => {}, onNext = () => {}, onExit, sessionLabel }) {
  const t = useT();
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('RESULT_OK_TITLE')} sub={sessionLabel || '+1 XP · STREAK 5'} glowColor="cyan"
        left={onExit && <div onClick={onExit} style={{ cursor: 'pointer' }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>}
        right={onExit && <NxBtn ghost style={{ padding: '3px 8px', fontSize: 10 }} onClick={onExit}>{t('EXIT_SESSION')}</NxBtn>}
      />
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            width: 110, height: 110, margin: '0 auto', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,255,157,0.35) 0%, rgba(92,255,157,0) 70%)',
            display: 'grid', placeItems: 'center', position: 'relative',
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              border: '1.4px solid var(--green)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 30px var(--green), 0 0 60px rgba(92,255,157,0.4) inset',
            }}>
              <NxIcon kind="check" size={42} color="var(--green)" glow />
            </div>
            <div className="nx-pulse" style={{ borderColor: 'var(--green)' }} />
          </div>
          <div className="nx-h" style={{
            fontSize: 28, marginTop: 18, color: 'var(--green)',
            textShadow: '0 0 16px rgba(92,255,157,0.6)',
          }}>{t('RESULT_OK_LINE')}</div>
          <div className="nx-overline" style={{ marginTop: 4 }}>{t('SIGNAL_LOCKED')}</div>
        </div>

        <NxCard bracket="amber" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="nx-h glow" style={{ fontSize: 26 }}>apple</div>
            <NxTag amber>POLARIS · N6</NxTag>
          </div>
          <div style={{ marginTop: 6, fontSize: 16 }}>= りんご</div>
          <div className="nx-divider" style={{ margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <NxTag green>ACC 92% ▲</NxTag>
            <NxTag>ATT 13</NxTag>
            <NxTag cyan>+1 XP</NxTag>
          </div>
        </NxCard>

        <div style={{ textAlign: 'center', color: 'var(--amber)' }}>
          <span className="nx-mono" style={{ fontSize: 14, letterSpacing: '0.08em' }}>▲ 5 {t('STREAK')} · {t('NEXT_MILESTONE')}</span>
          <NxProgress value={50} amber style={{ marginTop: 8 }} />
        </div>
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', background: 'rgba(4,5,26,0.6)' }}>
        <NxBtn primary lg block onClick={onNext}>{t('NEXT')} → <NxIcon kind="arrow" size={16} /></NxBtn>
      </div>
    </div>
  );
}

// ───────────────────────────── 4. RESULT — WRONG ─────────────────────────────
function NxResultNG({ onNav = () => {}, onNext = () => {}, onExit, sessionLabel }) {
  const t = useT();
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('RESULT_NG_TITLE')} sub={sessionLabel || t('STREAK_RESET')} glowColor="mag"
        left={onExit && <div onClick={onExit} style={{ cursor: 'pointer' }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>}
        right={onExit && <NxBtn ghost style={{ padding: '3px 8px', fontSize: 10 }} onClick={onExit}>{t('EXIT_SESSION')}</NxBtn>}
      />
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 110, height: 110, margin: '0 auto', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,92,122,0.35) 0%, rgba(255,92,122,0) 70%)',
            display: 'grid', placeItems: 'center',
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              border: '1.4px solid var(--red)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 30px var(--red)',
            }}>
              <NxIcon kind="x" size={42} color="var(--red)" glow />
            </div>
          </div>
          <div className="nx-h" style={{
            fontSize: 28, marginTop: 18, color: 'var(--red)',
            textShadow: '0 0 16px rgba(255,92,122,0.5)',
          }}>{t('RESULT_NG_LINE')}</div>
          <div className="nx-overline" style={{ marginTop: 4 }}>{t('SIGNAL_LOST')}</div>
        </div>

        <NxCard glow="red" style={{ padding: 14 }}>
          <div className="nx-h" style={{ fontSize: 24 }}>meticulous</div>
          <div className="nx-mono" style={{ marginTop: 4 }}>{t('YOUR_ANSWER')} · 不明瞭にする</div>
          <div className="nx-divider" style={{ margin: '10px 0' }} />
          <div className="nx-overline">{t('CORRECT_MEANING')}</div>
          <div style={{ fontSize: 22, marginTop: 4, color: 'var(--cyan)', textShadow: '0 0 12px rgba(92,232,255,0.5)' }}>
            几帳面な
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <NxTag red>ACC 33% ▼</NxTag>
            <NxTag>ATT 9</NxTag>
            <NxTag mag>ALTAIR · N2</NxTag>
          </div>
        </NxCard>
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', background: 'rgba(4,5,26,0.6)', display: 'flex', gap: 10 }}>
        <NxBtn block ghost>{t('RETRY')}</NxBtn>
        <NxBtn primary lg block onClick={onNext}>{t('NEXT')} →</NxBtn>
      </div>
    </div>
  );
}

// ───────────────────────────── 5. BOXES — 7 NEBULAE STAR MAP ─────────────────────────────
function NxBoxes({ onNav = () => {}, onPick = () => {}, selected = 4 }) {
  // Place 7 nebulae along a curving "galaxy arm" path
  const positions = [
    { x: 8,  y: 78 }, { x: 22, y: 60 }, { x: 36, y: 46 }, { x: 50, y: 38 },
    { x: 64, y: 32 }, { x: 78, y: 22 }, { x: 92, y: 12 },
  ];
  const sel = NEBULAE[selected - 1];
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title="NEBULAE" sub="LEITNER · 7 BOXES" glowColor="mag"
        right={<NxIcon kind="search" size={18} color="var(--ink-soft)" />} />

      {/* star map */}
      <div style={{ position: 'relative', height: 280, margin: '14px 14px 8px',
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'radial-gradient(ellipse at 20% 90%, rgba(255,92,224,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(92,232,255,0.18) 0%, transparent 60%), #07091e' }}>
        <Constellation density={1.6} mode="wide" />
        {/* connecting arm */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 8 78 Q 24 50, 36 46 T 64 32 T 92 12"
            fill="none" stroke="url(#armGrad)" strokeWidth="0.4" strokeDasharray="1 1.5" />
          <defs>
            <linearGradient id="armGrad" x1="0" y1="100%" x2="100%" y2="0">
              <stop offset="0%" stopColor="#ff5ce0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5ce8ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        {/* nebula nodes */}
        {NEBULAE.map((b, i) => {
          const p = positions[i];
          const r = 6 + b.n * 1.2;
          const on = b.n === selected;
          return (
            <div key={b.n} onClick={() => onPick(b.n)} className="nx-clickable"
              style={{
                position: 'absolute',
                left: `calc(${p.x}% - ${r}px)`,
                top:  `calc(${p.y}% - ${r}px)`,
                width: r * 2, height: r * 2,
              }}>
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${b.color}55 0%, transparent 70%)`,
                filter: on ? 'brightness(1.6)' : 'none',
              }}/>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: b.color,
                boxShadow: `0 0 ${on ? 24 : 10}px ${b.color}, 0 0 0 ${on ? 2 : 1}px ${on ? 'var(--ink)' : 'rgba(255,255,255,0.4)'}`,
              }}/>
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                marginTop: 8, whiteSpace: 'nowrap',
                fontFamily: 'var(--display)', fontSize: 10, letterSpacing: '0.1em',
                color: on ? b.color : 'var(--ink-soft)',
                textShadow: on ? `0 0 8px ${b.color}` : 'none',
              }}>
                {b.name.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>

      {/* selected nebula card */}
      <div style={{ padding: '4px 14px 10px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NxCard glow="mag" bracket="mag" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: sel.color,
              boxShadow: `0 0 18px ${sel.color}`,
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--display)', fontWeight: 900,
              color: 'var(--bg-0)', fontSize: 18,
            }}>{sel.n}</div>
            <div style={{ flex: 1 }}>
              <div className="nx-h" style={{ fontSize: 20, color: sel.color, textShadow: `0 0 10px ${sel.color}` }}>{sel.name.toUpperCase()}</div>
              <div className="nx-overline">N{sel.n} · {sel.range} · {sel.desc}</div>
            </div>
            <NxTag>{sel.count}</NxTag>
          </div>
          <NxBtn primary lg block style={{ marginTop: 12 }} onClick={() => onPick(selected)}>
            <NxIcon kind="bolt" size={14}/> {sel.name.toUpperCase()} で出題
          </NxBtn>
        </NxCard>

        {/* small list of others */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NEBULAE.filter(b => b.n !== selected).map((b) => (
            <div key={b.n} className="nx-clickable" onClick={() => onPick(b.n)}
              style={{
                display: 'grid', gridTemplateColumns: '24px 1fr auto auto', gap: 10,
                alignItems: 'center', padding: '6px 12px',
                background: 'rgba(18,22,58,0.5)',
                border: '1px solid var(--line)', borderRadius: 8,
              }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: b.color, boxShadow: `0 0 8px ${b.color}`, justifySelf: 'center',
              }}/>
              <div className="nx-h" style={{ fontSize: 12, color: b.color }}>{b.name.toUpperCase()}</div>
              <span className="nx-mono">{b.range}</span>
              <NxTag>{b.count}</NxTag>
            </div>
          ))}
        </div>
      </div>

      <NxTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 6. BOX QUIZ ─────────────────────────────
function NxBoxQuiz({ onNav = () => {}, onAnswer = () => {}, onExit, box = 2, reverse = false }) {
  const t = useT();
  const b = NEBULAE[box - 1];
  const queryWord = reverse ? '几帳面な' : 'meticulous';
  const queryIpa  = reverse ? null      : '/ məˈtɪk.jə.ləs /';
  const cs = reverse
    ? ['meticulous', 'obfuscate', 'gregarious', 'lucid']
    : ['几帳面な', '不明瞭にする', '社交的な', '明快な'];
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`${b.name.toUpperCase()} · N${b.n}`}
        sub={`${b.range} · ${b.count} WORDS · ${reverse ? 'JA→EN' : 'EN→JA'}`}
        glowColor="mag"
        left={<div onClick={onExit} style={{ cursor: onExit ? 'pointer' : 'default' }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>}
        right={onExit && <NxBtn ghost style={{ padding: '3px 8px', fontSize: 10 }} onClick={onExit}>{t('EXIT_SESSION')}</NxBtn>}
      />
      <div style={{ padding: '10px 14px 0', display: 'flex', gap: 4 }}>
        {NEBULAE.map(n => (
          <div key={n.n} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: n.n === box ? n.color : 'rgba(255,255,255,0.08)',
            boxShadow: n.n === box ? `0 0 8px ${n.color}` : 'none',
          }}/>
        ))}
      </div>
      <div style={{ padding: '6px 16px 0', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-mono">{t('SESSION')} 3 / 18</span>
        <span className="nx-mono" style={{ color: b.color }}>{b.name.toUpperCase()} · CONTINUOUS</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <NxCard glow="mag" bracket="mag" scan style={{ padding: '22px 16px', textAlign: 'center' }}>
          <div className="nx-overline" style={{ color: b.color }}>{t('QUERY')} · 3/18</div>
          <div className="nx-h mag-glow" style={{ fontSize: 38, marginTop: 8, color: b.color }}>{queryWord}</div>
          {queryIpa && <div className="nx-mono" style={{ marginTop: 4 }}>{queryIpa}</div>}
        </NxCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {cs.map((c, i) => (
            <NxBtn key={i} choice onClick={() => onAnswer(i === 0)} style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <span className="nx-mono" style={{ fontSize: 10 }}>{i + 1}</span>
              <span>{c}</span>
            </NxBtn>
          ))}
        </div>
      </div>
      <NxTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 7. WORD LIST ─────────────────────────────
function NxList({ onNav = () => {} }) {
  const t = useT();
  const [sel, setSel] = React.useState(new Set([1]));
  const [sortBy, setSortBy] = React.useState('default');
  const toggle = (i) => { const s = new Set(sel); s.has(i) ? s.delete(i) : s.add(i); setSel(s); };

  const sorted = React.useMemo(() => {
    const arr = NX_WORDS.map((w, i) => ({ ...w, _i: i }));
    if (sortBy === 'acc_asc')  arr.sort((a, b) => a.acc - b.acc);
    else if (sortBy === 'acc_desc') arr.sort((a, b) => b.acc - a.acc);
    else if (sortBy === 'att_desc') arr.sort((a, b) => b.attempts - a.attempts);
    else if (sortBy === 'az')       arr.sort((a, b) => a.word.localeCompare(b.word));
    return arr;
  }, [sortBy]);

  const SORTS = [
    ['default',  t('SORT_DEFAULT')],
    ['acc_asc',  t('SORT_ACC_ASC')],
    ['acc_desc', t('SORT_ACC_DESC')],
    ['att_desc', t('SORT_ATT_DESC')],
    ['az',       t('SORT_AZ')],
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={t('CODEX') + ' · ' + t('CODEX_SUB')}
        sub={`${NX_WORDS.length} ${t('ENTRIES')} · ${sel.size} ${t('SELECTED')}`}
        left={<NxIcon kind="search" size={18} color="var(--ink-soft)" />}
        right={<NxIcon kind="plus" size={18} color="var(--cyan)" glow />}
      />
      <div style={{ padding: '10px 16px 6px', display: 'flex', gap: 8 }}>
        <NxInput placeholder={t('SEARCH_PH')} style={{ flex: 1, padding: '7px 10px', fontSize: 13 }} />
      </div>
      <div style={{ padding: '0 16px 8px' }}>
        <div className="nx-overline" style={{ marginBottom: 4 }}>{t('SORT_BY')}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SORTS.map(([k, label]) => (
            <span key={k} onClick={() => setSortBy(k)} className="nx-clickable">
              <NxTag cyan={sortBy === k}>{label}</NxTag>
            </span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', borderTop: '1px solid var(--line)' }}>
        {sorted.map((w) => {
          const i = w._i;
          const checked = sel.has(i);
          const b = NEBULAE[boxOf(w.acc) - 1];
          return (
            <div key={i} onClick={() => toggle(i)} className="nx-clickable"
              style={{
                display: 'grid',
                gridTemplateColumns: '22px 1fr 60px 80px',
                gap: 10, alignItems: 'center',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(118,138,220,0.12)',
                background: checked ? 'rgba(92,232,255,0.06)' : 'transparent',
              }}>
              <div style={{
                width: 16, height: 16, borderRadius: 3,
                border: '1px solid ' + (checked ? 'var(--cyan)' : 'var(--line)'),
                background: checked ? 'var(--cyan)' : 'transparent',
                color: 'var(--bg-0)',
                display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900,
                boxShadow: checked ? '0 0 10px var(--cyan)' : 'none',
              }}>{checked && '✓'}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>{w.word}</div>
                <div className="nx-overline" style={{ marginTop: 2, textTransform: 'none', letterSpacing: '0', color: 'var(--ink-soft)', fontSize: 11 }}>{w.meaning}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="nx-mono" style={{ color: w.acc >= 75 ? 'var(--green)' : w.acc >= 40 ? 'var(--amber)' : 'var(--red)' }}>{w.acc}%</div>
                <div className="nx-overline" style={{ fontSize: 9 }}>{w.correct}/{w.attempts}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <NxTag style={{ color: b.color, borderColor: b.color + '88', background: b.color + '15' }}>{b.name.toUpperCase()}</NxTag>
              </div>
            </div>
          );
        })}
      </div>
      {sel.size > 0 && (
        <div style={{
          padding: '10px 16px', borderTop: '1px solid var(--line)',
          background: 'rgba(255,92,122,0.08)', display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <span className="nx-mono" style={{ flex: 1 }}>{sel.size} {t('SELECTED')}</span>
          <NxBtn ghost style={{ padding: '5px 10px' }}>{t('SELECT_ALL')}</NxBtn>
          <NxBtn red style={{ padding: '5px 12px' }}>
            <NxIcon kind="trash" size={14} /> {t('DELETE')}
          </NxBtn>
        </div>
      )}
      <NxTabBar active="list" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 8. IMPORT ─────────────────────────────
function NxImport({ onNav = () => {} }) {
  const csv = `apple, りんご
meticulous, 几帳面な
ephemeral, 儚い・短命の
gregarious, 社交的な
serendipity, 偶然の幸運`;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title="IMPORT" sub="CSV · TSV · TEXT" left={<NxIcon kind="back" size={18} color="var(--ink-soft)" />} />
      <div style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <NxCard style={{ padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderStyle: 'dashed' }}>
          <NxIcon kind="upload" size={28} color="var(--cyan)" glow />
          <div className="nx-h glow" style={{ fontSize: 14, color: 'var(--cyan)' }}>DROP FILE HERE</div>
          <div className="nx-overline">.csv / .tsv / .txt · UTF-8</div>
          <NxBtn ghost style={{ marginTop: 4, padding: '6px 12px', fontSize: 11 }}>BROWSE…</NxBtn>
        </NxCard>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="nx-divider" style={{ flex: 1 }} />
          <span className="nx-overline">OR PASTE</span>
          <div className="nx-divider" style={{ flex: 1 }} />
        </div>

        <NxInput area defaultValue={csv} style={{ flex: 1, minHeight: 0 }} />

        <NxCard glow="cyan" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>PREVIEW</span>
            <span className="nx-mono">5 NEW · 0 DUPE</span>
          </div>
          <div className="nx-divider" style={{ margin: '6px 0' }} />
          {NX_WORDS.slice(0, 3).map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '2px 0' }}>
              <span style={{ flex: 1, fontWeight: 600 }}>{w.word}</span>
              <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
            </div>
          ))}
          <div className="nx-overline" style={{ marginTop: 4 }}>+ 2 more…</div>
        </NxCard>
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <NxBtn block ghost>CANCEL</NxBtn>
        <NxBtn primary lg block>+5 を追加 →</NxBtn>
      </div>
    </div>
  );
}

// ───────────────────────────── 9. STATS / PROFILE ─────────────────────────────
function NxStats({ onNav = () => {}, level = 7 }) {
  const t = useT();
  const c = levelColor(level);
  const tierName = levelTierName(level);
  const asc = levelAscension(level);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('PROFILE')} sub={`LV·${String(level).padStart(2,'0')} · ${tierName}${asc > 0 ? ` · ★${asc}` : ''}`} />
      <div style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Hero level card */}
        <NxCard glow="mag" bracket scan style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <LevelAvatar lv={level} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="nx-h mag-glow" style={{ fontSize: 18, color: c, textShadow: `0 0 10px ${c}` }}>{t('RANK_APPRENTICE')}</div>
              <div className="nx-overline">{tierName} · LV·{String(level).padStart(2,'0')}{asc > 0 && <> · ★{asc}</>}</div>
              <NxProgress value={62} mag style={{ marginTop: 6 }} />
              <div className="nx-mono" style={{ marginTop: 4 }}>490 / 640 XP · 残り 150</div>
            </div>
          </div>
        </NxCard>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['累計解答', '490', 'cyan'],
            ['平均正答率', '61%', 'green'],
            ['MAX STREAK', '23', 'amber'],
            ['登録単語', '114', 'mag'],
          ].map(([k, v, c], i) => (
            <NxCard key={i} bracket={c === 'mag' ? 'mag' : c === 'amber' ? 'amber' : false} style={{ padding: 12 }}>
              <div className="nx-overline">{k}</div>
              <div className="nx-h" style={{
                fontSize: 28, marginTop: 4,
                color: `var(--${c})`,
                textShadow: `0 0 12px var(--${c})`,
              }}>{v}</div>
            </NxCard>
          ))}
        </div>

        {/* Nebula breakdown */}
        <NxCard style={{ padding: 12, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="nx-h glow" style={{ fontSize: 13, color: 'var(--cyan)' }}>NEBULAE</span>
            <span className="nx-overline">回答数</span>
          </div>
          {NEBULAE.slice(0, 4).map(b => (
            <div key={b.n} style={{ display: 'grid', gridTemplateColumns: '8px 80px 1fr 50px', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, boxShadow: `0 0 8px ${b.color}` }}/>
              <span className="nx-h" style={{ fontSize: 11, color: b.color }}>{b.name.toUpperCase()}</span>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(8,10,28,0.6)', overflow: 'hidden' }}>
                <div style={{
                  width: Math.min(100, b.count * 4) + '%', height: '100%',
                  background: b.color, boxShadow: `0 0 8px ${b.color}`,
                }}/>
              </div>
              <span className="nx-mono" style={{ textAlign: 'right' }}>{b.count * 4}</span>
            </div>
          ))}
        </NxCard>

        {/* Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { i: 'flame', l: 'STREAK 10', c: 'amber', got: true },
            { i: 'medal', l: '100 ANS',  c: 'cyan',  got: true },
            { i: 'star',  l: 'LV·5',     c: 'mag',   got: true },
            { i: 'book',  l: '満NEBULA', c: 'lime',  got: false },
          ].map((bg, i) => (
            <div key={i} style={{
              padding: 8, textAlign: 'center',
              borderRadius: 8,
              border: '1px solid ' + (bg.got ? `var(--${bg.c})` : 'var(--line)'),
              background: bg.got ? `var(--${bg.c}, var(--line))15` : 'rgba(18,22,58,0.4)',
              boxShadow: bg.got ? `0 0 16px -8px var(--${bg.c})` : 'none',
              opacity: bg.got ? 1 : 0.45,
            }}>
              <NxIcon kind={bg.i} size={20} color={bg.got ? `var(--${bg.c})` : 'var(--ink-mute)'} glow={bg.got} />
              <div className="nx-overline" style={{ fontSize: 8, marginTop: 4, color: bg.got ? `var(--${bg.c})` : 'var(--ink-mute)' }}>{bg.l}</div>
            </div>
          ))}
        </div>
      </div>
      <NxTabBar active="stats" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 10. EMPTY ─────────────────────────────
function NxEmpty({ onNav = () => {}, onImport = () => {} }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><Constellation density={0.7} mode="tall" /></div>
      <NxMobileHeader title="CODEX" sub="EMPTY · NO ENTRIES" />
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,232,255,0.2) 0%, transparent 70%)',
          }}/>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <circle cx="50" cy="50" r="30" fill="none" stroke="var(--cyan)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5"/>
            <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="var(--mag)" strokeWidth="0.4" opacity="0.6"
              transform="rotate(-15 50 50)"/>
            <circle cx="50" cy="50" r="5" fill="var(--cyan)" filter="url(#g)"/>
            <defs>
              <filter id="g"><feGaussianBlur stdDeviation="2"/></filter>
            </defs>
          </svg>
          <div className="nx-pulse" style={{ inset: '32%' }}/>
        </div>
        <div>
          <div className="nx-h glow" style={{ fontSize: 22, color: 'var(--cyan)' }}>NO SIGNAL</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
            まだ単語がありません。<br/>
            <span style={{ color: 'var(--ink-soft)' }}>「単語, 意味」を貼り付けて、銀河を起動しましょう。</span>
          </div>
        </div>
        <NxBtn primary lg onClick={onImport}>
          <NxIcon kind="upload" size={16}/> 単語をインポート
        </NxBtn>
        <NxBtn ghost style={{ fontSize: 11 }}>サンプル単語で起動</NxBtn>
      </div>
      <NxTabBar active="list" onNav={onNav} />
    </div>
  );
}

// ───────────────────────────── 11. SETTINGS ─────────────────────────────
function NxSettings({ onNav = () => {} }) {
  const t = useT();
  const { lang, reverse, setLang, setReverse } = useI18n();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('SETTINGS')} sub={t('SETTINGS_HEAD')}
        left={<div onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>} />

      <div style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* STUDY section */}
        <div>
          <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('STUDY_SECTION')}</div>
          <NxCard glow="cyan" bracket style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nx-h" style={{ fontSize: 14, color: 'var(--cyan)' }}>{t('REVERSE_LABEL')}</div>
                <div className="nx-mono" style={{ marginTop: 4, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>
                  {t('REVERSE_DESC')}
                </div>
              </div>
              {/* Toggle */}
              <div onClick={() => setReverse(!reverse)}
                style={{
                  width: 50, height: 28, borderRadius: 14,
                  background: reverse ? 'var(--mag)' : 'rgba(8,10,28,0.7)',
                  border: '1px solid ' + (reverse ? 'var(--mag)' : 'var(--line)'),
                  boxShadow: reverse ? '0 0 16px var(--mag)' : 'none',
                  position: 'relative', cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                <div style={{
                  position: 'absolute', top: 2, left: reverse ? 24 : 2,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--bg-0)',
                  boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                  transition: 'left 0.2s',
                }}/>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              background: 'rgba(8,10,28,0.5)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <NxTag cyan>{reverse ? 'JA' : 'EN'}</NxTag>
              <NxIcon kind="arrow" size={14} color="var(--mag)" />
              <NxTag mag>{reverse ? 'EN' : 'JA'}</NxTag>
              <span className="nx-mono" style={{ marginLeft: 'auto', fontSize: 10 }}>
                {reverse ? t('REVERSE_ARROW_ON') : t('REVERSE_ARROW')}
              </span>
            </div>
          </NxCard>
        </div>

        {/* LANGUAGE section */}
        <div>
          <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('LANG_SECTION')}</div>
          <NxCard glow="mag" bracket="mag" style={{ padding: 14 }}>
            <div className="nx-h mag-glow" style={{ fontSize: 14, color: 'var(--mag)' }}>{t('LANG_LABEL')}</div>
            <div className="nx-mono" style={{ marginTop: 4, marginBottom: 10, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>
              {t('LANG_DESC')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {LANGS.map(L => {
                const on = lang === L.value;
                return (
                  <div key={L.value} onClick={() => setLang(L.value)} className="nx-clickable"
                    style={{
                      padding: '12px 10px', borderRadius: 8, textAlign: 'center',
                      border: '1px solid ' + (on ? 'var(--mag)' : 'var(--line)'),
                      background: on ? 'rgba(255,92,224,0.10)' : 'rgba(8,10,28,0.4)',
                      boxShadow: on ? '0 0 18px -6px var(--mag)' : 'none',
                    }}>
                    <div className="nx-h" style={{ fontSize: 11, color: on ? 'var(--mag)' : 'var(--ink-soft)' }}>{L.short}</div>
                    <div style={{ marginTop: 4, fontSize: 14, color: on ? 'var(--ink)' : 'var(--ink-soft)' }}>{L.label}</div>
                  </div>
                );
              })}
            </div>
          </NxCard>
        </div>

        {/* ACCOUNT section */}
        <div>
          <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('ACCOUNT_SECTION')}</div>
          <NxCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan), var(--mag))',
                display: 'grid', placeItems: 'center',
                color: 'var(--bg-0)', fontFamily: 'var(--display)', fontWeight: 900,
              }}>Y</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14 }}>Yamada</div>
                <div className="nx-overline">yamada@gmail.com</div>
              </div>
            </div>
            <div onClick={() => onNav('login')} className="nx-clickable"
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
              <NxIcon kind="back" size={16} color="var(--ink-soft)" />
              <span style={{ flex: 1 }}>{t('SIGN_OUT')}</span>
              <NxIcon kind="arrow" size={14} color="var(--ink-mute)" />
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <NxIcon kind="trash" size={16} color="var(--red)" />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--red)', fontSize: 14 }}>{t('DELETE_DATA')}</div>
                <div className="nx-overline" style={{ fontSize: 9 }}>{t('DANGER_DESC')}</div>
              </div>
            </div>
          </NxCard>
        </div>

        <div className="nx-overline" style={{ textAlign: 'center', fontSize: 9, color: 'var(--ink-mute)' }}>
          VOCAB β · v0.2.0 · 2026-05
        </div>
      </div>

      <NxTabBar active="stats" onNav={onNav} />
    </div>
  );
}

Object.assign(window, {
  NX_WORDS, NEBULAE, boxOf,
  NxLogin, NxMain, NxResultOK, NxResultNG,
  NxBoxes, NxBoxQuiz, NxList, NxImport, NxStats, NxEmpty,
  NxSettings,
});
