/* wf-screens-desktop.jsx — desktop wireframe screens (1000 × 640) */

function DesktopShell({ active, onNav, children, title, sub, right }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex' }}>
      <DesktopSideNav active={active} onNav={onNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1.4px dashed var(--ink-soft)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--script)', fontSize: 32, lineHeight: 1 }}>{title}</div>
            {sub && <div className="sk-callout-sub" style={{ marginTop: 2 }}>{sub}</div>}
          </div>
          {right}
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── DESKTOP: MAIN (全単語モード) ───
function DScreenMain({ onNav = () => {}, onAnswer = () => {} }) {
  const meanings = ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <DesktopShell active="home" onNav={onNav} title="全単語モード" sub="ALL · 142 単語 · ランダム出題"
      right={<><SkTag accent>🔥 5 streak</SkTag><SkTag>Lv. 7</SkTag></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, height: '100%' }}>
        {/* Left: flashcard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SkBox thick shadow style={{ padding: 32, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div className="sk-callout-sub" style={{ marginBottom: 12 }}>この単語の意味は？</div>
            <div className="sk-script" style={{ fontSize: 88, lineHeight: 1, marginBottom: 8 }}>apple</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-soft)' }}>/ ˈæp.əl /</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              <SkTag>試行 12</SkTag>
              <SkTag green>正答率 92%</SkTag>
              <SkTag accent>Box 5</SkTag>
            </div>
          </SkBox>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {meanings.map((m, i) => (
              <SkBtn key={i} onClick={() => onAnswer(i === 0)}
                style={{ padding: '18px 14px', fontSize: 18, justifyContent: 'flex-start' }}>
                <span style={{
                  width: 28, height: 28, border: '1.4px solid currentColor', borderRadius: '50%',
                  display: 'grid', placeItems: 'center', fontSize: 14, marginRight: 10,
                }}>{String.fromCharCode(65 + i)}</span>
                {m}
              </SkBtn>
            ))}
          </div>
        </div>

        {/* Right: session + keyboard hints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkBox shaded style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>今日のセッション</div>
              <span className="sk-callout-sub">8 / 50</span>
            </div>
            <SkProgress value={16} style={{ marginTop: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
              <span>正解 5</span>
              <span>不正解 3</span>
              <span>正答率 62%</span>
            </div>
          </SkBox>

          <SkBox style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>ショートカット</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
              {[
                ['1 – 4', '選択肢を選ぶ'],
                ['Space', '次へ'],
                ['?', 'ヒント (将来)'],
                ['S', '🔊 読み上げ (将来)'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 8 }}>
                  <span className="sk-mono" style={{
                    border: '1.3px solid var(--ink)', padding: '0 6px', borderRadius: 4,
                    fontSize: 11, minWidth: 50, textAlign: 'center',
                  }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </SkBox>

          <SkBox style={{ padding: 14, flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>直前の結果</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ['serendipity', true],
                ['lucid', true],
                ['obfuscate', false],
                ['gregarious', false],
                ['pragmatic', true],
              ].map(([w, ok], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, alignItems: 'center' }}>
                  <span style={{ color: ok ? 'var(--green)' : 'var(--red)', fontWeight: 700, width: 14 }}>{ok ? '✓' : '✗'}</span>
                  <span style={{ flex: 1 }}>{w}</span>
                  <span className="sk-callout-sub">+{ok ? 1 : 0} XP</span>
                </div>
              ))}
            </div>
          </SkBox>
        </div>
      </div>
    </DesktopShell>
  );
}

// ─── DESKTOP: BOXES (本棚) ───
function DScreenBoxes({ onNav = () => {}, selected = 2 }) {
  return (
    <DesktopShell active="boxes" onNav={onNav} title="ボックス別モード" sub="LEITNER · 7 BOXES · 正答率で自動振り分け"
      right={<SkBtn primary>選択 Box で出題 →</SkBtn>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, height: '100%' }}>
        {/* Bookshelf */}
        <SkBox style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
          <div className="sk-script" style={{ fontSize: 22, lineHeight: 1 }}>本棚</div>
          <div className="sk-callout-sub" style={{ marginBottom: 10 }}>苦手 ←  → 得意</div>
          <div style={{
            flex: 1, position: 'relative',
            borderBottom: '4px solid var(--ink)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
            paddingBottom: 0, gap: 6,
          }}>
            {BOXES.map((b, i) => {
              const on = b.n === selected;
              const tilt = (i % 4 === 1) ? -3 : (i % 4 === 2 ? 2 : i % 4 === 3 ? -1 : 0);
              const h = 130 + b.n * 22;
              return (
                <div key={b.n} className="sk-hit"
                  style={{
                    width: 54, height: h, background: b.color,
                    border: on ? '2.4px solid var(--ink)' : '1.6px solid var(--ink)',
                    borderRadius: '3px 3px 0 0',
                    transform: `rotate(${tilt}deg) translateY(${on ? -8 : 0}px)`,
                    transformOrigin: 'bottom center',
                    boxShadow: on ? '3px 4px 0 var(--accent)' : '2px 3px 0 var(--ink)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    padding: '10px 0', alignItems: 'center',
                  }}>
                  <div style={{ fontFamily: 'var(--script)', fontSize: 32, lineHeight: 1 }}>{b.n}</div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 10, writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)', color: 'var(--ink-soft)', lineHeight: 1,
                  }}>{b.range}</div>
                  <div style={{ fontFamily: 'var(--hand)', fontWeight: 700, fontSize: 12 }}>{b.count}</div>
                </div>
              );
            })}
          </div>
        </SkBox>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkBox thick shadow="accent" style={{ padding: 18 }}>
            <div className="sk-callout-sub">選択中</div>
            <div className="sk-script" style={{ fontSize: 44, lineHeight: 1 }}>Box {selected}</div>
            <div style={{ marginTop: 4 }}>正確度 26 – 40%</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <SkTag>18 単語</SkTag>
              <SkTag>累計 72 回</SkTag>
              <SkTag green>平均 34%</SkTag>
            </div>
            <SkBtn primary style={{ marginTop: 14, width: '100%', justifyContent: 'center', padding: '10px' }}>
              このボックスで出題 (18) →
            </SkBtn>
          </SkBox>

          <SkBox style={{ padding: 14, flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>含まれる単語 (抜粋)</div>
            {SAMPLE_WORDS.filter(w => w.acc >= 26 && w.acc <= 40).map((w, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 50px', gap: 8, padding: '4px 0', borderBottom: '1px dashed var(--ink-light)', fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                <span className="sk-mono" style={{ textAlign: 'right' }}>{w.acc}%</span>
              </div>
            ))}
            <div className="sk-callout-sub" style={{ marginTop: 6 }}>… 他 15 件</div>
          </SkBox>
        </div>
      </div>
    </DesktopShell>
  );
}

// ─── DESKTOP: WORD LIST ───
function DScreenList({ onNav = () => {} }) {
  return (
    <DesktopShell active="list" onNav={onNav} title="単語の管理" sub={`${SAMPLE_WORDS.length} 件登録 · 累計試行 ${SAMPLE_WORDS.reduce((s,w)=>s+w.attempts,0)}`}
      right={<>
        <SkBtn ghost><SkIcon kind="search" size={16} /> 検索</SkBtn>
        <SkBtn><SkIcon kind="upload" size={16} /> インポート</SkBtn>
        <SkBtn primary><SkIcon kind="plus" size={16} /> 新規</SkBtn>
      </>}>
      <SkBox style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1.4fr 1.6fr 80px 110px 70px 32px',
          padding: '10px 14px', borderBottom: '1.6px solid var(--ink)',
          background: 'var(--paper-soft)', gap: 10, alignItems: 'center',
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase',
        }}>
          <div style={{ width: 16, height: 16, border: '1.4px solid var(--ink-soft)', borderRadius: 3 }}/>
          <span>WORD</span>
          <span>MEANING</span>
          <span>BOX</span>
          <span>ACCURACY</span>
          <span>ATTEMPTS</span>
          <span/>
        </div>
        {/* Rows */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {SAMPLE_WORDS.map((w, i) => {
            const box = BOXES.find(b => w.acc >= ({1:0,2:26,3:41,4:56,5:76,6:91,7:96}[b.n]))?.n || 1;
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '32px 1.4fr 1.6fr 80px 110px 70px 32px',
                padding: '10px 14px', gap: 10, alignItems: 'center',
                borderBottom: '1px dashed var(--ink-light)',
              }}>
                <div style={{ width: 16, height: 16, border: '1.4px solid var(--ink)', borderRadius: 3 }}/>
                <span style={{ fontWeight: 700 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                <SkTag>Box {box}</SkTag>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SkProgress value={w.acc} style={{ flex: 1, height: 10 }} />
                  <span className="sk-mono" style={{ fontSize: 11, width: 28, textAlign: 'right' }}>{w.acc}%</span>
                </div>
                <span className="sk-mono" style={{ fontSize: 12 }}>{w.correct}/{w.attempts}</span>
                <SkIcon kind="dots" size={16} color="var(--ink-soft)" />
              </div>
            );
          })}
        </div>
      </SkBox>
    </DesktopShell>
  );
}

// ─── DESKTOP: IMPORT ───
function DScreenImport({ onNav = () => {} }) {
  const csv = `apple, りんご
meticulous, 几帳面な
ephemeral, 儚い・短命の
gregarious, 社交的な
serendipity, 偶然の幸運
obfuscate, 不明瞭にする`;
  return (
    <DesktopShell active="import" onNav={onNav} title="単語をインポート" sub="CSV · TSV · プレーンテキスト">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: '100%' }}>
        {/* Left: input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkBox dashed shaded style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <SkIcon kind="upload" size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>ファイルをドロップ</div>
              <div className="sk-callout-sub">.csv / .tsv / .txt — UTF-8</div>
            </div>
            <SkBtn>ファイル選択</SkBtn>
          </SkBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SkHR style={{ flex: 1 }} />
            <span className="sk-callout-sub">または、直接ペースト</span>
            <SkHR style={{ flex: 1 }} />
          </div>
          <SkInput area defaultValue={csv} style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="sk-callout-sub">区切り:</span>
            <SkTag accent>カンマ</SkTag>
            <SkTag>タブ</SkTag>
            <SkTag>改行</SkTag>
            <span className="sk-callout-sub" style={{ flex: 1, textAlign: 'right' }}>自動判定: カンマ</span>
          </div>
        </div>

        {/* Right: preview */}
        <SkBox style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1.4px solid var(--ink)', background: 'var(--paper-soft)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700 }}>プレビュー</div>
            <span className="sk-callout-sub">6 件検出 · 0 重複</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {SAMPLE_WORDS.slice(0, 6).map((w, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1.4fr 60px',
                padding: '8px 14px', gap: 10, fontSize: 13,
                borderBottom: '1px dashed var(--ink-light)', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700 }}>{w.word}</span>
                <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
                <SkTag green>新規</SkTag>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1.4px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper-soft)' }}>
            <span className="sk-callout-sub">6 単語を追加します。既存は影響しません。</span>
            <SkBtn primary>追加する →</SkBtn>
          </div>
        </SkBox>
      </div>
    </DesktopShell>
  );
}

// ─── DESKTOP: STATS ───
function DScreenStats({ onNav = () => {} }) {
  return (
    <DesktopShell active="stats" onNav={onNav} title="統計 & レベル" sub="PROFILE · PROGRESS · BADGES"
      right={<SkTag accent>🔥 5 streak</SkTag>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 16, height: '100%' }}>
        {/* Hero */}
        <SkBox thick shadow="accent" style={{ padding: 18, gridColumn: '1 / 2', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            border: '2.4px solid var(--ink)', background: 'var(--accent-soft)',
            display: 'grid', placeItems: 'center', boxShadow: '3px 4px 0 var(--ink)',
            fontFamily: 'var(--script)', fontSize: 60, lineHeight: 1,
          }}>7</div>
          <div style={{ flex: 1 }}>
            <div className="sk-script" style={{ fontSize: 38, lineHeight: 1 }}>見習い学者</div>
            <div className="sk-callout-sub" style={{ marginBottom: 8 }}>Apprentice Scholar · Lv. 7</div>
            <SkProgress value={62} />
            <div className="sk-callout-sub" style={{ marginTop: 4 }}>490 / 640 XP — Lv. 8 まで残り 150</div>
          </div>
        </SkBox>

        {/* KPI strip */}
        <div style={{ gridColumn: '2 / 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10 }}>
          {[
            ['累計解答', '490', null],
            ['平均正答率', '61%', 'green'],
            ['🔥 最高 Streak', '23', 'accent'],
            ['登録単語', '114', null],
          ].map(([k, v, c], i) => (
            <SkBox key={i} shadow="soft" style={{ padding: 12 }}>
              <div className="sk-callout-sub">{k}</div>
              <div className="sk-script" style={{ fontSize: 38, lineHeight: 1, color: c === 'green' ? 'var(--green)' : c === 'accent' ? 'var(--accent)' : 'var(--ink)' }}>{v}</div>
            </SkBox>
          ))}
        </div>

        {/* Box breakdown chart */}
        <SkBox style={{ padding: 16, gridColumn: '1 / 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>ボックス別 · 回答数 / 平均正答率</div>
            <span className="sk-callout-sub">B1 – B4 が学習集中ゾーン</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 14, paddingTop: 16, borderBottom: '1.4px solid var(--ink)' }}>
            {BOXES.map(b => (
              <div key={b.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span className="sk-mono" style={{ fontSize: 10, color: 'var(--ink-soft)' }}>{b.count * 4}回</span>
                <div style={{
                  width: '70%', height: `${20 + b.count * 3}px`,
                  background: b.color, border: '1.5px solid var(--ink)',
                  boxShadow: '1.5px 2px 0 var(--ink)',
                  borderRadius: '3px 5px 0 0',
                }}/>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 4 }}>
            {BOXES.map(b => (
              <div key={b.n} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 700 }}>B{b.n}</div>
                <div className="sk-callout-sub">{b.range}</div>
              </div>
            ))}
          </div>
        </SkBox>

        {/* Badges + roadmap */}
        <SkBox style={{ padding: 14, gridColumn: '2 / 3' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>バッジ & ランク</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[
              { i: 'flame', l: 'Streak 10', got: true },
              { i: 'medal', l: '100回',   got: true },
              { i: 'star',  l: 'Lv. 5',    got: true },
              { i: 'book',  l: '満Box',   got: false },
              { i: 'medal', l: '1000回',  got: false },
            ].map((bg, i) => (
              <div key={i} style={{
                padding: 8, textAlign: 'center',
                border: '1.4px solid var(--ink)', borderRadius: '4px 7px 4px 7px',
                background: bg.got ? 'var(--accent-soft)' : 'var(--paper-soft)',
                opacity: bg.got ? 1 : 0.5,
              }}>
                <SkIcon kind={bg.i} size={28} />
                <div className="sk-callout-sub" style={{ marginTop: 2 }}>{bg.l}</div>
              </div>
            ))}
          </div>
          <SkHR style={{ margin: '12px 0' }} />
          <div className="sk-callout-sub" style={{ marginBottom: 6 }}>レベル設計 — 必要XP = 10 × Lv²</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 50 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(lv => (
              <div key={lv} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 6 + lv * 3, background: lv === 7 ? 'var(--accent)' : 'var(--paper-shade)',
                  border: '1.2px solid var(--ink)',
                  borderRadius: 2,
                }}/>
                <div className="sk-callout-sub" style={{ fontSize: 9 }}>L{lv}</div>
              </div>
            ))}
          </div>
        </SkBox>
      </div>
    </DesktopShell>
  );
}

Object.assign(window, {
  DesktopShell, DScreenMain, DScreenBoxes, DScreenList, DScreenImport, DScreenStats,
});
