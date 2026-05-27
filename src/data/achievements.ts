import type { Word, UserStats } from '@/types';
import { boxOf } from '@/data/nebulae';

export interface AchieveContext {
  words: Word[];
  stats: UserStats;
  level: number;
}

export interface AchievementDef {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  category: 'vocab' | 'quiz' | 'accuracy' | 'streak' | 'level' | 'special';
  type: 'single' | 'progress';
  max: number;
  check: (ctx: AchieveContext) => { unlocked: boolean; current: number };
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── 語彙 ──────────────────────────────────────────────────────────────
  { id: 'v1',    emoji: '🌱', name: '宇宙への第一歩', desc: '最初の単語を登録する',       category: 'vocab', type: 'single',   max: 1,
    check: ({ words }) => ({ unlocked: words.length >= 1,    current: Math.min(words.length, 1) }) },
  { id: 'v10',   emoji: '🌿', name: '語彙の芽',       desc: '単語を10語登録する',         category: 'vocab', type: 'progress', max: 10,
    check: ({ words }) => ({ unlocked: words.length >= 10,   current: words.length }) },
  { id: 'v50',   emoji: '🌳', name: '語彙の若木',     desc: '単語を50語登録する',         category: 'vocab', type: 'progress', max: 50,
    check: ({ words }) => ({ unlocked: words.length >= 50,   current: words.length }) },
  { id: 'v100',  emoji: '🏙️', name: '語彙の街',       desc: '単語を100語登録する',        category: 'vocab', type: 'progress', max: 100,
    check: ({ words }) => ({ unlocked: words.length >= 100,  current: words.length }) },
  { id: 'v500',  emoji: '🌌', name: '語彙の銀河',     desc: '単語を500語登録する',        category: 'vocab', type: 'progress', max: 500,
    check: ({ words }) => ({ unlocked: words.length >= 500,  current: words.length }) },
  { id: 'v1000', emoji: '🌠', name: '語彙の宇宙',     desc: '単語を1000語登録する',       category: 'vocab', type: 'progress', max: 1000,
    check: ({ words }) => ({ unlocked: words.length >= 1000, current: words.length }) },
  { id: 'v2500', emoji: '💫', name: '語彙の創造主',   desc: '単語を2500語登録する',       category: 'vocab', type: 'progress', max: 2500,
    check: ({ words }) => ({ unlocked: words.length >= 2500, current: words.length }) },

  // ── 回答数 ────────────────────────────────────────────────────────────
  { id: 'q1',     emoji: '⚡', name: '初回答',   desc: '最初の問題に答える',          category: 'quiz', type: 'single',   max: 1,
    check: ({ stats }) => ({ unlocked: stats.totalAttempts >= 1,     current: Math.min(stats.totalAttempts, 1) }) },
  { id: 'q100',   emoji: '📚', name: '百の星',   desc: '100問回答する',               category: 'quiz', type: 'progress', max: 100,
    check: ({ stats }) => ({ unlocked: stats.totalAttempts >= 100,   current: stats.totalAttempts }) },
  { id: 'q500',   emoji: '📖', name: '五百の星', desc: '500問回答する',               category: 'quiz', type: 'progress', max: 500,
    check: ({ stats }) => ({ unlocked: stats.totalAttempts >= 500,   current: stats.totalAttempts }) },
  { id: 'q1000',  emoji: '🎓', name: '千の星',   desc: '1000問回答する',              category: 'quiz', type: 'progress', max: 1000,
    check: ({ stats }) => ({ unlocked: stats.totalAttempts >= 1000,  current: stats.totalAttempts }) },
  { id: 'q10000', emoji: '🌟', name: '万の星',   desc: '10000問回答する',             category: 'quiz', type: 'progress', max: 10000,
    check: ({ stats }) => ({ unlocked: stats.totalAttempts >= 10000, current: stats.totalAttempts }) },

  // ── 正答率 ────────────────────────────────────────────────────────────
  { id: 'a50', emoji: '🎯', name: '正確の道',   desc: '正答率50%以上（10問以上）',   category: 'accuracy', type: 'single', max: 1,
    check: ({ stats }) => { const ok = stats.totalAttempts >= 10  && stats.totalCorrect / stats.totalAttempts >= 0.50; return { unlocked: ok, current: ok ? 1 : 0 }; } },
  { id: 'a70', emoji: '✨', name: '高精度',     desc: '正答率70%以上（30問以上）',   category: 'accuracy', type: 'single', max: 1,
    check: ({ stats }) => { const ok = stats.totalAttempts >= 30  && stats.totalCorrect / stats.totalAttempts >= 0.70; return { unlocked: ok, current: ok ? 1 : 0 }; } },
  { id: 'a85', emoji: '💎', name: '超精度',     desc: '正答率85%以上（50問以上）',   category: 'accuracy', type: 'single', max: 1,
    check: ({ stats }) => { const ok = stats.totalAttempts >= 50  && stats.totalCorrect / stats.totalAttempts >= 0.85; return { unlocked: ok, current: ok ? 1 : 0 }; } },
  { id: 'a95', emoji: '👑', name: '神の精度',   desc: '正答率95%以上（100問以上）',  category: 'accuracy', type: 'single', max: 1,
    check: ({ stats }) => { const ok = stats.totalAttempts >= 100 && stats.totalCorrect / stats.totalAttempts >= 0.95; return { unlocked: ok, current: ok ? 1 : 0 }; } },

  // ── ストリーク ────────────────────────────────────────────────────────
  { id: 's5',   emoji: '🔥', name: '連続の火',   desc: '5連続正解を達成する',    category: 'streak', type: 'progress', max: 5,
    check: ({ stats }) => ({ unlocked: stats.maxStreak >= 5,   current: Math.min(stats.maxStreak, 5) }) },
  { id: 's10',  emoji: '💥', name: 'ホットライン', desc: '10連続正解を達成する',   category: 'streak', type: 'progress', max: 10,
    check: ({ stats }) => ({ unlocked: stats.maxStreak >= 10,  current: Math.min(stats.maxStreak, 10) }) },
  { id: 's25',  emoji: '⚡', name: '不屈の意志',  desc: '25連続正解を達成する',   category: 'streak', type: 'progress', max: 25,
    check: ({ stats }) => ({ unlocked: stats.maxStreak >= 25,  current: Math.min(stats.maxStreak, 25) }) },
  { id: 's50',  emoji: '🌟', name: '伝説の連鎖',  desc: '50連続正解を達成する',   category: 'streak', type: 'progress', max: 50,
    check: ({ stats }) => ({ unlocked: stats.maxStreak >= 50,  current: Math.min(stats.maxStreak, 50) }) },
  { id: 's100', emoji: '☄️', name: '神話の域',    desc: '100連続正解を達成する',  category: 'streak', type: 'progress', max: 100,
    check: ({ stats }) => ({ unlocked: stats.maxStreak >= 100, current: Math.min(stats.maxStreak, 100) }) },

  // ── レベル ────────────────────────────────────────────────────────────
  { id: 'l5',   emoji: '🚀', name: '飛躍',         desc: 'レベル5に到達する',    category: 'level', type: 'progress', max: 5,
    check: ({ level }) => ({ unlocked: level >= 5,   current: Math.min(level, 5) }) },
  { id: 'l10',  emoji: '⭐', name: '中堅学習者',   desc: 'レベル10に到達する',   category: 'level', type: 'progress', max: 10,
    check: ({ level }) => ({ unlocked: level >= 10,  current: Math.min(level, 10) }) },
  { id: 'l25',  emoji: '💫', name: '上級者',       desc: 'レベル25に到達する',   category: 'level', type: 'progress', max: 25,
    check: ({ level }) => ({ unlocked: level >= 25,  current: Math.min(level, 25) }) },
  { id: 'l50',  emoji: '🌟', name: 'エキスパート', desc: 'レベル50に到達する',   category: 'level', type: 'progress', max: 50,
    check: ({ level }) => ({ unlocked: level >= 50,  current: Math.min(level, 50) }) },
  { id: 'l100', emoji: '👑', name: 'マスター',     desc: 'レベル100に到達する',  category: 'level', type: 'progress', max: 100,
    check: ({ level }) => ({ unlocked: level >= 100, current: Math.min(level, 100) }) },

  // ── 特殊 ──────────────────────────────────────────────────────────────
  { id: 'sp_tags',    emoji: '🏷️', name: 'タグ職人',     desc: '3種類以上のタグを作成する',          category: 'special', type: 'progress', max: 3,
    check: ({ words }) => { const s = new Set<string>(); words.forEach(w => w.tags?.forEach(t => s.add(t))); return { unlocked: s.size >= 3, current: Math.min(s.size, 3) }; } },
  { id: 'sp_neb7',    emoji: '🔭', name: '星雲の探検家', desc: 'すべての星雲 (N1〜N7) に単語を持つ', category: 'special', type: 'progress', max: 7,
    check: ({ words }) => { const s = new Set(words.map(w => boxOf(w.accuracy))); return { unlocked: s.size >= 7, current: Math.min(s.size, 7) }; } },
  { id: 'sp_perfect', emoji: '💯', name: '完璧主義者',   desc: '1語で正答率100% かつ10回以上回答',  category: 'special', type: 'single', max: 1,
    check: ({ words }) => { const ok = words.some(w => w.accuracy === 100 && w.attempts >= 10); return { unlocked: ok, current: ok ? 1 : 0 }; } },
  { id: 'sp_rich',    emoji: '🏆', name: '全星雲制覇',   desc: 'すべての星雲に各5語以上配置する',    category: 'special', type: 'progress', max: 7,
    check: ({ words }) => { const c: Record<number,number> = {}; words.forEach(w => { const b = boxOf(w.accuracy); c[b] = (c[b]||0) + 1; }); const full = [1,2,3,4,5,6,7].filter(n => (c[n]||0) >= 5).length; return { unlocked: full >= 7, current: full }; } },
];

export type AchieveCategory = 'all' | 'vocab' | 'quiz' | 'accuracy' | 'streak' | 'level' | 'special';

export const CATEGORY_META: Array<{ id: AchieveCategory; label: string; emoji: string }> = [
  { id: 'all',      label: 'ALL',        emoji: '🌐' },
  { id: 'vocab',    label: '語彙',       emoji: '📝' },
  { id: 'quiz',     label: '回答',       emoji: '⚡' },
  { id: 'accuracy', label: '精度',       emoji: '🎯' },
  { id: 'streak',   label: 'ストリーク', emoji: '🔥' },
  { id: 'level',    label: 'レベル',     emoji: '⭐' },
  { id: 'special',  label: '特殊',       emoji: '✨' },
];
