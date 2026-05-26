/* wf-screens-mobile.jsx — all mobile wireframe screens (360 × 720) */

// shared dummy data
const SAMPLE_WORDS = [
  { word: 'apple', meaning: 'りんご', attempts: 12, correct: 11, acc: 92 },
  { word: 'meticulous', meaning: '几帳面な', attempts: 8, correct: 3, acc: 38 },
  { word: 'ephemeral', meaning: '儚い・短命の', attempts: 6, correct: 5, acc: 83 },
  { word: 'gregarious', meaning: '社交的な', attempts: 4, correct: 1, acc: 25 },
  { word: 'serendipity', meaning: '偶然の幸運', attempts: 14, correct: 13, acc: 93 },
  { word: 'obfuscate', meaning: '不明瞭にする', attempts: 5, correct: 2, acc: 40 },
  { word: 'lucid', meaning: '明快な', attempts: 9, correct: 7, acc: 78 },
  { word: 'pragmatic', meaning: '実用的な', attempts: 10, correct: 4, acc: 40 },
];

const BOXES = [
  { n: 1, range: '0–25%', count: 12, color: '#f4ccc8' },
  { n: 2, range: '26–40%', count: 18, color: '#f7d9b9' },
  { n: 3, range: '41–55%', count: 23, color: '#f3e6b0' },
  { n: 4, range: '56–75%', count: 29, color: '#dde8bb' },
  { n: 5, range: '76–90%', count: 19, color: '#c8e1c4' },
  { n: 6, range: '91–95%', count: 9,  color: '#bcd8d0' },
  { n: 7, range: '96–100%', count: 4, color: '#cdc8e3' },
];

// ─── 1. LOGIN ───
function MScreenLogin({ onNav = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--script)', fontSize: 68, lineHeight: 1, color: 'var(--ink)' }}>Vocab</div>
          <div className="sk-callout-sub" style={{ marginTop: 4 }}>// flashcard beta</div>
        </div>
        <SkBox shaded style={{ padding: 16, width: '100%', textAlign: 'center' }}>
          <div className="sk-script" style={{ fontSize: 22, lineHeight: 1.2 }}>
            覚えるのが苦手な単語<br/>だけを、もう一度。
          </div>
        </SkBox>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <SkBtn primary onClick={() => onNav('home')} style={{ width: '100%', padding: '12px 14px', fontSize: 16, justifyContent: 'center' }}>
            <SkIcon kind="google" size={20} /> Googleでログイン
          </SkBtn>
          <SkBtn ghost style={{ width: '100%', justifyContent: 'center' }}>ゲストで試す</SkBtn>
        </div>
        <div className="sk-callout-sub" style={{ marginTop: 6 }}>
          ログインデータはアカウントに紐付け保存
        </div>
      </div>
      <div style={{ padding: 10, textAlign: 'center', borderTop: '1.4px dashed var(--ink-light)', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-light)' }}>
        © vocab · v0.1.0-beta
      </div>
    </div>
  );
}

// ─── 2. MAIN (全単語モード) — variant A: stacked card ───
function MScreenMainA({ onNav = () => {}, onAnswer = () => {} }) {
  const meanings = ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader
        title="全単語モード"
        sub="ALL · RANDOM"
        left={<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="sk-tag accent" style={{ fontWeight: 700 }}>Lv 7</span>
        </div>}
        right={<SkIcon kind="settings" size={20} />}
      />
      <div style={{ padding: '8px 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <SkProgress value={62} style={{ flex: 1 }} />
        <span className="sk-callout-sub">62/100 XP</span>
      </div>

      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SkBox thick shadow style={{ padding: '24px 18px', flex: '0 0 auto', textAlign: 'center', background: 'var(--paper)' }}>
          <div className="sk-callout-sub" style={{ marginBottom: 8 }}>この単語の意味は？</div>
          <div className="sk-script" style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>apple</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>/ ˈæp.əl /</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            <SkTag>試行 12</SkTag>
            <SkTag green>正答率 92%</SkTag>
            <SkTag>Box 5</SkTag>
          </div>
        </SkBox>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {meanings.map((m, i) => (
            <SkBtn key={i} onClick={() => onAnswer(i === 0)} style={{ padding: '14px 8px', fontSize: 15, justifyContent: 'center', lineHeight: 1.2 }}>
              {String.fromCharCode(65 + i)}. {m}
            </SkBtn>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span className="sk-callout-sub">🔥 連続 4問正解中</span>
          <SkBtn ghost style={{ fontSize: 13, padding: '4px 8px' }}>スキップ →</SkBtn>
        </div>
      </div>

      <MobileTabBar active="home" onNav={onNav} />
    </div>
  );
}

// ─── MAIN variant B: minimal ─── 
function MScreenMainB({ onNav = () => {}, onAnswer = () => {} }) {
  const meanings = ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <div style={{ padding: '14px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sk-callout-sub">8 / 50 問</div>
        <div className="sk-callout-sub" style={{ color: 'var(--accent)' }}>🔥 4 streak</div>
      </div>
      <SkProgress value={16} style={{ margin: '0 14px' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, gap: 30 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="sk-callout-sub" style={{ marginBottom: 14 }}>意味を選んでね</div>
          <div className="sk-script" style={{ fontSize: 56, lineHeight: 1 }}>apple</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>/ ˈæp.əl /</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {meanings.map((m, i) => (
            <SkBtn key={i} onClick={() => onAnswer(i === 0)} style={{ padding: '12px 14px', fontSize: 15, justifyContent: 'flex-start' }}>
              <span style={{
                width: 22, height: 22, border: '1.4px solid currentColor', borderRadius: '50%',
                display: 'grid', placeItems: 'center', fontSize: 12, marginRight: 8,
              }}>{String.fromCharCode(65 + i)}</span>
              {m}
            </SkBtn>
          ))}
        </div>
      </div>
      <MobileTabBar active="home" onNav={onNav} />
    </div>
  );
}

// ─── MAIN variant C: meta panel + swipe affordance ───
function MScreenMainC({ onNav = () => {}, onAnswer = () => {} }) {
  const meanings = ['りんご', '儚い・短命の', '社交的な', '偶然の幸運'];
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="全単語モード" sub="ALL · 142 単語" left={<SkIcon kind="back" size={20} />} right={<SkIcon kind="dots" size={20} />}/>
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkBox shadow="accent" thick style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1.3px dashed var(--ink-soft)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
            <span>CARD · #042</span>
            <span>BOX 5 · 92%</span>
          </div>
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div className="sk-script" style={{ fontSize: 50, lineHeight: 1 }}>apple</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>/ ˈæp.əl /</div>
          </div>
          <div style={{ padding: '6px 12px 8px', borderTop: '1.3px dashed var(--ink-soft)', display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>
            <span>← 前へ</span>
            <span>↑ 詳細</span>
            <span>次へ →</span>
          </div>
        </SkBox>

        <div className="sk-callout-sub" style={{ textAlign: 'center' }}>
          ─── 意味を選択 ───
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
          {meanings.map((m, i) => (
            <SkBtn key={i} onClick={() => onAnswer(i === 0)} style={{ padding: 8, fontSize: 14, justifyContent: 'center', height: '100%', minHeight: 64 }}>
              {m}
            </SkBtn>
          ))}
        </div>
      </div>
      <MobileTabBar active="home" onNav={onNav} />
    </div>
  );
}

// ─── 3. BOX SELECTION variant A: vertical stacked books (本棚) ───
function MScreenBoxesA({ onNav = () => {}, onPick = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="ボックス一覧" sub="LEITNER · 7 BOXES" right={<SkIcon kind="settings" size={20} />} />
      <div style={{ flex: 1, padding: '14px 14px 8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="sk-callout-sub" style={{ marginBottom: 8 }}>↓ 上にいくほど熟知</div>
        <div style={{
          flex: 1, position: 'relative',
          background: 'repeating-linear-gradient(0deg, transparent 0 38px, rgba(0,0,0,0.06) 38px 39px)',
          borderLeft: '1.8px solid var(--ink)', borderRight: '1.8px solid var(--ink)',
          padding: '4px 6px', display: 'flex', flexDirection: 'column-reverse', gap: 6,
        }}>
          {BOXES.map((b) => (
            <div key={b.n} className="sk-hit" onClick={() => onPick(b.n)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', border: '1.5px solid var(--ink)',
                borderRadius: '4px 8px 4px 8px',
                background: b.color, boxShadow: '1.5px 2px 0 var(--ink)',
                height: `calc(${28 + b.n * 4}px)`,
              }}>
              <div style={{ fontFamily: 'var(--script)', fontSize: 28, lineHeight: 1, width: 24 }}>{b.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--hand)', fontWeight: 700, fontSize: 13, lineHeight: 1.1 }}>Box {b.n}</div>
                <div className="sk-callout-sub">{b.range}</div>
              </div>
              <SkTag>{b.count} 単語</SkTag>
            </div>
          ))}
        </div>
        <div className="sk-callout-sub" style={{ marginTop: 8 }}>↑ 下にいくほど苦手</div>
      </div>
      <MobileTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

// ─── BOX variant B: horizontal shelf metaphor — books leaning ───
function MScreenBoxesB({ onNav = () => {}, onPick = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="本棚" sub="BOOKSHELF VIEW" />
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="sk-script" style={{ fontSize: 22, lineHeight: 1 }}>苦手 → 得意</div>
        <div style={{
          flex: 1, position: 'relative',
          borderBottom: '3px solid var(--ink)',
          padding: '40px 4px 0',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          background: 'linear-gradient(180deg, transparent 60%, rgba(217,122,60,0.08) 100%)',
        }}>
          {BOXES.map((b, i) => {
            const tilt = (i % 3 === 1) ? 'rotate(-3deg)' : (i % 3 === 2 ? 'rotate(2deg)' : 'none');
            const h = 90 + b.n * 14;
            return (
              <div key={b.n} className="sk-hit" onClick={() => onPick(b.n)}
                style={{
                  width: 32, height: h, background: b.color,
                  border: '1.6px solid var(--ink)', borderRadius: '2px 2px 0 0',
                  transform: tilt, transformOrigin: 'bottom center',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '6px 0', alignItems: 'center', boxShadow: '1.5px 2px 0 var(--ink)',
                }}>
                <div style={{ fontFamily: 'var(--script)', fontSize: 22, lineHeight: 1 }}>{b.n}</div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 9, writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)', color: 'var(--ink-soft)',
                }}>{b.count}単語</div>
              </div>
            );
          })}
        </div>
        <SkBox shaded style={{ padding: 10 }}>
          <div className="sk-script" style={{ fontSize: 18, lineHeight: 1, marginBottom: 4 }}>選択中：Box 2</div>
          <div className="sk-callout-sub">26–40% · 18 単語</div>
          <SkBtn primary style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>このボックスで出題 →</SkBtn>
        </SkBox>
      </div>
      <MobileTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

// ─── BOX variant C: drawer / cabinet ───
function MScreenBoxesC({ onNav = () => {}, onPick = () => {} }) {
  return (
    <div className="sk-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader title="ボックス" sub="DRAWER VIEW" />
      <div style={{ flex: 1, padding: 14, overflow: 'hidden' }}>
        <div style={{
          border: '2px solid var(--ink)', borderRadius: '4px 6px 4px 6px',
          background: 'var(--paper-soft)', padding: 8, height: '100%',
          display: 'flex', flexDirection: 'column', gap: 6,
          boxShadow: '3px 4px 0 var(--ink)',
        }}>
          {BOXES.map((b) => (
            <div key={b.n} className="sk-hit" onClick={() => onPick(b.n)}
              style={{
                flex: 1, display: 'grid',
                gridTemplateColumns: '36px 1fr auto auto',
                gap: 8, alignItems: 'center',
                padding: '0 10px',
                background: b.color,
                border: '1.4px solid var(--ink)',
                borderRadius: '3px 5px 3px 5px',
              }}>
              <div style={{ fontFamily: 'var(--script)', fontSize: 26, lineHeight: 1 }}>#{b.n}</div>
              <div className="sk-callout-sub">{b.range}</div>
              <SkTag>{b.count}</SkTag>
              <span style={{
                width: 14, height: 4, border: '1.3px solid var(--ink)',
                background: 'var(--paper)', borderRadius: 2,
              }} title="取っ手"/>
            </div>
          ))}
        </div>
      </div>
      <MobileTabBar active="boxes" onNav={onNav} />
    </div>
  );
}

Object.assign(window, {
  SAMPLE_WORDS, BOXES,
  MScreenLogin, MScreenMainA, MScreenMainB, MScreenMainC,
  MScreenBoxesA, MScreenBoxesB, MScreenBoxesC,
});
