import { useEffect, useRef } from "react";

type Props = {
  active?: boolean;
};

type Node = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: "pink" | "cyan" | "white";
  label?: string;
};

type Pulse = {
  from: number;
  to: number;
  t: number;
  speed: number;
};

const LABELS = ["Agents", "Tools", "Products", "Data"] as const;

/** Hero intelligence core — Agents / Systems / Products / Data model. */
export default function HeroMind({ active = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let playing = !reduce;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const nodes: Node[] = [
      { angle: 0.2, radius: 0.28, speed: 0.32, size: 5.2, hue: "pink", label: LABELS[0] },
      { angle: 1.8, radius: 0.28, speed: 0.32, size: 4.2, hue: "cyan", label: LABELS[1] },
      { angle: 3.5, radius: 0.28, speed: 0.32, size: 4.6, hue: "white", label: LABELS[2] },
      { angle: 5.1, radius: 0.28, speed: 0.32, size: 4.0, hue: "pink", label: LABELS[3] },
      { angle: 0.9, radius: 0.4, speed: -0.2, size: 2.8, hue: "cyan" },
      { angle: 2.6, radius: 0.4, speed: -0.2, size: 3.0, hue: "pink" },
      { angle: 4.4, radius: 0.4, speed: -0.2, size: 2.6, hue: "white" },
      { angle: 0.4, radius: 0.52, speed: 0.12, size: 2.1, hue: "cyan" },
      { angle: 2.1, radius: 0.52, speed: 0.12, size: 2.3, hue: "pink" },
      { angle: 3.8, radius: 0.52, speed: 0.12, size: 2.0, hue: "white" },
      { angle: 5.5, radius: 0.52, speed: 0.12, size: 2.4, hue: "pink" },
    ];

    const pulses: Pulse[] = Array.from({ length: 8 }, (_, i) => ({
      from: i % 4,
      to: (i + 1 + (i % 3)) % 4,
      t: (i * 0.17) % 1,
      speed: 0.16 + (i % 4) * 0.035,
    }));

    const dust = Array.from({ length: 24 }, (_, i) => ({
      a: (i / 24) * Math.PI * 2,
      r: 0.2 + (i % 6) * 0.06,
      s: 0.7 + (i % 4) * 0.35,
      speed: 0.05 + (i % 5) * 0.02,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const color = (hue: Node["hue"], a = 1) => {
      if (hue === "cyan") return `rgba(110, 230, 255, ${a})`;
      if (hue === "white") return `rgba(255, 245, 250, ${a})`;
      return `rgba(255, 70, 150, ${a})`;
    };

    const paint = (now: number, animate: boolean) => {
      const t = animate ? now * 0.001 : 0.35;
      if (animate) {
        pointer.x += (pointer.tx - pointer.x) * 0.08;
        pointer.y += (pointer.ty - pointer.y) * 0.08;
      }

      const cx = width * 0.5 + pointer.x * 18;
      const cy = height * 0.48 + pointer.y * 12;
      const scale = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.42);
      aura.addColorStop(0, "rgba(255, 45, 120, 0.2)");
      aura.addColorStop(0.45, "rgba(255, 45, 120, 0.07)");
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.42, 0, Math.PI * 2);
      ctx.fill();

      [0.18, 0.28, 0.4, 0.52].forEach((r, i) => {
        const pulse = 0.55 + Math.sin(t * 1.2 + i) * 0.45;
        ctx.beginPath();
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(255, 90, 160, ${0.12 + pulse * 0.12})`
            : `rgba(120, 210, 255, ${0.08 + pulse * 0.1})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(i === 3 ? [4, 8] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (animate && !reduce) {
        const sweep = (t * 0.7) % (Math.PI * 2);
        const sweepGrad = ctx.createConicGradient(sweep, cx, cy);
        sweepGrad.addColorStop(0, "rgba(255, 45, 120, 0)");
        sweepGrad.addColorStop(0.08, "rgba(255, 70, 150, 0.14)");
        sweepGrad.addColorStop(0.18, "rgba(255, 45, 120, 0)");
        sweepGrad.addColorStop(1, "rgba(255, 45, 120, 0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 0.52, 0, Math.PI * 2);
        ctx.fill();
      }

      dust.forEach((d) => {
        const a = d.a + t * d.speed;
        const x = cx + Math.cos(a) * d.r * scale;
        const y = cy + Math.sin(a) * d.r * scale * 0.72;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 180, 210, ${0.22 + (d.s / 3) * 0.28})`;
        ctx.arc(x, y, d.s, 0, Math.PI * 2);
        ctx.fill();
      });

      const live = nodes.map((node) => {
        const angle = node.angle + t * node.speed;
        return {
          ...node,
          angle,
          x: cx + Math.cos(angle) * node.radius * scale,
          y: cy + Math.sin(angle) * node.radius * scale * 0.78,
        };
      });

      const hubs = live.filter((n) => n.label);
      hubs.forEach((a, i) => {
        hubs.forEach((b, j) => {
          if (j <= i) return;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(255, 100, 170, 0.16)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      hubs.forEach((n) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = n.hue === "cyan" ? "rgba(110, 220, 255, 0.18)" : "rgba(255, 80, 150, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (animate && !reduce) {
        pulses.forEach((pulse) => {
          pulse.t += pulse.speed * 0.016;
          if (pulse.t > 1) pulse.t -= 1;
          const a = hubs[pulse.from];
          const b = hubs[pulse.to];
          if (!a || !b) return;
          const x = a.x + (b.x - a.x) * pulse.t;
          const y = a.y + (b.y - a.y) * pulse.t;
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 90, 170, 0.35)";
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 220, 235, 0.95)";
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      live.forEach((node) => {
        const glow = 0.55 + Math.sin(t * 2.2 + node.angle) * 0.45;
        const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
        g.addColorStop(0, color(node.hue, 0.45 * glow));
        g.addColorStop(1, color(node.hue, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = color(node.hue, 0.95);
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        if (node.label) {
          ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = "rgba(255, 230, 240, 0.82)";
          const labelX = node.x + Math.cos(node.angle) * 20;
          const labelY = node.y + Math.sin(node.angle) * 15;
          ctx.textAlign = labelX >= cx ? "left" : "right";
          ctx.fillText(node.label.toUpperCase(), labelX, labelY);
        }
      });

      const corePulse = 0.75 + Math.sin(t * 1.8) * 0.25;
      const coreR = scale * 0.1 * (0.95 + corePulse * 0.08);
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      coreGlow.addColorStop(0, `rgba(255, 255, 255, ${0.9 * corePulse})`);
      coreGlow.addColorStop(0.2, `rgba(255, 90, 170, ${0.75 * corePulse})`);
      coreGlow.addColorStop(0.55, `rgba(255, 45, 120, ${0.28 * corePulse})`);
      coreGlow.addColorStop(1, "rgba(255, 45, 120, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.35, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 180, 210, ${0.45 * corePulse})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      const coreFill = ctx.createRadialGradient(cx - coreR * 0.3, cy - coreR * 0.3, 0, cx, cy, coreR);
      coreFill.addColorStop(0, "#fff");
      coreFill.addColorStop(0.35, "#ff8ab8");
      coreFill.addColorStop(1, "#ff2d78");
      ctx.fillStyle = coreFill;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy - coreR * 2.4);
      ctx.lineTo(cx, cy + coreR * 2.4);
      ctx.strokeStyle = "rgba(255, 120, 180, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * 0.3, scale * 0.26, scale * 0.04, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 45, 120, ${0.12 + corePulse * 0.08})`;
      ctx.fill();
    };

    const draw = (now: number) => {
      if (!running || !playing) return;
      frame = requestAnimationFrame(draw);
      paint(now, true);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.ty = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    resize();
    paint(performance.now(), false);
    if (playing) frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        const was = playing;
        playing = entry.isIntersecting;
        if (playing && !was) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.08 },
    );
    io.observe(root);
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  return (
    <div className="hero-mind" aria-hidden="true" ref={rootRef}>
      {!active && (
        <picture className="hero-mind__still">
          <source srcSet="/images/hero-mind.webp" type="image/webp" />
          <img src="/images/hero-mind.png" alt="" width={900} height={720} decoding="async" />
        </picture>
      )}
      <span className="hero-mind__glow" />
      {active ? <canvas ref={canvasRef} className="hero-mind__canvas" /> : null}
    </div>
  );
}
