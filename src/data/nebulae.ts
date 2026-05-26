import type { Nebula } from '@/types';

export const NEBULAE: Nebula[] = [
  { n: 1, name: 'Vega',       range: '0–25%',   count: 12, color: '#ff5c7a', desc: 'Weaver · 織女' },
  { n: 2, name: 'Altair',     range: '26–40%',  count: 18, color: '#ff5ce0', desc: 'Eagle · 彦星' },
  { n: 3, name: 'Sirius',     range: '41–55%',  count: 23, color: '#a079ff', desc: 'Dog Star · 天狼' },
  { n: 4, name: 'Betelgeuse', range: '56–75%',  count: 29, color: '#5ce8ff', desc: "Orion's Shoulder" },
  { n: 5, name: 'Rigel',      range: '76–90%',  count: 19, color: '#5cffd6', desc: "Orion's Foot" },
  { n: 6, name: 'Polaris',    range: '91–95%',  count: 9,  color: '#a6ff5c', desc: 'North Star · 北辰' },
  { n: 7, name: 'Antares',    range: '96–100%', count: 4,  color: '#ffd25c', desc: 'Heart of Scorpius' },
];

export function boxOf(acc: number): number {
  if (acc <= 25) return 1;
  if (acc <= 40) return 2;
  if (acc <= 55) return 3;
  if (acc <= 75) return 4;
  if (acc <= 90) return 5;
  if (acc <= 95) return 6;
  return 7;
}
