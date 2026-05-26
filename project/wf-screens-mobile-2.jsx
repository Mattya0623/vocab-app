/* wf-screens-mobile-2.jsx — remaining mobile screens (list, import, stats, results, empty) */

// ─── 4. BOX QUIZ — same as Main but with current-box header ───
function MScreenBoxQuiz({ onNav = () => {}, onAnswer = () => {}, box = 2 }) {
  const meanings = ['几帳面な', '不明瞭にする', '社交的な', '明快な'];
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader
        title={`Box ${box}`}
        sub="26–40% · 18 単語"
        left={<SkIcon kind="back" size={20} />}
        right={<span className="sk-tag accent">▶ 出題</span>}
      />
      <div style={{ padding: '8px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {BOXES.map(b => (
          <div key={b.n} style={{
            flex: 1, height: 22, borderRadius: 3, border: '1.3px solid var(--ink)',
            background: b.n === box ? b.color : 'var(--paper)',
            display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--hand)', fontWeight: 700,
            transform: b.n === box ? 'translateY(-2px)' : 'none',
            boxShadow: b.n === box ? '1.5px 2px 0 var(--ink)' : 'none',
          }}>{b.n}</div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkBox thick shadow style={{ padding: 20, textAlign: 'center' }}>
          <div className="sk-callout-sub" style={{ marginBottom: 6 }}>3 / 18</div>
          <div className="sk-script" style={{ fontSize: 40, lineHeight: 1 }}>meticulous</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>/ məˈtɪk.jə.ləs /</div>
        </SkBox>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {meanings.map((m, i) => (
            <SkBtn key={i} onClick={() => onAnswer(i === 0)} style={{ padding: 8, fontSize: 14, justifyContent: 'center' }}>
              {m}
            </SkBtn>
          ))}
        </div>
      </div>
      <MobileTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

// ─── 5a. RESULT — CORRECT ───
function MScreenResultOK({ onNav = () => {}, onNext = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#eaf3e2' }}>
      <MobileHeader title="正解" sub="CORRECT · +1 XP" />
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 86, height: 86, margin: '0 auto', borderRadius: '50%',
            border: '2.2px solid var(--green)', display: 'grid', placeItems: 'center',
            background: 'rgba(255,255,255,0.5)', boxShadow: '3px 4px 0 var(--green)',
          }}>
            <SkIcon kind="check" size={56} color="var(--green)" />
          </div>
          <div className="sk-script" style={{ fontSize: 44, lineHeight: 1, marginTop: 14, color: 'var(--green)' }}>その通り！</div>
        </div>

        <SkBox style={{ padding: 14 }}>
          <div className="sk-script" style={{ fontSize: 30, lineHeight: 1 }}>apple</div>
          <div style={{ fontSize: 17, marginTop: 4 }}>= りんご</div>
          <SkHR style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <SkTag green>正答率 92% <span style={{ opacity: 0.6, marginLeft: 4 }}>↑</span></SkTag>
            <SkTag>試行 13</SkTag>
            <SkTag accent>Box 5</SkTag>
          </div>
        </SkBox>

        <div style={{ textAlign: 'center', color: 'var(--accent)', fontFamily: 'var(--script)', fontSize: 22, lineHeight: 1 }}>
          🔥 5 streak !
        </div>
      </div>

      <div style={{ padding: 14, borderTop: '1.4px dashed var(--ink-soft)' }}>
        <SkBtn primary onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          次の単語 →
        </SkBtn>
      </div>
    </div>
  );
}

// ─── 5b. RESULT — WRONG ───
function MScreenResultNG({ onNav = () => {}, onNext = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fbebea' }}>
      <MobileHeader title="不正解" sub="INCORRECT" />
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 86, height: 86, margin: '0 auto', borderRadius: '50%',
            border: '2.2px solid var(--red)', display: 'grid', placeItems: 'center',
            background: 'rgba(255,255,255,0.5)', boxShadow: '3px 4px 0 var(--red)',
          }}>
            <SkIcon kind="x" size={56} color="var(--red)" />
          </div>
          <div className="sk-script" style={{ fontSize: 44, lineHeight: 1, marginTop: 14, color: 'var(--red)' }}>惜しい！</div>
        </div>

        <SkBox style={{ padding: 14 }}>
          <div className="sk-script" style={{ fontSize: 30, lineHeight: 1 }}>meticulous</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>あなたの答え: 不明瞭にする</div>
          <SkHR style={{ margin: '8px 0' }} />
          <div style={{ fontSize: 18 }}>正しい意味:
            <span className="sk-script" style={{ fontSize: 28, marginLeft: 6 }}>几帳面な</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <SkTag red>正答率 33% <span style={{ marginLeft: 4 }}>↓</span></SkTag>
            <SkTag>試行 9</SkTag>
            <SkTag>Box 2</SkTag>
          </div>
        </SkBox>

        <div className="sk-callout-sub" style={{ textAlign: 'center' }}>連続正解 4 → 0 にリセット</div>
      </div>

      <div style={{ padding: 14, borderTop: '1.4px dashed var(--ink-soft)', display: 'flex', gap: 8 }}>
        <SkBtn style={{ flex: 1, justifyContent: 'center' }}>もう一度</SkBtn>
        <SkBtn primary onClick={onNext} style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>次へ →</SkBtn>
      </div>
    </div>
  );
}

// ─── 6. WORD LIST — variant A ───
function MScreenListA({ onNav = () => {} }) {
  const [sel, setSel] = React.useState(new Set([1]));
  const toggle = (i) => {
    const s = new Set(sel); s.has(i) ? s.delete(i) : s.add(i); setSel(s);
  };
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader
        title="単語管理"
        sub={`${SAMPLE_WORDS.length} 件 · ${sel.size} 選択中`}
        left={<SkIcon kind="search" size={20} />}
        right={<SkIcon kind="plus" size={20} />}
      />
      <div style={{ padding: '10px 14px 4px', display: 'flex', gap: 6, alignItems: 'center' }}>
        <SkInput placeholder="単語または意味で検索…" style={{ fontSize: 13 }} />
      </div>
      <div style={{ padding: '0 14px', display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
        <SkTag accent>すべて</SkTag>
        <SkTag>Box 1</SkTag><SkTag>Box 2</SkTag><SkTag>Box 3</SkTag>
        <SkTag>未試行</SkTag>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', borderTop: '1.3px dashed var(--ink-soft)' }}>
        {SAMPLE_WORDS.map((w, i) => {
          const checked = sel.has(i);
          return (
            <div key={i} className="sk-hit" onClick={() => toggle(i)}
              style={{
                padding: '8px 14px', display: 'grid',
                gridTemplateColumns: '20px 1fr 56px 36px',
                gap: 10, alignItems: 'center',
                borderBottom: '1px dashed var(--ink-light)',
                background: checked ? 'rgba(217,122,60,0.1)' : 'transparent',
              }}>
              <div style={{
                width: 18, height: 18, border: '1.4px solid var(--ink)', borderRadius: 3,
                display: 'grid', placeItems: 'center',
                background: checked ? 'var(--accent)' : 'transparent',
                color: 'var(--paper)',
              }}>{checked && '✓'}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.1 }}>{w.word}</div>
                <div className="sk-callout-sub">{w.meaning}</div>
              </div>
              <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>
                {w.acc}%
                <div className="sk-callout-sub">{w.correct}/{w.attempts}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <SkTag>{BOXES.find(b => w.acc >= ({1:0,2:26,3:41,4:56,5:76,6:91,7:96}[b.n]))?.n || 1}</SkTag>
              </div>
            </div>
          );
        })}
      </div>
      {sel.size > 0 && (
        <div style={{
          padding: '8px 14px', borderTop: '1.6px solid var(--ink)',
          background: 'var(--paper-soft)', display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <span className="sk-callout-sub" style={{ flex: 1 }}>{sel.size} 件選択中</span>
          <SkBtn ghost style={{ fontSize: 12, padding: '4px 8px' }}>すべて</SkBtn>
          <SkBtn danger style={{ fontSize: 12, padding: '4px 10px' }}>
            <SkIcon kind="trash" size={14} /> 削除
          </SkBtn>
        </div>
      )}
      <MobileTabBar active="list" onNav={onNav} />
    </div>
  );
}

// ─── 6b. WORD LIST variant B — compact card grid ───
function MScreenListB({ onNav = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="単語" sub="CARD GRID" right={<SkIcon kind="plus" size={20} />} />
      <div style={{ padding: '10px 14px', display: 'flex', gap: 6 }}>
        <SkInput placeholder="検索…" style={{ flex: 1, fontSize: 13 }} />
        <SkBtn ghost style={{ fontSize: 12, padding: '4px 8px' }}>並替↕</SkBtn>
      </div>
      <div style={{ flex: 1, padding: 14, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }}>
        {SAMPLE_WORDS.slice(0, 6).map((w, i) => (
          <SkBox key={i} className="sk-hit" shadow="soft" style={{ padding: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--hand)', fontWeight: 700, fontSize: 13 }}>{w.word}</div>
              <span className="sk-callout-sub">B{BOXES.find(b => w.acc >= ({1:0,2:26,3:41,4:56,5:76,6:91,7:96}[b.n]))?.n}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.2 }}>{w.meaning}</div>
            <SkProgress value={w.acc} style={{ height: 7, marginTop: 6 }} />
            <div className="sk-callout-sub" style={{ marginTop: 4 }}>{w.acc}% · {w.attempts}回</div>
          </SkBox>
        ))}
      </div>
      <MobileTabBar active="list" onNav={onNav} />
    </div>
  );
}

// ─── 7. IMPORT — variant A: paste + parse preview ───
function MScreenImportA({ onNav = () => {} }) {
  const csv = `apple, りんご
meticulous, 几帳面な
ephemeral, 儚い・短命の
gregarious, 社交的な
serendipity, 偶然の幸運`;
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="単語をインポート" sub="CSV / TEXT PASTE" left={<SkIcon kind="back" size={20} />} />
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <SkBox dashed shaded style={{ padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <SkIcon kind="upload" size={28} />
          <div style={{ fontWeight: 700 }}>ファイルをドロップ</div>
          <div className="sk-callout-sub">.csv / .txt · 改行 or タブ or カンマ区切り</div>
          <SkBtn style={{ fontSize: 12, padding: '4px 10px' }}>ファイル選択</SkBtn>
        </SkBox>

        <div className="sk-script" style={{ fontSize: 18, lineHeight: 1 }}>または、直接ペースト ↓</div>
        <SkInput area defaultValue={csv} style={{ flex: 1 }} />

        <SkBox shaded style={{ padding: 10 }}>
          <div className="sk-callout-sub" style={{ marginBottom: 4 }}>プレビュー (5 件検出)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SAMPLE_WORDS.slice(0, 3).map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 700, minWidth: 90 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
              </div>
            ))}
            <div className="sk-callout-sub">… 他 2 件</div>
          </div>
        </SkBox>
      </div>
      <div style={{ padding: 14, borderTop: '1.4px dashed var(--ink-soft)', display: 'flex', gap: 8 }}>
        <SkBtn ghost style={{ flex: 1, justifyContent: 'center' }}>キャンセル</SkBtn>
        <SkBtn primary style={{ flex: 1, justifyContent: 'center' }}>5件を追加 →</SkBtn>
      </div>
    </div>
  );
}

// ─── IMPORT variant B: two-column table editor ───
function MScreenImportB({ onNav = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="新しい単語" sub="TABLE EDITOR" left={<SkIcon kind="back" size={20} />} right={<SkIcon kind="upload" size={20} />} />
      <div style={{ flex: 1, padding: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 24px', gap: 6, padding: '0 4px', marginBottom: 4 }}>
          <span className="sk-callout-sub">単語</span>
          <span className="sk-callout-sub">意味</span>
          <span />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['apple', 'りんご'],
            ['meticulous', '几帳面な'],
            ['ephemeral', '儚い・短命の'],
            ['', ''],
            ['', ''],
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 24px', gap: 6, alignItems: 'center' }}>
              <SkInput defaultValue={row[0]} placeholder="word" style={{ fontSize: 13, padding: '5px 8px' }} />
              <SkInput defaultValue={row[1]} placeholder="意味" style={{ fontSize: 13, padding: '5px 8px' }} />
              <SkIcon kind="x" size={16} color="var(--ink-soft)" />
            </div>
          ))}
          <SkBtn ghost style={{ alignSelf: 'flex-start', fontSize: 13, padding: '4px 8px' }}>
            <SkIcon kind="plus" size={14} /> 行を追加
          </SkBtn>
        </div>
      </div>
      <div style={{ padding: 14, borderTop: '1.4px dashed var(--ink-soft)', display: 'flex', gap: 8 }}>
        <SkBtn ghost style={{ flex: 1, justifyContent: 'center' }}>CSVから貼り付け</SkBtn>
        <SkBtn primary style={{ flex: 1, justifyContent: 'center' }}>3件を追加</SkBtn>
      </div>
    </div>
  );
}

// ─── 8. STATS — variant A: RPG style ───
function MScreenStatsA({ onNav = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="プロフィール" sub="LV. 7 — 見習い学者" />
      <div style={{ flex: 1, padding: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* hero card */}
        <SkBox thick shadow="accent" style={{ padding: 14, background: 'linear-gradient(180deg, var(--paper) 0%, #fcefdb 100%)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              border: '2px solid var(--ink)', background: 'var(--accent-soft)',
              display: 'grid', placeItems: 'center', boxShadow: '2px 3px 0 var(--ink)',
              fontFamily: 'var(--script)', fontSize: 44, lineHeight: 1,
            }}>7</div>
            <div style={{ flex: 1 }}>
              <div className="sk-script" style={{ fontSize: 26, lineHeight: 1 }}>見習い学者</div>
              <div className="sk-callout-sub">Apprentice Scholar</div>
              <SkProgress value={62} style={{ marginTop: 6 }} />
              <div className="sk-callout-sub" style={{ marginTop: 2 }}>490 / 640 XP — 次のLvまで150</div>
            </div>
          </div>
        </SkBox>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SkBox style={{ padding: 8 }}>
            <div className="sk-callout-sub">累計解答</div>
            <div className="sk-script" style={{ fontSize: 28, lineHeight: 1 }}>490</div>
          </SkBox>
          <SkBox style={{ padding: 8 }}>
            <div className="sk-callout-sub">平均正答率</div>
            <div className="sk-script" style={{ fontSize: 28, lineHeight: 1, color: 'var(--green)' }}>61%</div>
          </SkBox>
          <SkBox style={{ padding: 8 }}>
            <div className="sk-callout-sub">🔥 最高ストリーク</div>
            <div className="sk-script" style={{ fontSize: 28, lineHeight: 1, color: 'var(--accent)' }}>23</div>
          </SkBox>
          <SkBox style={{ padding: 8 }}>
            <div className="sk-callout-sub">登録単語</div>
            <div className="sk-script" style={{ fontSize: 28, lineHeight: 1 }}>114</div>
          </SkBox>
        </div>

        {/* Box breakdown */}
        <SkBox style={{ padding: 10, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div style={{ fontWeight: 700 }}>ボックス別</div>
            <span className="sk-callout-sub">回答数 / 平均正答率</span>
          </div>
          {BOXES.slice(0, 4).map(b => (
            <div key={b.n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 50px', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <SkTag>{b.n}</SkTag>
              <SkProgress value={Math.min(100, b.count * 4)} style={{ height: 10 }} />
              <span className="sk-callout-sub" style={{ textAlign: 'right' }}>{b.count * 4}回</span>
            </div>
          ))}
        </SkBox>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          {[
            { icon: 'flame', label: 'Streak10', got: true },
            { icon: 'medal', label: '100回', got: true },
            { icon: 'star', label: 'Lv.5', got: true },
            { icon: 'book', label: '満点 Box', got: false },
          ].map((bg, i) => (
            <div key={i} style={{
              flex: 1, padding: 6, textAlign: 'center',
              border: '1.4px solid var(--ink)', borderRadius: '4px 7px 4px 7px',
              background: bg.got ? 'var(--accent-soft)' : 'var(--paper-soft)',
              opacity: bg.got ? 1 : 0.5,
            }}>
              <SkIcon kind={bg.icon} size={22} />
              <div className="sk-callout-sub" style={{ marginTop: 2 }}>{bg.label}</div>
            </div>
          ))}
        </div>
      </div>
      <MobileTabBar active="stats" onNav={onNav} />
    </div>
  );
}

// ─── STATS variant B: data-first ───
function MScreenStatsB({ onNav = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="統計" sub="DATA VIEW" />
      <div style={{ flex: 1, padding: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SkBox shaded style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="sk-script" style={{ fontSize: 32, lineHeight: 1 }}>Lv.7</span>
          <div style={{ flex: 1 }}>
            <SkProgress value={62} />
            <div className="sk-callout-sub" style={{ marginTop: 2 }}>490 / 640 XP</div>
          </div>
        </SkBox>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <SkBox style={{ padding: 6, textAlign: 'center' }}><div className="sk-callout-sub">解答</div><div style={{ fontWeight: 700, fontSize: 18 }}>490</div></SkBox>
          <SkBox style={{ padding: 6, textAlign: 'center' }}><div className="sk-callout-sub">正答率</div><div style={{ fontWeight: 700, fontSize: 18 }}>61%</div></SkBox>
          <SkBox style={{ padding: 6, textAlign: 'center' }}><div className="sk-callout-sub">🔥 最高</div><div style={{ fontWeight: 700, fontSize: 18 }}>23</div></SkBox>
        </div>

        {/* ascii-ish chart */}
        <SkBox style={{ padding: 10, flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>ボックス別 正答率推移</div>
          <div style={{
            position: 'relative', height: '60%', borderBottom: '1.4px solid var(--ink)',
            borderLeft: '1.4px solid var(--ink)', padding: '6px 4px 0',
          }}>
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <polyline points="0,40 16,38 32,30 48,24 64,16 80,10 100,6"
                fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinejoin="round" />
              <g fill="var(--ink)">
                <circle cx="0" cy="40" r="1.6"/><circle cx="16" cy="38" r="1.6"/>
                <circle cx="32" cy="30" r="1.6"/><circle cx="48" cy="24" r="1.6"/>
                <circle cx="64" cy="16" r="1.6"/><circle cx="80" cy="10" r="1.6"/>
                <circle cx="100" cy="6" r="1.6"/>
              </g>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', marginTop: 4 }}>
            {[1,2,3,4,5,6,7].map(n => <span key={n}>B{n}</span>)}
          </div>
        </SkBox>

        <div className="sk-callout-sub">
          XP = 累計解答数 · 必要XP公式: <span className="sk-mono">10 × Lv²</span>
        </div>
      </div>
      <MobileTabBar active="stats" onNav={onNav} />
    </div>
  );
}

// ─── 9. EMPTY STATE ───
function MScreenEmpty({ onNav = () => {}, onImport = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="単語帳" sub="空っぽです" />
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, textAlign: 'center' }}>
        {/* placeholder illustration: stack of empty boxes */}
        <div style={{ position: 'relative', width: 180, height: 120 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              position: 'absolute', left: 30 + i * 6, top: 20 - i * 8,
              width: 110, height: 70,
              border: '1.8px dashed var(--ink-soft)',
              background: 'var(--paper-soft)',
              borderRadius: '4px 8px 4px 8px',
              transform: `rotate(${i * 4 - 4}deg)`,
            }}/>
          ))}
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            fontFamily: 'var(--script)', fontSize: 22, color: 'var(--ink-soft)',
          }}>empty</div>
        </div>
        <div>
          <div className="sk-script" style={{ fontSize: 32, lineHeight: 1, marginBottom: 4 }}>まだ単語がありません</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            「単語, 意味」のリストを<br/>貼り付けて、はじめましょう。
          </div>
        </div>
        <SkBtn primary onClick={onImport} style={{ padding: '10px 18px' }}>
          <SkIcon kind="upload" size={18} /> 単語をインポート
        </SkBtn>
        <SkBtn ghost style={{ fontSize: 13 }}>サンプル単語で試す</SkBtn>
      </div>
      <MobileTabBar active="list" onNav={onNav} />
    </div>
  );
}

Object.assign(window, {
  MScreenBoxQuiz, MScreenResultOK, MScreenResultNG,
  MScreenListA, MScreenListB, MScreenImportA, MScreenImportB,
  MScreenStatsA, MScreenStatsB, MScreenEmpty,
});
