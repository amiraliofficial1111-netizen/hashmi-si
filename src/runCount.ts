export function runCount(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const decimals = Number(el.dataset.decimals || "0");
  const pad = Number(el.dataset.pad || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const paint = (value: number) => {
    let text = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    if (pad) text = text.padStart(pad, "0");
    el.textContent = `${prefix}${text}${suffix}`;
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    paint(target);
    return;
  }
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / 1400);
    paint(target * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
