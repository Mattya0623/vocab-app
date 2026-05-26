/* neon-screens-desktop.jsx — desktop variants of vocab screens */

function NxDesktopShell({ active, onNav, title, sub, right, children }) {
  return (
    <div style={{ height: '100%', display: 'flex', position: 'relative' }}>
      <NxSideNav active={active} onNav={onNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <div style={{
          padding: '16px 26px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '1px solid var(--line)',
          background: 'rgba(4,5,26,0.4)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nx-h glow" style={{ fontSize: 22, color: 'var(--cyan)' }}>{title}</div>
            {sub && <div className="nx-overline" style={{ marginTop: 2 }}>{sub}</div>}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{right}</div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: 24, position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
}

// ───────────────────────────── D-MAIN ─────────────────────────────
function NxMainDesktop({ onNav = () => {}, onAnswer = () => {}, reverse = false }) {
  const t = useT();
  const queryWord = reverse ? 'りんご' : 'apple';
  const queryIpa  = reverse ? null     : '/ ˈæp.əl /';
  const choices = reverse
    ? ['apple', 'ephemeral', 'gregarious', 'serendipity']
    : ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <NxDesktopShell active="home" onNav={onNav}
      title={t('PLAY') + ' · ' + t('PLAY_SUB')}
      sub={`ALL · 142 WORDS · ${reverse ? 'JA → EN' : 'EN → JA'}`}
      right={<>
        <NxTag amber>▲ 5 {t('STREAK')}</NxTag>
        <NxTag cyan>LV·07</NxTag>
        <div onClick={() => onNav('settings')} style={{ cursor: 'pointer' }}>
          <NxIcon kind="settings" size={20} color="var(--ink-soft)" />
        </div>
      </>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, height: '100%' }}>
        {/* Left: flashcard column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <NxCard glow="cyan" bracket scan style={{ padding: 36, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="nx-overline" style={{ color: 'var(--cyan)' }}>{t('QUERY')} · CARD #042</div>
            <div className="nx-h glow" style={{ fontSize: 96, marginTop: 14, letterSpacing: '0.02em' }}>{queryWord}</div>
            {queryIpa && <div className="nx-mono" style={{ marginTop: 8, fontSize: 13 }}>{queryIpa}</div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              <NxTag>{t('ATT_SHORT')} 12</NxTag>
              <NxTag green>{t('ACC_SHORT')} 92%</NxTag>
              <NxTag amber>POLARIS · N6</NxTag>
            </div>
          </NxCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {choices.map((c, i) => (
              <NxBtn key={i} choice onClick={() => onAnswer(i === 0)} style={{ padding: '18px 16px', fontSize: 17 }}>
                <span style={{
                  width: 30, height: 30, border: '1px solid var(--line-bright)', borderRadius: 6,
                  display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)',
                  fontSize: 12, marginRight: 10, color: 'var(--cyan)', flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ flex: 1 }}>{c}</span>
              </NxBtn>
            ))}
          </div>
        </div>

        {/* Right: session telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <NxCard style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="nx-h" style={{ fontSize: 12 }}>{t('SESSION')}</span>
              <span className="nx-mono">8 / 50</span>
            </div>
            <NxProgress value={16} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: 'rgba(92,255,157,0.08)', border: '1px solid rgba(92,255,157,0.3)' }}>
                <div className="nx-overline">{t('CORRECT_LOG')}</div>
                <div className="nx-h" style={{ fontSize: 18, color: 'var(--green)' }}>5</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: 'rgba(255,92,122,0.08)', border: '1px solid rgba(255,92,122,0.3)' }}>
                <div className="nx-overline">{t('WRONG_LOG')}</div>
                <div className="nx-h" style={{ fontSize: 18, color: 'var(--red)' }}>3</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: 'rgba(92,232,255,0.08)', border: '1px solid rgba(92,232,255,0.3)' }}>
                <div className="nx-overline">{t('ACC_SHORT')}</div>
                <div className="nx-h" style={{ fontSize: 18, color: 'var(--cyan)' }}>62%</div>
              </div>
            </div>
          </NxCard>

          <NxCard style={{ padding: 14 }}>
            <span className="nx-h" style={{ fontSize: 12 }}>{t('SHORTCUTS')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, fontSize: 13 }}>
              {[
                ['1—4', t('SHORT_PICK')],
                ['SPACE', t('SHORT_NEXT')],
                ['?', t('SHORT_HINT')],
                ['S', t('SHORT_SPEAK')],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="nx-mono" style={{
                    border: '1px solid var(--line-bright)', padding: '2px 8px', borderRadius: 4,
                    fontSize: 11, minWidth: 56, textAlign: 'center', color: 'var(--cyan)',
                  }}>{k}</span>
                  <span style={{ color: 'var(--ink-soft)' }}>{v}</span>
                </div>
              ))}
            </div>
          </NxCard>

          <NxCard style={{ padding: 14, flex: 1, overflow: 'hidden' }}>
            <span className="nx-h" style={{ fontSize: 12 }}>{t('RECENT_LOG')}</span>
            <div style={{ marginTop: 8 }}>
              {[
                ['serendipity', true,  '+1'],
                ['lucid',       true,  '+1'],
                ['obfuscate',   false, '+0'],
                ['gregarious',  false, '+0'],
                ['pragmatic',   true,  '+1'],
              ].map(([w, ok, xp], i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  padding: '6px 0', borderBottom: '1px solid rgba(118,138,220,0.1)',
                  fontSize: 13,
                }}>
                  <NxIcon kind={ok ? 'check' : 'x'} size={14} color={ok ? 'var(--green)' : 'var(--red)'} glow />
                  <span style={{ flex: 1 }}>{w}</span>
                  <span className="nx-mono" style={{ color: ok ? 'var(--green)' : 'var(--ink-mute)' }}>{xp} XP</span>
                </div>
              ))}
            </div>
          </NxCard>
        </div>
      </div>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-BOXES ─────────────────────────────
function NxBoxesDesktop({ onNav = () => {}, onPick = () => {}, selected = 4 }) {
  const t = useT();
  const positions = [
    { x: 8,  y: 82 }, { x: 21, y: 64 }, { x: 34, y: 50 }, { x: 47, y: 40 },
    { x: 60, y: 32 }, { x: 73, y: 24 }, { x: 85, y: 18 },
  ];
  const sel = NEBULAE[selected - 1];
  return (
    <NxDesktopShell active="boxes" onNav={onNav} title={t('NEBULAE_HEAD')} sub={t('NEBULAE_SUBHEAD')}
      right={<NxBtn primary onClick={() => onPick(selected)}><NxIcon kind="bolt" size={14}/> {t('PLAY_FROM_CLUSTER')} →</NxBtn>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, height: '100%' }}>
        {/* Star map */}
        <NxCard bracket style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <Constellation density={2.2} mode="wide" />
          </div>
          {/* Galaxy arm */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M 8 82 Q 22 54, 34 50 T 60 32 T 85 18"
              fill="none" stroke="url(#g2)" strokeWidth="0.3" strokeDasharray="1.2 1.5" />
            <defs>
              <linearGradient id="g2" x1="0" y1="100%" x2="100%" y2="0">
                <stop offset="0%" stopColor="#ff5ce0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#5ce8ff" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
          {NEBULAE.map((b, i) => {
            const p = positions[i];
            const r = 9 + b.n * 1.6;
            const on = b.n === selected;
            return (
              <div key={b.n} className="nx-clickable" onClick={() => onPick(b.n)}
                style={{
                  position: 'absolute',
                  left: `calc(${p.x}% - ${r}px)`,
                  top:  `calc(${p.y}% - ${r}px)`,
                  width: r * 2, height: r * 2,
                }}>
                <div style={{ position: 'absolute', inset: -16, borderRadius: '50%',
                  background: `radial-gradient(circle, ${b.color}55 0%, transparent 70%)` }}/>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: b.color,
                  boxShadow: `0 0 ${on ? 32 : 14}px ${b.color}, 0 0 0 ${on ? 2.5 : 1.4}px ${on ? 'var(--ink)' : 'rgba(255,255,255,0.5)'}`,
                }}/>
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginTop: 10, whiteSpace: 'nowrap', textAlign: 'center',
                  fontFamily: 'var(--display)',
                }}>
                  <div style={{
                    fontSize: 13, letterSpacing: '0.12em', fontWeight: 700,
                    color: on ? b.color : 'var(--ink)',
                    textShadow: on ? `0 0 10px ${b.color}` : 'none',
                  }}>{b.name.toUpperCase()}</div>
                  <div className="nx-overline" style={{ fontSize: 9, marginTop: 2 }}>{b.range}</div>
                </div>
              </div>
            );
          })}
          {/* Legend */}
          <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span><span style={{ color: 'var(--mag)' }}>◄</span> {t('WEAK')}</span>
            <span style={{ color: 'var(--cyan)' }}>{t('STRONG')} ►</span>
          </div>
          <div style={{ position: 'absolute', right: 14, top: 14 }}>
            <NxTag cyan>{t('STAR_MAP')}</NxTag>
          </div>
        </NxCard>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <NxCard glow="mag" bracket="mag" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: sel.color, boxShadow: `0 0 22px ${sel.color}`,
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--display)', fontWeight: 900, color: 'var(--bg-0)', fontSize: 22,
              }}>N{sel.n}</div>
              <div>
                <div className="nx-h" style={{ fontSize: 26, color: sel.color, textShadow: `0 0 12px ${sel.color}` }}>{sel.name.toUpperCase()}</div>
                <div className="nx-overline">{sel.range} · {sel.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <NxTag>{sel.count} WORDS</NxTag>
              <NxTag cyan>累計 72 ANS</NxTag>
              <NxTag green>AVG 34%</NxTag>
            </div>
            <NxBtn primary lg block style={{ marginTop: 14 }} onClick={() => onPick(selected)}>
              <NxIcon kind="bolt" size={14}/> {t('PLAY_FROM_CLUSTER')}
            </NxBtn>
          </NxCard>

          <NxCard style={{ padding: 14, flex: 1, overflow: 'hidden' }}>
            <span className="nx-h" style={{ fontSize: 12 }}>{t('WORDS_EXCERPT')}</span>
            <div style={{ marginTop: 8 }}>
              {NX_WORDS.filter(w => boxOf(w.acc) === selected || (selected === 4 && boxOf(w.acc) === 5)).slice(0, 6).map((w, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1.2fr 50px',
                  gap: 10, padding: '6px 0', fontSize: 13,
                  borderBottom: '1px solid rgba(118,138,220,0.1)',
                }}>
                  <span style={{ fontWeight: 600 }}>{w.word}</span>
                  <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                  <span className="nx-mono" style={{ textAlign: 'right', color: sel.color }}>{w.acc}%</span>
                </div>
              ))}
            </div>
            <div className="nx-overline" style={{ marginTop: 6 }}>{t('MORE_OTHERS')}</div>
          </NxCard>
        </div>
      </div>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-LIST ─────────────────────────────
function NxListDesktop({ onNav = () => {} }) {
  const t = useT();
  const [sortBy, setSortBy] = React.useState('default');
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
    <NxDesktopShell active="list" onNav={onNav} title={t('CODEX_HEAD')}
      sub={`${NX_WORDS.length} ${t('ENTRIES')} · ${NX_WORDS.reduce((s,w)=>s+w.attempts,0)} ${t('ATTEMPTS_COL')}`}
      right={<>
        <NxBtn ghost><NxIcon kind="search" size={14}/> {t('SEARCH')}</NxBtn>
        <NxBtn onClick={() => onNav('import')}><NxIcon kind="upload" size={14}/> {t('IMPORT')}</NxBtn>
        <NxBtn primary><NxIcon kind="plus" size={14}/> {t('NEW_ENTRY')}</NxBtn>
      </>}>
      <NxCard style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Sort toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)',
          background: 'rgba(28,34,80,0.4)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="nx-overline">{t('SORT_BY')}:</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SORTS.map(([k, label]) => (
              <span key={k} onClick={() => setSortBy(k)} className="nx-clickable">
                <NxTag cyan={sortBy === k}>{label}</NxTag>
              </span>
            ))}
          </div>
        </div>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1.4fr 1.6fr 100px 140px 80px 32px',
          padding: '12px 18px', borderBottom: '1px solid var(--line)',
          background: 'rgba(28,34,80,0.4)', gap: 12, alignItems: 'center',
        }}>
          <div style={{ width: 16, height: 16, border: '1px solid var(--line)', borderRadius: 3 }}/>
          <span className="nx-overline">{t('WORD_COL')}</span>
          <span className="nx-overline">{t('MEANING_COL')}</span>
          <span className="nx-overline">{t('NEBULA_COL')}</span>
          <span className="nx-overline">{t('ACCURACY_COL')}</span>
          <span className="nx-overline">{t('ATTEMPTS_COL')}</span>
          <span/>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {sorted.map((w) => {
            const i = w._i;
            const b = NEBULAE[boxOf(w.acc) - 1];
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '32px 1.4fr 1.6fr 100px 140px 80px 32px',
                padding: '12px 18px', gap: 12, alignItems: 'center',
                borderBottom: '1px solid rgba(118,138,220,0.1)',
              }}>
                <div style={{ width: 16, height: 16, border: '1px solid var(--line-bright)', borderRadius: 3 }}/>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                <span style={{
                  fontFamily: 'var(--display)', fontSize: 11, letterSpacing: '0.1em',
                  color: b.color, textShadow: `0 0 6px ${b.color}88`,
                }}>{b.name.toUpperCase()}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NxProgress value={w.acc} thin style={{ flex: 1 }} />
                  <span className="nx-mono" style={{ minWidth: 32, textAlign: 'right', color: w.acc >= 75 ? 'var(--green)' : w.acc >= 40 ? 'var(--amber)' : 'var(--red)' }}>{w.acc}%</span>
                </div>
                <span className="nx-mono">{w.correct}/{w.attempts}</span>
                <NxIcon kind="dots" size={16} color="var(--ink-mute)" />
              </div>
            );
          })}
        </div>
      </NxCard>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-IMPORT ─────────────────────────────
function NxImportDesktop({ onNav = () => {} }) {
  const csv = `apple, りんご
meticulous, 几帳面な
ephemeral, 儚い・短命の
gregarious, 社交的な
serendipity, 偶然の幸運
obfuscate, 不明瞭にする`;
  return (
    <NxDesktopShell active="import" onNav={onNav} title="IMPORT · 単語追加" sub="CSV · TSV · TEXT · UTF-8">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <NxCard style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, borderStyle: 'dashed' }}>
            <NxIcon kind="upload" size={36} color="var(--cyan)" glow />
            <div style={{ flex: 1 }}>
              <div className="nx-h glow" style={{ fontSize: 15, color: 'var(--cyan)' }}>DROP FILE HERE</div>
              <div className="nx-overline" style={{ marginTop: 2 }}>.csv / .tsv / .txt — UTF-8 ENCODING</div>
            </div>
            <NxBtn>BROWSE…</NxBtn>
          </NxCard>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="nx-divider" style={{ flex: 1 }}/>
            <span className="nx-overline">OR PASTE BELOW</span>
            <div className="nx-divider" style={{ flex: 1 }}/>
          </div>

          <NxInput area defaultValue={csv} style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="nx-overline">区切り:</span>
            <NxTag cyan>カンマ</NxTag>
            <NxTag>タブ</NxTag>
            <NxTag>改行</NxTag>
            <span style={{ flex: 1, textAlign: 'right' }} className="nx-mono">AUTO · COMMA</span>
          </div>
        </div>

        <NxCard glow="cyan" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
            <span className="nx-h glow" style={{ fontSize: 13, color: 'var(--cyan)' }}>PREVIEW</span>
            <span className="nx-mono">6 NEW · 0 DUPLICATE</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {NX_WORDS.slice(0, 6).map((w, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1.3fr 70px',
                padding: '10px 18px', gap: 12,
                borderBottom: '1px solid rgba(118,138,220,0.1)', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                <NxTag green>NEW</NxTag>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(28,34,80,0.4)' }}>
            <span className="nx-overline">6 単語を追加 · 既存は影響しません</span>
            <NxBtn primary lg>追加する →</NxBtn>
          </div>
        </NxCard>
      </div>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-STATS ─────────────────────────────
function NxStatsDesktop({ onNav = () => {}, level = 7 }) {
  const t = useT();
  const c = levelColor(level);
  const tierName = levelTierName(level);
  const asc = levelAscension(level);
  return (
    <NxDesktopShell active="stats" onNav={onNav}
      title={t('PROFILE_HEAD')}
      sub={`LV·${String(level).padStart(2,'0')} · ${tierName} · 490 / 640 XP${asc > 0 ? ` · ★ ASC ${asc}` : ''}`}
      right={<NxTag amber>▲ 5 {t('STREAK')}</NxTag>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gridTemplateRows: 'auto 1fr', gap: 14, height: '100%', minWidth: 0 }}>
        {/* Hero */}
        <NxCard glow="mag" bracket="mag" scan style={{ padding: 18, gridColumn: '1 / 2', display: 'flex', gap: 18, alignItems: 'center', minWidth: 0 }}>
          <LevelAvatar lv={level} size={100} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nx-h mag-glow" style={{ fontSize: 24, color: c, textShadow: `0 0 12px ${c}` }}>{t('RANK_APPRENTICE')}</div>
            <div className="nx-overline" style={{ marginBottom: 8 }}>
              <span style={{ color: c }}>{tierName}</span> · LV·{String(level).padStart(2, '0')}
              {asc > 0 && <> · <span style={{ color: c }}>★ ASCENSION {asc}</span></>}
            </div>
            <NxProgress value={62} mag thick />
            <div className="nx-mono" style={{ marginTop: 6, fontSize: 11 }}>{t('XP_REMAIN')}</div>
          </div>
        </NxCard>

        {/* KPI grid — compact */}
        <div style={{ gridColumn: '2 / 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, minWidth: 0 }}>
          {[
            [t('STAT_TOTAL'),      '490',  'cyan'],
            [t('STAT_AVG'),        '61%',  'green'],
            [t('STAT_MAX_STREAK'), '23',   'amber'],
            [t('STAT_WORDS'),      '114',  'mag'],
          ].map(([k, v, cc], i) => (
            <NxCard key={i} style={{ padding: 10, minWidth: 0, overflow: 'hidden' }}
              bracket={cc === 'amber' ? 'amber' : cc === 'mag' ? 'mag' : false}>
              <div className="nx-overline" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</div>
              <div className="nx-h" style={{
                fontSize: 28, marginTop: 4, lineHeight: 1,
                color: `var(--${cc})`, textShadow: `0 0 14px var(--${cc})`,
              }}>{v}</div>
            </NxCard>
          ))}
        </div>

        {/* Nebula chart — abbreviated labels to prevent overflow */}
        <NxCard style={{ padding: 14, gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('NEBULAE_BREAKDOWN')}</span>
            <span className="nx-overline" style={{ whiteSpace: 'nowrap', fontSize: 9 }}>{t('FOCUS_ZONE')}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 12, minHeight: 80 }}>
            {NEBULAE.map(b => (
              <div key={b.n} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span className="nx-mono" style={{ fontSize: 10 }}>{b.count * 4}</span>
                <div style={{
                  width: '70%',
                  height: Math.min(110, 14 + b.count * 2.4),
                  background: `linear-gradient(180deg, ${b.color}, ${b.color}55)`,
                  border: `1px solid ${b.color}`,
                  boxShadow: `0 0 14px ${b.color}88`,
                  borderRadius: '4px 4px 0 0',
                }}/>
                <div className="nx-h" style={{
                  fontSize: 10, color: b.color, textShadow: `0 0 6px ${b.color}`, marginTop: 2,
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>{b.name.toUpperCase().slice(0, 3)}</div>
                <div className="nx-overline" style={{ fontSize: 8, whiteSpace: 'nowrap' }}>N{b.n}</div>
              </div>
            ))}
          </div>
        </NxCard>

        {/* Badges + level curve */}
        <NxCard style={{ padding: 12, gridColumn: '2 / 3', minWidth: 0, overflow: 'hidden' }}>
          <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('BADGES')}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 8 }}>
            {[
              { i: 'flame', l: 'STREAK', c: 'amber', got: true },
              { i: 'medal', l: '100',    c: 'cyan',  got: true },
              { i: 'star',  l: 'LV·5',   c: 'mag',   got: true },
              { i: 'book',  l: '満NEB',  c: 'lime',  got: false },
              { i: 'medal', l: '1000',   c: 'amber', got: false },
            ].map((bg, i) => (
              <div key={i} style={{
                padding: 6, textAlign: 'center', borderRadius: 6,
                border: '1px solid ' + (bg.got ? `var(--${bg.c})` : 'var(--line)'),
                background: bg.got ? `rgba(255,255,255,0.04)` : 'rgba(18,22,58,0.4)',
                boxShadow: bg.got ? `0 0 18px -8px var(--${bg.c})` : 'none',
                opacity: bg.got ? 1 : 0.45,
              }}>
                <NxIcon kind={bg.i} size={22} color={bg.got ? `var(--${bg.c})` : 'var(--ink-mute)'} glow={bg.got}/>
                <div className="nx-overline" style={{ fontSize: 8, marginTop: 2, whiteSpace: 'nowrap', color: bg.got ? `var(--${bg.c})` : 'var(--ink-mute)' }}>{bg.l}</div>
              </div>
            ))}
          </div>
          <div className="nx-divider" style={{ margin: '10px 0' }} />
          <span className="nx-h" style={{ fontSize: 11 }}>{t('LEVEL_CURVE')}</span>
          <div className="nx-overline" style={{ marginTop: 2, fontSize: 9 }}>{t('XP_FORMULA')}</div>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 48, marginTop: 8 }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(lv => {
              const isCurrent = lv === Math.min(level, 12);
              const tierC = levelColor(lv);
              return (
                <div key={lv} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{
                    height: 4 + lv * 3.2,
                    background: isCurrent ? `linear-gradient(180deg, ${tierC}, ${c})` : tierC + '40',
                    boxShadow: isCurrent ? `0 0 10px ${tierC}` : 'none',
                    borderRadius: 2, border: `1px solid ${tierC}${isCurrent ? '' : '60'}`,
                  }}/>
                  <div className="nx-overline" style={{ fontSize: 8, marginTop: 2, color: isCurrent ? tierC : 'var(--ink-mute)' }}>L{lv}</div>
                </div>
              );
            })}
          </div>
        </NxCard>
      </div>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-LOGIN ─────────────────────────────
function NxLoginDesktop({ onNav = () => {} }) {
  return (
    <div style={{ position: 'relative', height: '100%', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><Constellation density={1.4} mode="wide" /></div>
      <NxCard glow="cyan" bracket scan style={{ position: 'relative', zIndex: 1, padding: 40, width: 460, textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, margin: '0 auto', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,232,255,0.4) 0%, transparent 70%)',
          display: 'grid', placeItems: 'center',
        }}>
          <NxIcon kind="sparkle" size={52} color="var(--cyan)" glow />
        </div>
        <div className="nx-h glow" style={{ fontSize: 56, letterSpacing: '0.18em', marginTop: 14 }}>VOCAB</div>
        <div className="nx-overline" style={{ marginTop: 4 }}>// LEXICON ⋅ CONSTELLATION ⋅ β</div>
        <div style={{ marginTop: 22, fontSize: 16, lineHeight: 1.5 }}>
          覚えるのが苦手な単語に、<br/><span style={{ color: 'var(--mag)' }}>もう一度、光を当てる</span>。
        </div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <NxBtn primary lg block onClick={() => onNav('home')}>
            <NxIcon kind="google" size={18}/> Googleでログイン
          </NxBtn>
          <NxBtn ghost block onClick={() => onNav('home')}>ゲストで起動</NxBtn>
        </div>
        <div className="nx-overline" style={{ marginTop: 18, fontSize: 9 }}>
          DATA · ENCRYPTED · USER-SCOPED · FIRESTORE
        </div>
      </NxCard>
    </div>
  );
}

// ───────────────────────────── D-EMPTY ─────────────────────────────
function NxEmptyDesktop({ onNav = () => {}, onImport = () => {} }) {
  return (
    <NxDesktopShell active="list" onNav={onNav} title="CODEX · 単語管理" sub="EMPTY">
      <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <NxCard glow="cyan" bracket style={{ padding: 40, textAlign: 'center', maxWidth: 460 }}>
          <div style={{ width: 140, height: 140, margin: '0 auto', position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="30" fill="none" stroke="var(--cyan)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6"/>
              <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="var(--mag)" strokeWidth="0.4" opacity="0.6" transform="rotate(-15 50 50)"/>
              <circle cx="50" cy="50" r="5" fill="var(--cyan)"/>
            </svg>
            <div className="nx-pulse" style={{ inset: '32%' }}/>
          </div>
          <div className="nx-h glow" style={{ fontSize: 24, marginTop: 12 }}>NO SIGNAL</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
            まだ単語がありません。CSV をペーストして、銀河を起動しましょう。
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <NxBtn primary lg onClick={onImport}><NxIcon kind="upload" size={16}/> インポート</NxBtn>
            <NxBtn ghost>サンプルで起動</NxBtn>
          </div>
        </NxCard>
      </div>
    </NxDesktopShell>
  );
}

// ───────────────────────────── D-SETTINGS ─────────────────────────────
function NxSettingsDesktop({ onNav = () => {} }) {
  const t = useT();
  const { lang, reverse, setLang, setReverse } = useI18n();
  return (
    <NxDesktopShell active="settings" onNav={onNav} title={t('SETTINGS_HEAD')} sub={t('SETTINGS_SUB')}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignContent: 'start', maxWidth: 1100 }}>
        {/* STUDY */}
        <NxCard glow="cyan" bracket style={{ padding: 22 }}>
          <div className="nx-overline" style={{ color: 'var(--cyan)' }}>// {t('STUDY_SECTION')}</div>
          <div className="nx-h glow" style={{ fontSize: 22, marginTop: 6, color: 'var(--cyan)' }}>{t('REVERSE_LABEL')}</div>
          <div style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            {t('REVERSE_DESC')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
            <div onClick={() => setReverse(!reverse)}
              style={{
                width: 60, height: 32, borderRadius: 16,
                background: reverse ? 'var(--mag)' : 'rgba(8,10,28,0.7)',
                border: '1px solid ' + (reverse ? 'var(--mag)' : 'var(--line)'),
                boxShadow: reverse ? '0 0 16px var(--mag)' : 'none',
                position: 'relative', cursor: 'pointer', flexShrink: 0,
                transition: 'all 0.2s',
              }}>
              <div style={{
                position: 'absolute', top: 2, left: reverse ? 30 : 2,
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--bg-0)',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                transition: 'left 0.2s',
              }}/>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              background: 'rgba(8,10,28,0.5)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <NxTag cyan>{reverse ? 'JA' : 'EN'}</NxTag>
              <NxIcon kind="arrow" size={16} color="var(--mag)" />
              <NxTag mag>{reverse ? 'EN' : 'JA'}</NxTag>
              <span className="nx-mono" style={{ marginLeft: 'auto' }}>
                {reverse ? t('REVERSE_ARROW_ON') : t('REVERSE_ARROW')}
              </span>
            </div>
          </div>
        </NxCard>

        {/* LANGUAGE */}
        <NxCard glow="mag" bracket="mag" style={{ padding: 22 }}>
          <div className="nx-overline" style={{ color: 'var(--mag)' }}>// {t('LANG_SECTION')}</div>
          <div className="nx-h mag-glow" style={{ fontSize: 22, marginTop: 6, color: 'var(--mag)' }}>{t('LANG_LABEL')}</div>
          <div style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            {t('LANG_DESC')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
            {LANGS.map(L => {
              const on = lang === L.value;
              return (
                <div key={L.value} onClick={() => setLang(L.value)} className="nx-clickable"
                  style={{
                    padding: '14px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
                    border: '1px solid ' + (on ? 'var(--mag)' : 'var(--line)'),
                    background: on ? 'rgba(255,92,224,0.10)' : 'rgba(8,10,28,0.4)',
                    boxShadow: on ? '0 0 18px -6px var(--mag)' : 'none',
                  }}>
                  <div className="nx-h" style={{
                    fontSize: 16, width: 36, textAlign: 'center',
                    color: on ? 'var(--mag)' : 'var(--ink-soft)',
                    textShadow: on ? '0 0 8px var(--mag)' : 'none',
                  }}>{L.short}</div>
                  <div style={{ flex: 1, fontSize: 15, color: on ? 'var(--ink)' : 'var(--ink-soft)' }}>{L.label}</div>
                  {on && <NxIcon kind="check" size={16} color="var(--mag)" glow />}
                </div>
              );
            })}
          </div>
        </NxCard>

        {/* ACCOUNT — wider card spanning both columns */}
        <NxCard style={{ padding: 0, gridColumn: '1 / 3', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--line)' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cyan), var(--mag))',
              display: 'grid', placeItems: 'center',
              color: 'var(--bg-0)', fontFamily: 'var(--display)', fontWeight: 900, fontSize: 22,
              boxShadow: '0 0 18px -4px var(--mag)',
            }}>Y</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Yamada</div>
              <div className="nx-overline">yamada@gmail.com · LV·07 · 490 XP</div>
            </div>
            <div className="nx-overline">// {t('ACCOUNT_SECTION')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div onClick={() => onNav('login')} className="nx-clickable"
              style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12, borderRight: '1px solid var(--line)' }}>
              <NxIcon kind="back" size={20} color="var(--ink-soft)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15 }}>{t('SIGN_OUT')}</div>
                <div className="nx-overline">SESSION END</div>
              </div>
              <NxIcon kind="arrow" size={16} color="var(--ink-mute)" />
            </div>
            <div className="nx-clickable"
              style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <NxIcon kind="trash" size={20} color="var(--red)" glow />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: 'var(--red)' }}>{t('DELETE_DATA')}</div>
                <div className="nx-overline">// {t('DANGER_ZONE')} — {t('DANGER_DESC')}</div>
              </div>
              <NxIcon kind="arrow" size={16} color="var(--ink-mute)" />
            </div>
          </div>
        </NxCard>

        <div className="nx-overline" style={{ gridColumn: '1 / 3', textAlign: 'center', marginTop: 6 }}>
          VOCAB β · v0.2.0 · 2026-05 · FIRESTORE · NEXT.JS · TAILWIND
        </div>
      </div>
    </NxDesktopShell>
  );
}

Object.assign(window, {
  NxDesktopShell, NxMainDesktop, NxBoxesDesktop, NxListDesktop,
  NxImportDesktop, NxStatsDesktop, NxLoginDesktop, NxEmptyDesktop,
  NxSettingsDesktop,
});
