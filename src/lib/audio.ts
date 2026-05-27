export function playChime() {
  try {
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const tones = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    tones.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  } catch {}
}
