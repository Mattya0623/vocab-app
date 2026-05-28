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
  if (count >= 25) return {
    color: '#e8f4ff',
    gradient: 'linear-gradient(135deg,#ffffff 0%,#b0d8ff 35%,#ffd6ff 65%,#ffffff 100%)',
    shadow: '0 0 28px rgba(255,255,255,0.85), 0 0 56px rgba(160,210,255,0.4)',
    border: 'rgba(255,255,255,0.65)',
    bg: 'rgba(255,255,255,0.05)',
    label: 'STELLAR',
    emoji: '✨',
  };
  if (count >= 20) return {
    color: '#5599ff',
    gradient: 'linear-gradient(135deg,#1122dd 0%,#5599ff 50%,#0011aa 100%)',
    shadow: '0 0 22px rgba(85,153,255,0.75)',
    border: 'rgba(85,153,255,0.55)',
    bg: 'rgba(85,153,255,0.06)',
    label: 'MIDNIGHT',
    emoji: '🌌',
  };
  if (count >= 15) return {
    color: '#bb55ff',
    gradient: 'linear-gradient(135deg,#550099 0%,#bb55ff 50%,#330066 100%)',
    shadow: '0 0 20px rgba(187,85,255,0.65)',
    border: 'rgba(187,85,255,0.5)',
    bg: 'rgba(187,85,255,0.06)',
    label: 'ABYSS',
    emoji: '🔮',
  };
  if (count >= 10) return {
    color: '#dd55ff',
    gradient: 'linear-gradient(135deg,#9900ee 0%,#dd55ff 50%,#bb00cc 100%)',
    shadow: '0 0 18px rgba(187,0,238,0.65)',
    border: 'rgba(187,0,238,0.5)',
    bg: 'rgba(187,0,238,0.05)',
    label: 'ARCANE',
    emoji: '💜',
  };
  if (count >= 7) return {
    color: '#cc1111',
    gradient: undefined,
    shadow: '0 0 14px rgba(180,0,0,0.7)',
    border: 'rgba(180,0,0,0.5)',
    bg: 'rgba(160,0,0,0.06)',
    label: 'CRIMSON',
    emoji: '🔴',
  };
  if (count >= 5) return {
    color: 'var(--red)',
    gradient: undefined,
    shadow: '0 0 12px var(--red)',
    border: 'rgba(255,92,122,0.5)',
    bg: 'rgba(255,92,122,0.05)',
    label: 'SCARLET',
    emoji: '❤️',
  };
  if (count >= 3) return {
    color: '#ff6eb4',
    gradient: undefined,
    shadow: '0 0 12px rgba(255,110,180,0.6)',
    border: 'rgba(255,110,180,0.5)',
    bg: 'rgba(255,110,180,0.05)',
    label: 'ROSE',
    emoji: '🌸',
  };
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
