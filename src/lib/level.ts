// XP = total correct answers. Required XP for level: 10 * LV^2
// So level from XP: LV = floor(sqrt(XP / 10)) + 1

export const LEVEL_COLORS = ['#5ce8ff', '#ff5ce0', '#a079ff', '#a6ff5c', '#ffd25c', '#ff5c7a'];
export const LEVEL_TIER_NAMES = ['SPECTRA', 'NOVA', 'PULSAR', 'QUASAR', 'STELLAR', 'NEBULA'];

export function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 10)) + 1);
}

export function levelToMinXp(lv: number): number {
  return 10 * (lv - 1) ** 2;
}

export function levelToMaxXp(lv: number): number {
  return 10 * lv ** 2;
}

export function levelColor(lv: number): string {
  const tier = Math.floor((Math.max(1, lv) - 1) / 5);
  return LEVEL_COLORS[tier % LEVEL_COLORS.length];
}

export function levelTierName(lv: number): string {
  const idx = Math.floor((Math.max(1, lv) - 1) / 5);
  return LEVEL_TIER_NAMES[idx % LEVEL_TIER_NAMES.length];
}

export function levelAscension(lv: number): number {
  return Math.floor(lv / 25);
}
