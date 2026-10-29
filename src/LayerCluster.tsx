import { useEffect, useRef } from "react";

type Layer = {
  y: number;
  w: number;
  h: number;
  label: string;
  hue: "pink" | "cyan" | "white";
};

type Orbit = {
  layer: number;
  angle: number;
  speed: number;
  size: number;
  hue: "pink" | "cyan" | "white";
};

type Spark = {
  layer: number;
  t: number;
  speed: number;
  xOff: number;
};

const LAYERS: Layer[] = [
  { y: 0.22, w: 0.42, h: 0.09, label: "SOFTWARE", hue: "pink" },
  { y: 0.38, w: 0.36, h: 0.08, label: "DATA", hue: "cyan" },
  { y: 0.54, w: 0.3, h: 0.07, label: "CLOUD", hue: "white" },
  { y: 0.7, w: 0.24, h: 0.06, label: "GROWTH", hue: "pink" },
];

export default function LayerCluster() {
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

    const orbits: Orbit[] = [
      { layer: 0, angle: 0.2, speed: 0.55, size: 3.2, hue: "pink" },
      { layer: 0, angle: 2.4, speed: 0.55, size: 2.4, hue: "cyan" },
      { layer: 0, angle: 4.2, speed: 0.55, size: 2.8, hue: "white" },
      { layer: 1, angle: 1.1, speed: -0.42, size: 2.8, hue: "cyan" },
      { layer: 1, angle: 3.6, speed: -0.42, size: 2.2, hue: "pink" },
      { layer: 2, angle: 0.6, speed: 0.38, size: 2.6, hue: "white" },
      { layer: 2, angle: 3.0, speed: 0.38, size: 2.0, hue: "cyan" },
      { layer: 3, angle: 1.8, speed: -0.5, size: 2.4, hue: "pink" },
      { layer: 3, angle: 4.5, speed: -0.5, size: 2.0, hue: "white" },
    ];

    const sparks: Spark[] = Array.from({ length: 14 }, (_, i) => ({
      layer: i % 3,
      t: (i * 0.13) % 1,
      speed: 0.22 + (i % 5) * 0.05,
      xOff: ((i % 7) - 3) * 0.04,
    }));

    const dust = Array.from({ length: 36 }, (_, i) => ({
      a: (i / 36) * Math.PI * 2,
      r: 0.12 + (i % 6) * 0.05,
      y: 0.2 + (i % 8) * 0.07,
      s: 0.7 + (i % 4) * 0.35,
      speed: 0.08 + (i % 5) * 0.03,
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

    const color = (hue: Orbit["hue"], a = 1) => {
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

      const cx = width * 0.5 + ptr.x * 22;
      const cyBase = height * 0.08 + ptr.y * 10;
      const scale = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      // atmosphere bloom
      const aura = ctx.createRadialGradient(cx, height * 0.48, 0, cx, height * 0.48, scale * 0.5);
      aura.addColorStop(0, "rgba(255, 45, 120, 0.2)");
      aura.addColorStop(0.45, "rgba(255, 45, 120, 0.07)");
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, height * 0.48, scale * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // ambient dust
      dust.forEach((d) => {
        const a = d.a + t * d.speed;
        const x = cx + Math.cos(a) * d.r * scale;
        const y = cyBase + d.y * height + Math.sin(a * 1.4) * 6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 180, 210, ${0.18 + (d.s / 4) * 0.25})`;
        ctx.arc(x, y, d.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // central beam column
      const beam = ctx.createLinearGradient(cx, cyBase + height * 0.18, cx, cyBase + height * 0.78);
      beam.addColorStop(0, "rgba(255, 90, 170, 0)");
      beam.addColorStop(0.35, "rgba(255, 70, 150, 0.18)");
      beam.addColorStop(0.65, "rgba(110, 220, 255, 0.12)");
      beam.addColorStop(1, "rgba(255, 70, 150, 0)");
      ctx.fillStyle = beam;
      ctx.fillRect(cx - 3, cyBase + height * 0.18, 6, height * 0.6);

      // rising sparks between layers
      if (!reduce) {
        sparks.forEach((spark) => {
          spark.t += spark.speed * 0.016;
          if (spark.t > 1) spark.t -= 1;
          const from = LAYERS[spark.layer];
          const to = LAYERS[spark.layer + 1];
          if (!from || !to) return;
          const y0 = cyBase + from.y * height;
          const y1 = cyBase + to.y * height;
          const u = spark.t;
          const x = cx + spark.xOff * scale + Math.sin(t * 2 + spark.xOff * 20) * 4;
          const y = y0 + (y1 - y0) * u;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
          g.addColorStop(0, "rgba(255, 220, 235, 0.95)");
          g.addColorStop(0.4, "rgba(255, 90, 170, 0.45)");
          g.addColorStop(1, "rgba(255, 90, 170, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 245, 250, 0.95)";
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // stacked translucent planes (back to front = top to bottom visually)
      LAYERS.forEach((layer, i) => {
        const y = cyBase + layer.y * height;
        const rx = layer.w * scale;
        const ry = layer.h * scale;
        const breathe = 1 + Math.sin(t * 1.4 + i * 0.9) * 0.018;
        const rw = rx * breathe;
        const rh = ry * breathe;

        // soft shadow under plane
        ctx.beginPath();
        ctx.ellipse(cx, y + rh * 0.9, rw * 0.92, rh * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 45, 120, ${0.06 + i * 0.015})`;
        ctx.fill();

        // plane fill
        const fill = ctx.createRadialGradient(cx, y, 0, cx, y, rw);
        if (layer.hue === "cyan") {
          fill.addColorStop(0, "rgba(110, 220, 255, 0.22)");
          fill.addColorStop(0.55, "rgba(80, 160, 220, 0.08)");
          fill.addColorStop(1, "rgba(80, 160, 220, 0)");
        } else if (layer.hue === "white") {
          fill.addColorStop(0, "rgba(255, 240, 248, 0.18)");
          fill.addColorStop(0.55, "rgba(255, 120, 180, 0.07)");
          fill.addColorStop(1, "rgba(255, 45, 120, 0)");
        } else {
          fill.addColorStop(0, "rgba(255, 90, 170, 0.28)");
          fill.addColorStop(0.55, "rgba(255, 45, 120, 0.1)");
          fill.addColorStop(1, "rgba(255, 45, 120, 0)");
        }
        ctx.beginPath();
        ctx.ellipse(cx, y, rw, rh, 0, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        // rim
        ctx.beginPath();
        ctx.ellipse(cx, y, rw, rh, 0, 0, Math.PI * 2);
        ctx.strokeStyle = layer.hue === "cyan"
          ? `rgba(120, 220, 255, ${0.35 + Math.sin(t * 2 + i) * 0.12})`
          : `rgba(255, 120, 180, ${0.4 + Math.sin(t * 2 + i) * 0.15})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // inner dashed ring
        ctx.beginPath();
        ctx.ellipse(cx, y, rw * 0.72, rh * 0.72, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 200, 220, 0.16)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 7]);
        ctx.stroke();
        ctx.setLineDash([]);

        // cross guides
        ctx.beginPath();
        ctx.moveTo(cx - rw * 0.85, y);
        ctx.lineTo(cx + rw * 0.85, y);
        ctx.moveTo(cx, y - rh * 0.85);
        ctx.lineTo(cx, y + rh * 0.85);
        ctx.strokeStyle = "rgba(255, 140, 190, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // label on right edge of plane
        ctx.font = '600 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = "rgba(255, 220, 235, 0.7)";
        ctx.textAlign = "left";
        ctx.fillText(layer.label, cx + rw * 0.78, y - 4);
      });

      // orbiting nodes on each plane
      orbits.forEach((node) => {
        const layer = LAYERS[node.layer];
        if (!layer) return;
        const angle = node.angle + (reduce ? 0 : t * node.speed);
        const y = cyBase + layer.y * height;
        const rx = layer.w * scale * 0.78;
        const ry = layer.h * scale * 0.78;
        const x = cx + Math.cos(angle) * rx;
        const ny = y + Math.sin(angle) * ry;
        const glow = 0.55 + Math.sin(t * 2.4 + angle) * 0.45;

        const g = ctx.createRadialGradient(x, ny, 0, x, ny, node.size * 4.5);
        g.addColorStop(0, color(node.hue, 0.5 * glow));
        g.addColorStop(1, color(node.hue, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, ny, node.size * 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = color(node.hue, 0.95);
        ctx.arc(x, ny, node.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // apex nucleus above top layer
      const apexY = cyBase + LAYERS[0].y * height - scale * 0.08;
      const pulse = 0.75 + Math.sin(t * 1.9) * 0.25;
      const coreR = scale * 0.035 * (0.95 + pulse * 0.1);
      const coreGlow = ctx.createRadialGradient(cx, apexY, 0, cx, apexY, coreR * 4);
      coreGlow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * pulse})`);
      coreGlow.addColorStop(0.25, `rgba(255, 90, 170, ${0.7 * pulse})`);
      coreGlow.addColorStop(0.6, `rgba(255, 45, 120, ${0.22 * pulse})`);
      coreGlow.addColorStop(1, "rgba(255, 45, 120, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, apexY, coreR * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, apexY, coreR, 0, Math.PI * 2);
      const coreFill = ctx.createRadialGradient(cx - coreR * 0.3, apexY - coreR * 0.3, 0, cx, apexY, coreR);
      coreFill.addColorStop(0, "#fff");
      coreFill.addColorStop(0.4, "#ff8ab8");
      coreFill.addColorStop(1, "#ff2d78");
      ctx.fillStyle = coreFill;
      ctx.fill();

      // floor reflection
      const floorY = cyBase + height * 0.82;
      ctx.beginPath();
      ctx.ellipse(cx, floorY, scale * 0.26, scale * 0.04, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 45, 120, ${0.1 + pulse * 0.07})`;
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
    <div className="layer-canvas" ref={rootRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
