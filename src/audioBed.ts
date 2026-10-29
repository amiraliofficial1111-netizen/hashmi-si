export type Bed = { setLevel: (level: number) => void; stop: () => void };

export function createBed(): Bed | null {
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.4;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 360;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 58;
  const oscGain = ctx.createGain();
  oscGain.gain.value = 0;
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start();
  const tide = window.setInterval(() => {
    filter.frequency.setTargetAtTime(260 + Math.random() * 240, ctx.currentTime, 0.45);
  }, 1100);
  return {
    setLevel(level: number) {
      void ctx.resume();
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime(level > 0 ? 0.2 : 0, now, 0.12);
      oscGain.gain.setTargetAtTime(level > 0 ? 0.028 : 0, now, 0.18);
    },
    stop() {
      window.clearInterval(tide);
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      oscGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      window.setTimeout(() => {
        source.stop();
        osc.stop();
        void ctx.close();
      }, 280);
    },
  };
}
