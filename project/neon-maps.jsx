/* neon-maps.jsx — Cosmic map system: 10 maps × 8 stages each */

// Stage N of map M needs level ((M-1)*8 + N) * 5
//   Map 1 Stage 1 → LV 5 (initial)
//   Map 1 Stage 8 → LV 40 (last stage of solar system)
//   Map 2 Stage 1 → LV 45 (just one stage later)
//   Map 10 Stage 8 → LV 400 (cosmic endgame)
function stageUnlockLevel(mapIdx, stageIdx) {
  return (mapIdx * 8 + stageIdx + 1) * 5;
}

const MAPS = [
  { id: 1, name: '太陽系エリア',          en: 'Solar System',         color: '#5ce8ff', stages: [
    { name: '地球',             sub: '基本チュートリアル・戦闘' },
    { name: '月',               sub: '低重力アクション' },
    { name: '水星',             sub: '灼熱タイムアタック' },
    { name: '金星',             sub: '酸性雨サバイバル' },
    { name: '火星',             sub: '廃墟探索・中ボス戦' },
    { name: 'アステロイドベルト', sub: '岩石回避パズル' },
    { name: '木星',             sub: '超重力バトル' },
    { name: '海王星',           sub: '極寒ボス戦・太陽系脱出' },
  ]},
  { id: 2, name: '太陽系外縁・衛星エリア',  en: 'Outer Solar / Moons',  color: '#a079ff', stages: [
    { name: '冥王星',           sub: '氷上スライドパズル' },
    { name: '衛星イオ',         sub: '火山弾アスレチック' },
    { name: '衛星エウロパ',     sub: '水中深海探索' },
    { name: '衛星タイタン',     sub: 'メタンの海・ボート戦' },
    { name: 'ケレス鉱山',       sub: '資源大量ボーナス' },
    { name: 'エリス',           sub: '暗闇ステルスミッション' },
    { name: 'ボイジャー1号',    sub: '古代データ回収パズル' },
    { name: 'オールトの雲',     sub: '彗星群ディフェンス戦' },
  ]},
  { id: 3, name: 'ミルキー銀河・オリオン腕', en: 'Milky Way · Orion Arm', color: '#ff5ce0', stages: [
    { name: 'シリウス星系',     sub: '高速ドッグファイト' },
    { name: 'プロキオン',       sub: '二連星ギミックバトル' },
    { name: 'プレアデス星団',   sub: '星屑コレクト任務' },
    { name: 'オリオン大星雲',   sub: '濃霧迷宮探索' },
    { name: 'ベテルギウス',     sub: '崩壊プラットフォーム' },
    { name: 'リゲル',           sub: '高エネルギー回避' },
    { name: 'カニ星雲',         sub: 'パルサー周期ビーム' },
    { name: 'はくちょう座X-1',  sub: 'ブラックホール吸引ボス' },
  ]},
  { id: 4, name: 'ミルキー銀河・ペルセウス腕', en: 'Milky Way · Perseus Arm', color: '#a6ff5c', stages: [
    { name: 'ケプラー22b',      sub: '海洋惑星アスレチック' },
    { name: 'TRAPPIST-1',       sub: '7連惑星ラッシュ' },
    { name: 'タビーの星',       sub: '巨大建造物パズル' },
    { name: 'プロトディスク',   sub: '原始塵の嵐サバイバル' },
    { name: 'フォマルハウトb',  sub: 'ゴーストエネミー戦' },
    { name: '浮遊惑星ローグ',   sub: '無電源極寒サバイバル' },
    { name: '中性子パルサー',   sub: '電磁波パズルリレー' },
    { name: '超新星残骸網',     sub: 'エネルギーストーム' },
  ]},
  { id: 5, name: 'ミルキー銀河・中心バルジ',  en: 'Galactic Bulge',       color: '#ffd25c', stages: [
    { name: '球状星団入り口',   sub: '超密集弾幕バトル' },
    { name: '高重力ハイウェイ', sub: '超高速レース' },
    { name: '恒星メトシェラ',   sub: '古代トラップ迷宮' },
    { name: 'マイクロクエーサー', sub: '縦一閃ジェット回避' },
    { name: 'プラズマの海',     sub: 'スリップダメージ耐性' },
    { name: 'UYシウティ',       sub: '超巨大ボス壁面登り' },
    { name: 'コア・シティ',     sub: 'エイリアン要塞潜入' },
    { name: 'いて座A*',         sub: '銀河中心コアボス戦' },
  ]},
  { id: 6, name: 'アンドロメダ銀河',          en: 'Andromeda',            color: '#ff8b6b', stages: [
    { name: '銀河間ボイド',     sub: '超長距離ノーダメ巡航' },
    { name: 'アンドロメダハロー', sub: '見えない罠の索敵戦' },
    { name: '二重コア惑星',     sub: '変則重力アクション' },
    { name: '青い巨星砂漠',     sub: 'オーバーヒート耐久' },
    { name: '衝突境界線',       sub: '2銀河激突の崩壊' },
    { name: '幻影星系',         sub: '偽ルート見極めパズル' },
    { name: '反物質ポケット',   sub: '一撃死回避スリル' },
    { name: 'アンドロメダ要塞', sub: '機械生命体首領戦' },
  ]},
  { id: 7, name: 'ダークマター・エリア',      en: 'Dark Matter',          color: '#7a5cff', stages: [
    { name: '重力レンズ',       sub: '画面歪み視覚パズル' },
    { name: 'シャドウ・プラネット', sub: 'レーダー索敵バトル' },
    { name: '暗黒星雲',         sub: '視界ゼロ探索' },
    { name: 'タイム・ディレイ', sub: 'スローモーション' },
    { name: '宇宙フィラメント', sub: '一本道ワイヤーアクション' },
    { name: 'ゴーストギャラクシー', sub: '質量兵器防衛戦' },
    { name: 'タキオンの嵐',     sub: '逆再生ギミック' },
    { name: 'ダークマター核',   sub: '暗黒同化ボス戦' },
  ]},
  { id: 8, name: '深宇宙・モンスター天体',    en: 'Deep Space Monsters',  color: '#ff5c7a', stages: [
    { name: 'TON 618',          sub: '超重力限界バトル' },
    { name: 'クエーサージェット', sub: '一撃必殺ビーム回避' },
    { name: 'ガンマ線バースト', sub: 'ランダム砲撃サバイバル' },
    { name: 'ダイヤモンド惑星', sub: '超硬度オブジェ破壊' },
    { name: 'WASP-76b',         sub: '鉄の雨雨宿りパズル' },
    { name: 'ブーテス・ボイド', sub: '無音・完全孤立戦闘' },
    { name: 'ファースト・スター', sub: '純粋エネルギーコア破壊' },
    { name: 'グレート・ウォール', sub: '連戦・銀河壁突破戦' },
  ]},
  { id: 9, name: '異次元・亜空間',            en: 'Hyperspace',           color: '#5cffd6', stages: [
    { name: 'ローゼン橋',       sub: 'ワープスピードラン' },
    { name: 'ホワイトホール',   sub: '吹き飛ばしアスレチック' },
    { name: '4次元キューブ',    sub: '立体迷路パズル' },
    { name: '宇宙ひも',         sub: '極細足場アクション' },
    { name: 'パラレル・アース', sub: 'IF世界・鏡像エネミー' },
    { name: 'ミラー・スペース', sub: '操作反転ステージ' },
    { name: '虚数空間',         sub: '概念書き換えパズル' },
    { name: 'タキオン・ゲート', sub: '時間制限ボス戦' },
  ]},
  { id: 10, name: 'ビッグバン・境界',          en: 'Cosmogenesis',         color: '#ffaa5c', stages: [
    { name: '背景放射 CMB',     sub: '宇宙最古の壁破壊' },
    { name: 'インフレーション', sub: '超膨張ステージ' },
    { name: '事象の地平線',     sub: 'カウントダウン脱出' },
    { name: 'ビッグクランチ',   sub: '画面縮小・圧死回避' },
    { name: 'ヒートデス',       sub: '静寂の耐久サバイバル' },
    { name: '原始のスープ',     sub: '素粒子流アクション' },
    { name: '時空の特異点',     sub: '全ギミック混成パズル' },
    { name: 'ビッグバン・コア', sub: '創造主・究極のボス戦' },
  ]},
];

// Compute number of completed stages for a given user level.
// (Demo logic: every stage whose unlock + 5 has been reached is "completed",
//  the one matching exactly the level is "current", future ones are locked.)
function stageStatus(mapIdx, stageIdx, level) {
  const need = stageUnlockLevel(mapIdx, stageIdx);
  if (level < need) return 'locked';
  if (level < need + 5) return 'current';
  return 'completed';
}

function mapUnlocked(mapIdx, level) {
  // A map is unlocked when its stage 1 requirement is reached
  return level >= stageUnlockLevel(mapIdx, 0);
}

function mapProgress(mapIdx, level) {
  let done = 0;
  for (let i = 0; i < 8; i++) {
    if (stageStatus(mapIdx, i, level) === 'completed') done++;
  }
  return done;
}

// ─── Stage node (shared) ──────────────────────────────────────────
function StageNode({ status, color, size = 56 }) {
  const bg =
    status === 'completed' ? color :
    status === 'current'   ? color :
    'rgba(8, 10, 28, 0.85)';
  const border =
    status === 'completed' ? color :
    status === 'current'   ? color :
    'rgba(118, 138, 220, 0.4)';
  const shadow =
    status === 'completed' ? `0 0 14px ${color}` :
    status === 'current'   ? `0 0 22px ${color}, 0 0 40px ${color}88` :
    'none';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      border: `2px solid ${border}`,
      boxShadow: shadow,
      display: 'grid', placeItems: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      {status === 'completed' && <NxIcon kind="check" size={size * 0.55} color="var(--bg-0)" />}
      {status === 'current'   && <div className="nx-pulse" style={{ borderColor: color }} />}
      {status === 'locked'    && <div style={{
        width: size * 0.35, height: size * 0.28,
        border: '1.4px solid rgba(118,138,220,0.6)',
        borderRadius: 3, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -size * 0.18, left: '50%', transform: 'translateX(-50%)',
          width: size * 0.22, height: size * 0.18,
          border: '1.4px solid rgba(118,138,220,0.6)',
          borderBottom: 'none',
          borderRadius: '50% 50% 0 0',
        }}/>
      </div>}
    </div>
  );
}

// ─── Mobile · vertical stage path ─────────────────────────────────
function NxMap({ onNav = () => {}, level = 7, selectedMap = 0, setSelectedMap = () => {} }) {
  const t = useT();
  const map = MAPS[selectedMap];
  const unlocked = mapUnlocked(selectedMap, level);
  const progress = mapProgress(selectedMap, level);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={t('MAPS')}
        sub={`MAP ${selectedMap + 1} / 10 · ${map.en.toUpperCase()}`}
        glowColor="mag"
        left={<div onClick={() => setSelectedMap(Math.max(0, selectedMap - 1))} style={{ cursor: 'pointer', opacity: selectedMap > 0 ? 1 : 0.3 }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>}
        right={<div onClick={() => setSelectedMap(Math.min(9, selectedMap + 1))} style={{ cursor: 'pointer', opacity: selectedMap < 9 ? 1 : 0.3 }}>
          <NxIcon kind="arrow" size={18} color="var(--ink-soft)" />
        </div>}
      />

      {/* Map header */}
      <div style={{ padding: '12px 16px 6px' }}>
        <div className="nx-h glow" style={{
          fontSize: 22, color: map.color, textShadow: `0 0 12px ${map.color}`,
        }}>{map.name}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <div style={{
            flex: 1, height: 6, borderRadius: 3, overflow: 'hidden',
            background: 'rgba(8,10,28,0.7)', border: '1px solid var(--line)',
          }}>
            <div style={{
              width: `${(progress / 8) * 100}%`, height: '100%',
              background: map.color,
              boxShadow: `0 0 8px ${map.color}`,
              transition: 'width 0.3s',
            }}/>
          </div>
          <span className="nx-mono" style={{ fontSize: 11, color: map.color }}>{progress} / 8</span>
        </div>
        {!unlocked && (
          <div style={{ marginTop: 6 }}>
            <NxTag red>🔒 LV {stageUnlockLevel(selectedMap, 0)} で解放</NxTag>
          </div>
        )}
      </div>

      {/* Stage path — vertical zigzag */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 16px 12px', position: 'relative' }}>
        {/* Center background line (decorative) */}
        <div style={{
          position: 'absolute', left: '50%', top: 12, bottom: 12, width: 1,
          background: `linear-gradient(180deg, ${map.color}33 0%, transparent 100%)`,
          transform: 'translateX(-50%)',
        }}/>
        {map.stages.map((s, i) => {
          const status = unlocked ? stageStatus(selectedMap, i, level) : 'locked';
          const req = stageUnlockLevel(selectedMap, i);
          const isRight = i % 2 === 0;
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: isRight ? '40px 1fr 8px' : '8px 1fr 40px',
              gap: 10, alignItems: 'center',
              padding: '8px 0',
              direction: isRight ? 'ltr' : 'rtl',
            }}>
              {isRight && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StageNode status={status} color={map.color} size={40} />
                </div>
              )}
              <div style={{ direction: 'ltr', textAlign: isRight ? 'left' : 'right',
                opacity: status === 'locked' ? 0.5 : 1,
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center',
                  justifyContent: isRight ? 'flex-start' : 'flex-end',
                  flexWrap: 'wrap',
                }}>
                  <span className="nx-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>STAGE {i + 1}</span>
                  <span className="nx-h" style={{ fontSize: 14, color: status === 'locked' ? 'var(--ink-soft)' : map.color }}>
                    {s.name}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 1 }}>{s.sub}</div>
                <div style={{ marginTop: 4 }}>
                  {status === 'completed' && <NxTag green>CLEARED ✓</NxTag>}
                  {status === 'current'   && <NxTag cyan>挑戦中 ▶</NxTag>}
                  {status === 'locked'    && <NxTag red>🔒 LV {req}</NxTag>}
                </div>
              </div>
              {!isRight && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StageNode status={status} color={map.color} size={40} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map dots */}
      <div style={{
        padding: '8px 16px 10px',
        borderTop: '1px solid var(--line)',
        background: 'rgba(4,5,26,0.6)',
        display: 'flex', gap: 6, justifyContent: 'center',
      }}>
        {MAPS.map((m, i) => {
          const up = mapUnlocked(i, level);
          const on = i === selectedMap;
          return (
            <div key={i} onClick={() => setSelectedMap(i)} className="nx-clickable"
              style={{
                width: on ? 26 : 10, height: 10,
                borderRadius: 5,
                background: on ? m.color : up ? 'rgba(118,138,220,0.4)' : 'rgba(118,138,220,0.15)',
                boxShadow: on ? `0 0 8px ${m.color}` : 'none',
                transition: 'all 0.2s',
              }}/>
          );
        })}
      </div>
      <NxTabBar active="maps" onNav={onNav} />
    </div>
  );
}

// ─── Desktop · curved path with full map gallery ──────────────────
function NxMapDesktop({ onNav = () => {}, level = 7, selectedMap = 0, setSelectedMap = () => {} }) {
  const t = useT();
  const map = MAPS[selectedMap];
  const unlocked = mapUnlocked(selectedMap, level);
  const progress = mapProgress(selectedMap, level);

  // 8 positions along a flowing S-curve (% of map area)
  const positions = [
    { x: 12, y: 80 }, { x: 28, y: 64 }, { x: 18, y: 46 }, { x: 38, y: 30 },
    { x: 58, y: 38 }, { x: 74, y: 56 }, { x: 64, y: 76 }, { x: 88, y: 22 },
  ];

  return (
    <NxDesktopShell active="maps" onNav={onNav}
      title={t('MAPS_HEAD')}
      sub={`MAP ${selectedMap + 1} / 10 · ${map.en.toUpperCase()} · ${progress} / 8 CLEARED`}
      right={<>
        <NxTag style={{ color: map.color, borderColor: map.color, background: map.color + '15' }}>
          {map.name}
        </NxTag>
        <NxBtn ghost onClick={() => setSelectedMap(Math.max(0, selectedMap - 1))}>
          <NxIcon kind="back" size={14}/> {t('PREV')}
        </NxBtn>
        <NxBtn primary onClick={() => setSelectedMap(Math.min(9, selectedMap + 1))}>
          {t('NEXT_MAP')} <NxIcon kind="arrow" size={14}/>
        </NxBtn>
      </>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, height: '100%', minHeight: 0 }}>
        {/* Star map */}
        <NxCard bracket style={{
          position: 'relative', overflow: 'hidden', padding: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${map.color}1a 0%, transparent 60%)`,
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <Constellation density={1.8} mode="wide" />
          </div>

          {/* Path connecting stages */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path
              d={positions.reduce((acc, p, i) => {
                if (i === 0) return `M ${p.x} ${p.y}`;
                const prev = positions[i - 1];
                const mx = (prev.x + p.x) / 2;
                return acc + ` Q ${mx} ${prev.y} ${p.x} ${p.y}`;
              }, '')}
              fill="none" stroke={map.color} strokeWidth="0.35" strokeDasharray="1 1.5"
              opacity={unlocked ? 0.8 : 0.25} />
          </svg>

          {/* Map header overlay */}
          <div style={{ position: 'absolute', left: 18, top: 16, right: 18, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5 }}>
            <div className="nx-h glow" style={{
              fontSize: 26, color: map.color, textShadow: `0 0 14px ${map.color}`,
            }}>{map.name}</div>
            <div style={{ flex: 1 }}/>
            {!unlocked && <NxTag red>🔒 LOCKED · LV {stageUnlockLevel(selectedMap, 0)}</NxTag>}
            <NxTag style={{ color: map.color, borderColor: map.color, background: map.color + '20' }}>
              {progress} / 8
            </NxTag>
          </div>

          {/* Stages */}
          {map.stages.map((s, i) => {
            const p = positions[i];
            const status = unlocked ? stageStatus(selectedMap, i, level) : 'locked';
            const size = status === 'current' ? 56 : 48;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${p.x}%`, top: `${p.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <div style={{ position: 'relative' }}>
                  <StageNode status={status} color={map.color} size={size} />
                  <div style={{
                    position: 'absolute', top: -8, right: -10,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--bg-0)',
                    border: `1.5px solid ${status === 'locked' ? 'var(--line)' : map.color}`,
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--display)', fontWeight: 900, fontSize: 11,
                    color: status === 'locked' ? 'var(--ink-mute)' : map.color,
                  }}>{i + 1}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--display)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.04em',
                  color: status === 'locked' ? 'var(--ink-mute)' : map.color,
                  textShadow: status !== 'locked' ? `0 0 6px ${map.color}` : 'none',
                  whiteSpace: 'nowrap', textAlign: 'center',
                  maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{s.name}</div>
                <div className="nx-overline" style={{ fontSize: 8 }}>
                  {status === 'locked' ? `LV ${stageUnlockLevel(selectedMap, i)}` :
                   status === 'completed' ? 'CLEAR' :
                   '挑戦中'}
                </div>
              </div>
            );
          })}
        </NxCard>

        {/* Right panel: map list + detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <NxCard style={{ padding: 12, flex: '0 0 auto' }}>
            <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('GALAXY_TOUR')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {MAPS.map((m, i) => {
                const up = mapUnlocked(i, level);
                const p = mapProgress(i, level);
                const on = i === selectedMap;
                return (
                  <div key={i} onClick={() => setSelectedMap(i)} className="nx-clickable"
                    style={{
                      display: 'grid', gridTemplateColumns: '24px 1fr 50px 26px',
                      alignItems: 'center', gap: 8,
                      padding: '6px 10px', borderRadius: 7,
                      background: on ? `${m.color}1f` : 'transparent',
                      border: `1px solid ${on ? m.color : 'transparent'}`,
                      boxShadow: on ? `0 0 16px -6px ${m.color}` : 'none',
                      opacity: up ? 1 : 0.55,
                    }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: m.color, boxShadow: `0 0 8px ${m.color}`,
                      justifySelf: 'center',
                      opacity: up ? 1 : 0.4,
                    }}/>
                    <div style={{ lineHeight: 1.15, minWidth: 0 }}>
                      <div className="nx-h" style={{
                        fontSize: 11, color: up ? m.color : 'var(--ink-mute)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>MAP {i + 1}</div>
                      <div style={{ fontSize: 11, color: up ? 'var(--ink)' : 'var(--ink-mute)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{m.name}</div>
                    </div>
                    <span className="nx-mono" style={{ fontSize: 10, textAlign: 'right', color: up ? 'var(--ink-soft)' : 'var(--ink-mute)' }}>
                      {up ? `${p}/8` : 'LOCK'}
                    </span>
                    {!up ? (
                      <NxIcon kind="back" size={12} color="var(--ink-mute)" />
                    ) : (
                      <NxIcon kind="arrow" size={12} color="var(--ink-soft)" />
                    )}
                  </div>
                );
              })}
            </div>
          </NxCard>

          {/* Selected stage details — picks the "current" stage of current map, or stage 1 */}
          {unlocked && (() => {
            const currentIdx = map.stages.findIndex((_, i) => stageStatus(selectedMap, i, level) === 'current');
            const sIdx = currentIdx >= 0 ? currentIdx : map.stages.findIndex((_, i) => stageStatus(selectedMap, i, level) !== 'completed');
            const stage = map.stages[sIdx >= 0 ? sIdx : 0];
            const status = stageStatus(selectedMap, sIdx >= 0 ? sIdx : 0, level);
            return (
              <NxCard glow="mag" bracket="mag" style={{ padding: 16, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="nx-overline">{t('NEXT_CHALLENGE')}</div>
                <div className="nx-h mag-glow" style={{ fontSize: 22, marginTop: 6, color: map.color, textShadow: `0 0 10px ${map.color}` }}>
                  STAGE {(sIdx >= 0 ? sIdx : 0) + 1} · {stage.name}
                </div>
                <div className="nx-overline" style={{ marginTop: 2 }}>{stage.sub}</div>
                <div className="nx-divider" style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <NxTag>{map.en.toUpperCase()}</NxTag>
                  <NxTag cyan>LV {stageUnlockLevel(selectedMap, sIdx >= 0 ? sIdx : 0)}+</NxTag>
                  {status === 'completed' && <NxTag green>CLEARED</NxTag>}
                  {status === 'current'   && <NxTag amber>挑戦中</NxTag>}
                </div>
                <NxBtn primary lg block onClick={() => onNav('home')}>
                  <NxIcon kind="bolt" size={14} /> {t('LAUNCH_STAGE')}
                </NxBtn>
              </NxCard>
            );
          })()}
          {!unlocked && (
            <NxCard glow="red" style={{ padding: 16, flex: 1 }}>
              <div className="nx-overline" style={{ color: 'var(--red)' }}>// {t('LOCKED')}</div>
              <div className="nx-h" style={{ fontSize: 18, marginTop: 6, color: 'var(--red)' }}>
                マップ未解放
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                {map.name} へのアクセスには <span style={{ color: 'var(--amber)' }}>LV {stageUnlockLevel(selectedMap, 0)}</span> が必要です。<br/>
                前のマップを最後までクリアして進めましょう。
              </div>
            </NxCard>
          )}
        </div>
      </div>
    </NxDesktopShell>
  );
}

Object.assign(window, {
  MAPS, stageUnlockLevel, stageStatus, mapUnlocked, mapProgress,
  StageNode, NxMap, NxMapDesktop,
});
