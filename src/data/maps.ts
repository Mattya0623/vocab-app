import type { CosmosMap } from '@/types';

export const MAPS: CosmosMap[] = [
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

// Stage N of map M needs level ((M-1)*8 + N) * 5
export function stageUnlockLevel(mapIdx: number, stageIdx: number): number {
  return (mapIdx * 8 + stageIdx + 1) * 5;
}

export type StageStatus = 'completed' | 'current' | 'locked';

export function stageStatus(mapIdx: number, stageIdx: number, level: number): StageStatus {
  const need = stageUnlockLevel(mapIdx, stageIdx);
  if (level < need) return 'locked';
  if (level < need + 5) return 'current';
  return 'completed';
}

export function mapUnlocked(mapIdx: number, level: number): boolean {
  return level >= stageUnlockLevel(mapIdx, 0);
}

export function mapProgress(mapIdx: number, level: number): number {
  let done = 0;
  for (let i = 0; i < 8; i++) {
    if (stageStatus(mapIdx, i, level) === 'completed') done++;
  }
  return done;
}
