export interface PrestigeStyle {
  color: string;
  gradient?: string;
  shadow: string;
  border: string;
  bg: string;
  label: string;
  emoji: string;
}

export function getPrestige(count: number): PrestigeStyle {
  // ×31: 暗い紫 → 暗い青
  if (count >= 31) return {
    color: '#7744cc',
    gradient: 'linear-gradient(135deg,#3300aa 0%,#7744cc 45%,#1133bb 100%)',
    shadow: '0 0 18px rgba(119,68,204,0.7)',
    border: 'rgba(119,68,204,0.5)',
    bg: 'rgba(100,50,180,0.07)',
    label: 'VOID',
    emoji: '🌀',
  };
  // ×29: 暗い紫 → 暗い赤
  if (count >= 29) return {
    color: '#993366',
    gradient: 'linear-gradient(135deg,#550033 0%,#993366 45%,#661122 100%)',
    shadow: '0 0 18px rgba(153,51,102,0.7)',
    border: 'rgba(153,51,102,0.5)',
    bg: 'rgba(130,40,80,0.07)',
    label: 'ECLIPSE',
    emoji: '🌑',
  };
  // ×27: 暗い青 → 暗い水色
  if (count >= 27) return {
    color: '#336699',
    gradient: 'linear-gradient(135deg,#112255 0%,#336699 45%,#224466 100%)',
    shadow: '0 0 18px rgba(51,102,153,0.7)',
    border: 'rgba(51,102,153,0.5)',
    bg: 'rgba(40,80,120,0.07)',
    label: 'DEEP SEA',
    emoji: '🌊',
  };
  // ×25: 暗い赤 → 暗いピンク
  if (count >= 25) return {
    color: '#cc2255',
    gradient: 'linear-gradient(135deg,#880011 0%,#cc2255 45%,#991144 100%)',
    shadow: '0 0 18px rgba(204,34,85,0.7)',
    border: 'rgba(204,34,85,0.5)',
    bg: 'rgba(160,30,60,0.07)',
    label: 'EMBER',
    emoji: '🔥',
  };
  // ×23: 暗い水色
  if (count >= 23) return {
    color: '#227799',
    gradient: 'linear-gradient(135deg,#003344 0%,#227799 50%,#115566 100%)',
    shadow: '0 0 16px rgba(34,119,153,0.65)',
    border: 'rgba(34,119,153,0.5)',
    bg: 'rgba(20,90,120,0.06)',
    label: 'ABYSS',
    emoji: '🫧',
  };
  // ×21: 暗いピンク
  if (count >= 21) return {
    color: '#cc3377',
    gradient: 'linear-gradient(135deg,#660033 0%,#cc3377 50%,#880044 100%)',
    shadow: '0 0 16px rgba(204,51,119,0.65)',
    border: 'rgba(204,51,119,0.5)',
    bg: 'rgba(160,40,80,0.06)',
    label: 'DUSK',
    emoji: '🌸',
  };
  // ×19: 暗い緑
  if (count >= 19) return {
    color: '#338855',
    gradient: 'linear-gradient(135deg,#002211 0%,#338855 50%,#1a5533 100%)',
    shadow: '0 0 16px rgba(51,136,85,0.65)',
    border: 'rgba(51,136,85,0.5)',
    bg: 'rgba(30,100,55,0.06)',
    label: 'FOREST',
    emoji: '🌿',
  };
  // ×17: 暗い赤
  if (count >= 17) return {
    color: '#cc2222',
    gradient: 'linear-gradient(135deg,#550000 0%,#cc2222 50%,#880000 100%)',
    shadow: '0 0 16px rgba(204,34,34,0.65)',
    border: 'rgba(204,34,34,0.5)',
    bg: 'rgba(160,20,20,0.06)',
    label: 'INFERNO',
    emoji: '💢',
  };
  // ×15: 光る白
  if (count >= 15) return {
    color: '#e8f4ff',
    gradient: 'linear-gradient(135deg,#ffffff 0%,#b0d8ff 35%,#ffd6ff 65%,#ffffff 100%)',
    shadow: '0 0 28px rgba(255,255,255,0.85), 0 0 56px rgba(160,210,255,0.4)',
    border: 'rgba(255,255,255,0.65)',
    bg: 'rgba(255,255,255,0.05)',
    label: 'STELLAR',
    emoji: '✨',
  };
  // ×13: 暗い青
  if (count >= 13) return {
    color: '#5599ff',
    gradient: 'linear-gradient(135deg,#1122dd 0%,#5599ff 50%,#0011aa 100%)',
    shadow: '0 0 22px rgba(85,153,255,0.75)',
    border: 'rgba(85,153,255,0.55)',
    bg: 'rgba(85,153,255,0.06)',
    label: 'MIDNIGHT',
    emoji: '🌌',
  };
  // ×11: 暗い紫
  if (count >= 11) return {
    color: '#bb55ff',
    gradient: 'linear-gradient(135deg,#550099 0%,#bb55ff 50%,#330066 100%)',
    shadow: '0 0 20px rgba(187,85,255,0.65)',
    border: 'rgba(187,85,255,0.5)',
    bg: 'rgba(187,85,255,0.06)',
    label: 'SHADOW',
    emoji: '🔮',
  };
  // ×9: 紫
  if (count >= 9) return {
    color: '#dd55ff',
    gradient: 'linear-gradient(135deg,#9900ee 0%,#dd55ff 50%,#bb00cc 100%)',
    shadow: '0 0 18px rgba(187,0,238,0.65)',
    border: 'rgba(187,0,238,0.5)',
    bg: 'rgba(187,0,238,0.05)',
    label: 'ARCANE',
    emoji: '💜',
  };
  // ×7: 暗い赤
  if (count >= 7) return {
    color: '#cc1111',
    gradient: undefined,
    shadow: '0 0 14px rgba(180,0,0,0.7)',
    border: 'rgba(180,0,0,0.5)',
    bg: 'rgba(160,0,0,0.06)',
    label: 'CRIMSON',
    emoji: '🔴',
  };
  // ×5: 赤
  if (count >= 5) return {
    color: 'var(--red)',
    gradient: undefined,
    shadow: '0 0 12px var(--red)',
    border: 'rgba(255,92,122,0.5)',
    bg: 'rgba(255,92,122,0.05)',
    label: 'SCARLET',
    emoji: '❤️',
  };
  // ×3: ピンク
  if (count >= 3) return {
    color: '#ff6eb4',
    gradient: undefined,
    shadow: '0 0 12px rgba(255,110,180,0.6)',
    border: 'rgba(255,110,180,0.5)',
    bg: 'rgba(255,110,180,0.05)',
    label: 'ROSE',
    emoji: '🌸',
  };
  // ×1: 金色
  return {
    color: 'var(--amber)',
    gradient: undefined,
    shadow: '0 0 14px var(--amber)',
    border: 'rgba(255,210,92,0.5)',
    bg: 'rgba(255,210,92,0.06)',
    label: 'GOLD',
    emoji: '🏆',
  };
}
