// XP = total correct answers. Each level requires exactly 50 XP.
// Level = floor(XP / 50) + 1

export const LEVEL_COLORS = ['#5ce8ff', '#ff5ce0', '#a079ff', '#a6ff5c', '#ffd25c', '#ff5c7a'];
export const LEVEL_TIER_NAMES = ['SPECTRA', 'NOVA', 'PULSAR', 'QUASAR', 'STELLAR', 'NEBULA'];

export function xpToLevel(xp: number): number {
  return Math.floor(xp / 50) + 1;
}

export function levelToMinXp(lv: number): number {
  return (lv - 1) * 50;
}

export function levelToMaxXp(lv: number): number {
  return lv * 50;
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
