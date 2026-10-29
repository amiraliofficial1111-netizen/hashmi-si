import { useEffect, useRef } from "react";

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

const LABELS = ["Agents", "Systems", "Products", "Data"];

export default function ImpactCore() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    if (window.matchMedia("(max-width: 980px)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let playing = true;

    const nodes: Node[] = [
      { angle: 0.2, radius: 0.28, speed: 0.35, size: 5.5, hue: "pink", label: LABELS[0] },
      { angle: 1.8, radius: 0.28, speed: 0.35, size: 4.2, hue: "cyan", label: LABELS[1] },
      { angle: 3.5, radius: 0.28, speed: 0.35, size: 4.8, hue: "white", label: LABELS[2] },
      { angle: 5.1, radius: 0.28, speed: 0.35, size: 3.8, hue: "pink", label: LABELS[3] },
      { angle: 0.9, radius: 0.42, speed: -0.22, size: 3.2, hue: "cyan" },
      { angle: 2.6, radius: 0.42, speed: -0.22, size: 3.6, hue: "pink" },
      { angle: 4.4, radius: 0.42, speed: -0.22, size: 3.0, hue: "white" },
      { angle: 0.4, radius: 0.55, speed: 0.14, size: 2.4, hue: "cyan" },
      { angle: 2.1, radius: 0.55, speed: 0.14, size: 2.6, hue: "pink" },
      { angle: 3.8, radius: 0.55, speed: 0.14, size: 2.2, hue: "white" },
      { angle: 5.5, radius: 0.55, speed: 0.14, size: 2.8, hue: "pink" },
    ];

    const pulses: Pulse[] = Array.from({ length: 10 }, (_, i) => ({
      from: i % 4,
      to: (i + 1 + (i % 3)) % 4,
      t: (i * 0.17) % 1,
      speed: 0.18 + (i % 4) * 0.04,
    }));

    const dust = Array.from({ length: 48 }, (_, i) => ({
      a: (i / 48) * Math.PI * 2,
      r: 0.18 + (i % 7) * 0.07,
      s: 0.8 + (i % 4) * 0.4,
      speed: 0.05 + (i % 5) * 0.02,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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

    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      if (!playing) return;

      const t = now * 0.001;
      const ptr = pointer.current;
      ptr.x += (ptr.tx - ptr.x) * 0.08;
      ptr.y += (ptr.ty - ptr.y) * 0.08;

      const cx = width * 0.5 + ptr.x * 18;
      const cy = height * 0.48 + ptr.y * 12;
      const scale = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      // soft atmosphere
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.48);
      aura.addColorStop(0, "rgba(255, 45, 120, 0.22)");
      aura.addColorStop(0.45, "rgba(255, 45, 120, 0.08)");
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // radar rings
      [0.18, 0.28, 0.42, 0.55].forEach((r, i) => {
        const pulse = 0.55 + Math.sin(t * 1.2 + i) * 0.45;
        ctx.beginPath();
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? `rgba(255, 90, 160, ${0.12 + pulse * 0.12})` : `rgba(120, 210, 255, ${0.08 + pulse * 0.1})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(i === 3 ? [4, 8] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // scanning sweep
      if (!reduce) {
        const sweep = (t * 0.7) % (Math.PI * 2);
        const sweepGrad = ctx.createConicGradient(sweep, cx, cy);
        sweepGrad.addColorStop(0, "rgba(255, 45, 120, 0)");
        sweepGrad.addColorStop(0.08, "rgba(255, 70, 150, 0.16)");
        sweepGrad.addColorStop(0.18, "rgba(255, 45, 120, 0)");
        sweepGrad.addColorStop(1, "rgba(255, 45, 120, 0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      // dust orbit
      dust.forEach((d) => {
        const a = d.a + t * d.speed;
        const x = cx + Math.cos(a) * d.r * scale;
        const y = cy + Math.sin(a) * d.r * scale * 0.72;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 180, 210, ${0.25 + (d.s / 3) * 0.3})`;
        ctx.arc(x, y, d.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // compute live node positions (inner ring labeled)
      const live = nodes.map((node) => {
        const angle = node.angle + t * node.speed;
        return {
          ...node,
          angle,
          x: cx + Math.cos(angle) * node.radius * scale,
          y: cy + Math.sin(angle) * node.radius * scale * 0.78,
        };
      });

      // connection web among labeled nodes
      const hubs = live.filter((n) => n.label);
      hubs.forEach((a, i) => {
        hubs.forEach((b, j) => {
          if (j <= i) return;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(255, 100, 170, 0.14)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // spokes to core
      hubs.forEach((n) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = n.hue === "cyan" ? "rgba(110, 220, 255, 0.16)" : "rgba(255, 80, 150, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // pulses along hub links
      if (!reduce) {
        pulses.forEach((pulse) => {
          pulse.t += pulse.speed * 0.016;
          if (pulse.t > 1) pulse.t -= 1;
          const a = hubs[pulse.from];
          const b = hubs[pulse.to];
          if (!a || !b) return;
          const u = pulse.t;
          const x = a.x + (b.x - a.x) * u;
          const y = a.y + (b.y - a.y) * u;
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

      // outer & mid nodes
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
          ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = "rgba(255, 230, 240, 0.78)";
          const labelX = node.x + Math.cos(node.angle) * 18;
          const labelY = node.y + Math.sin(node.angle) * 14;
          ctx.textAlign = labelX >= cx ? "left" : "right";
          ctx.fillText(node.label.toUpperCase(), labelX, labelY);
        }
      });

      // core nucleus
      const corePulse = 0.75 + Math.sin(t * 1.8) * 0.25;
      const coreR = scale * 0.09 * (0.95 + corePulse * 0.08);
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      coreGlow.addColorStop(0, `rgba(255, 255, 255, ${0.9 * corePulse})`);
      coreGlow.addColorStop(0.2, `rgba(255, 90, 170, ${0.75 * corePulse})`);
      coreGlow.addColorStop(0.55, `rgba(255, 45, 120, ${0.28 * corePulse})`);
      coreGlow.addColorStop(1, "rgba(255, 45, 120, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // core rings
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

      // vertical axis mark
      ctx.beginPath();
      ctx.moveTo(cx, cy - coreR * 2.4);
      ctx.lineTo(cx, cy + coreR * 2.4);
      ctx.strokeStyle = "rgba(255, 120, 180, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // floor ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * 0.32, scale * 0.28, scale * 0.045, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 45, 120, ${0.12 + corePulse * 0.08})`;
      ctx.fill();
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.current.tx = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.current.ty = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => {
      pointer.current.tx = 0;
      pointer.current.ty = 0;
    };

    resize();
    draw(performance.now());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        playing = entry.isIntersecting;
      },
      { threshold: 0.08 },
    );
    visibility.observe(root);
    window.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="impact-core" ref={rootRef} aria-hidden="true">
      <canvas ref={canvasRef} className="impact-core__canvas" />
      <p className="impact-core__tag">Intelligence engine</p>
    </div>
  );
}
