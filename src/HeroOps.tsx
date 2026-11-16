import { useEffect, useRef, useState } from "react";
import "./styles/ops.css";
import { APPS, ROTATE_MS, formatClock, formatMetric, projectApp, type AppFrame } from "./ops/apps";

export default function HeroOps() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [workMs, setWorkMs] = useState(0);
  const [rotateMs, setRotateMs] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const pausedRef = useRef(false);
  const indexRef = useRef(0);
  const workRef = useRef(0);
  const rotateRef = useRef(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let last = Date.now();
    const id = window.setInterval(() => {
      const time = Date.now();
      const delta = time - last;
      last = time;
      setNow(time);
      if (pausedRef.current) return;
      workRef.current += delta;
      setWorkMs(workRef.current);
      rotateRef.current += delta;
      if (rotateRef.current >= ROTATE_MS) {
        rotateRef.current -= ROTATE_MS;
        indexRef.current = (indexRef.current + 1) % APPS.length;
        setIndex(indexRef.current);
      }
      setRotateMs(rotateRef.current);
    }, 80);
    return () => window.clearInterval(id);
  }, []);

  function show(next: number) {
    indexRef.current = (next + APPS.length) % APPS.length;
    rotateRef.current = 0;
    setIndex(indexRef.current);
    setRotateMs(0);
  }

  const frame = projectApp(APPS[index], workMs, now);
  const rotate = Math.max(0, Math.min(1, rotateMs / ROTATE_MS));

  return (
    <div
      className={`hero-ops${paused ? " is-paused" : ""}`}
      role="region"
      aria-label="Sandbox demo of Shopify, HubSpot, Zapier, and Google Analytics. No live accounts are connected."
    >
      <div className="hero-ops__glow" aria-hidden="true" />
      <header className="hero-ops__bar">
        <div>
          <strong>Sandbox Demo</strong>
          <em>No live connection</em>
        </div>
        <div className="hero-ops__nav">
          <button type="button" aria-label="Previous application" onClick={() => show(index - 1)}>←</button>
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" aria-label="Next application" onClick={() => show(index + 1)}>→</button>
        </div>
      </header>
      <div className="hero-ops__timer" aria-hidden="true">
        <i style={{ width: `${rotate * 100}%` }} />
      </div>

      <div className="hero-ops__stage" key={frame.app.id}>
        <Summary frame={frame} paused={paused} />
      </div>

      <div className="hero-ops__dots" role="tablist" aria-label="Applications">
        {APPS.map((app, appIndex) => (
          <button
            key={app.id}
            type="button"
            role="tab"
            aria-selected={appIndex === index}
            aria-label={app.name}
            className={appIndex === index ? "is-on" : undefined}
            onClick={() => show(appIndex)}
          />
        ))}
      </div>
      <p className="hero-ops__note">Sandbox demo data. Shopify, HubSpot, Zapier, and Google Analytics are not connected.</p>
      <p className="hero-ops__sr" aria-live="polite">{frame.app.name}. {frame.step.operation}</p>
    </div>
  );
}

function Summary({ frame, paused }: { frame: AppFrame; paused: boolean }) {
  const { app, step, progress, totals } = frame;
  const percent = Math.round(progress * 100);
  const phase = progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2;
  const phases = ["Prepare", "Execute", "Confirm"];

  return (
    <>
      <div className="hero-ops__feature">
        <div className="hero-ops__now">
          <div className="hero-ops__now-head">
            <div className="hero-ops__logo"><Mark id={app.id} /></div>
            <div className="hero-ops__now-copy">
              <div className="hero-ops__now-top">
                <span className="hero-ops__status">{paused ? "Paused" : "Working now"} · {percent}%</span>
                <em>{step.service}</em>
              </div>
              <h2>{app.name}</h2>
              <p className="hero-ops__discipline">{app.discipline}</p>
            </div>
          </div>
          <strong>{step.operation}</strong>
          <Typed text={step.detail} paused={paused} />
          <span className="hero-ops__result">When this finishes · {step.result}</span>
          <span className="hero-ops__track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span>
        </div>
        <ol className="hero-ops__phases">
          {phases.map((label, index) => (
            <li key={label} className={index < phase ? "is-done" : index === phase ? "is-now" : undefined}>{label}</li>
          ))}
        </ol>
        <div className="hero-ops__services">
          <span>Sandbox services</span>
          {app.services.map((service) => (
            <em key={service} className={service === step.service ? "is-on" : undefined}>{service}</em>
          ))}
        </div>
      </div>

      <section className="hero-ops__report" aria-label={`${app.name} sandbox report`}>
        <Chart frame={frame} />
        <ul className="hero-ops__metrics">
          {app.metrics.map((metric) => (
            <li key={metric.key}>
              <span>{metric.label}</span>
              <strong>{formatMetric(metric.format, totals[metric.key] ?? 0)}</strong>
            </li>
          ))}
        </ul>
        <div className="hero-ops__split">
          <div>
            <p className="hero-ops__label">Recent activity</p>
            <ul className="hero-ops__feed">
              {frame.activity.map((item) => (
                <li key={`${item.at}-${item.text}`}>
                  <time>{formatClock(item.at)}</time>
                  <span><em>{item.service}</em>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="hero-ops__label">Task status</p>
            <ul className="hero-ops__tasks">
              {frame.operations.map((item) => (
                <li key={item.label} data-state={item.state}>
                  <i />
                  <span>
                    {item.label}
                    <small>{item.state === "running" ? item.detail : `${item.service} · ${item.result}`}</small>
                  </span>
                  <b>{item.state}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Typed({ text, paused }: { text: string; paused: boolean }) {
  const [count, setCount] = useState(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let shown = 0;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      shown += 1;
      setCount(shown);
      if (shown >= text.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [text]);

  const shown = text.slice(0, count);

  return (
    <p className="hero-ops__typed">
      <span className="hero-ops__sr">{text}</span>
      <span aria-hidden="true">
        {shown}
        {count < text.length ? <i className="hero-ops__caret" /> : null}
      </span>
    </p>
  );
}

function Chart({ frame }: { frame: AppFrame }) {
  const { app } = frame;
  const live = Math.max(0, (frame.totals[app.chart.liveKey] ?? 0) - (app.base[app.chart.liveKey] ?? 0));
  const points = app.chart.kind === "funnel"
    ? app.chart.points.map((point, index) => (
      index === app.chart.liveIndex ? { ...point, value: point.value + live } : point
    ))
    : app.chart.points;
  const max = Math.max(...points.map((point) => point.value), 1);

  return (
    <figure className="hero-ops__chart">
      <figcaption>{app.chart.title}</figcaption>
      {app.chart.kind === "funnel" ? (
        <ul className="hero-ops__funnel">
          {points.map((point) => (
            <li key={point.label}>
              <span>{point.label}</span>
              <i style={{ width: `${Math.max(8, (point.value / max) * 100)}%` }} />
              <b>{point.value}</b>
            </li>
          ))}
        </ul>
      ) : (
        <svg viewBox="0 0 240 72" role="img" aria-label={`${app.chart.title}. Sandbox series.`}>
          {app.chart.kind === "area" ? <Area points={points} max={max} /> : <Bars points={points} max={max} />}
        </svg>
      )}
    </figure>
  );
}

function Bars({ points, max }: { points: { label: string; value: number }[]; max: number }) {
  const gap = 8;
  const width = (240 - gap * (points.length - 1)) / points.length;
  return (
    <>
      {points.map((point, index) => {
        const height = Math.max(4, (point.value / max) * 58);
        const x = index * (width + gap);
        return <rect key={point.label} x={x} y={64 - height} width={width} height={height} rx="2" />;
      })}
    </>
  );
}

function Area({ points, max }: { points: { label: string; value: number }[]; max: number }) {
  const step = 240 / Math.max(1, points.length - 1);
  const coords = points.map((point, index) => {
    const x = index * step;
    const y = 64 - (point.value / max) * 52;
    return [x, y] as const;
  });
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const fill = `0,64 ${line} 240,64`;
  return (
    <>
      <polygon points={fill} />
      <polyline points={line} pathLength={1} />
    </>
  );
}

function Mark({ id }: { id: AppFrame["app"]["id"] }) {
  if (id === "shopify") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#95BF47" d="M22.6 8.2 21.2 7c-.2-.5-.7-.7-1.1-.4l-.7.3C18.8 5.4 17.8 4.6 16.6 4.6h-.2c-.4-1-1-1.6-1.7-1.6-2.8 0-4.1 3.5-4.6 5.3l-1.9.6c-.6.2-.6.3-.7.8L6.2 24.4 18.2 27l7.2-1.7-2.8-17.1z" />
        <path fill="#5E8E3E" d="M21.2 7c-.2-.5-.7-.7-1.1-.4l-.4.2.8 6.2 2.2-.6L21.2 7z" />
        <path fill="#fff" d="M15.6 12.2c-.7.2-1.4.6-1.4 1.4 0 .7.5 1 1.1 1.2.8.3 1.2.6 1.2 1.2 0 .8-.8 1.3-1.8 1.3-1.2 0-1.8-.4-1.8-.4l-.3 1.5s.7.5 2 .5c1.8 0 3-1 3-2.6 0-1.3-.9-2-1.8-2.4-.7-.3-1.1-.6-1.1-1.1 0-.5.4-.9 1.3-.9.9 0 1.4.3 1.4.3l.4-1.5s-.7-.5-1.8-.5c-.2 0-.4 0-.6.1.4-.6 1.1-1 1.9-1 .2 1 .1 1.7-.7 2.9z" />
      </svg>
    );
  }
  if (id === "hubspot") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="3.1" fill="#FF7A59" />
        <circle cx="16" cy="6.2" r="2.3" fill="#FF7A59" />
        <circle cx="24.6" cy="21" r="2.3" fill="#FF7A59" />
        <circle cx="7.4" cy="21" r="2.3" fill="#FF7A59" />
        <path d="M16 9v4M18.4 17.6l3.6 2M13.6 17.6 10 19.6" stroke="#FF7A59" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "zapier") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#FF4F00" d="M16 3.2 18.1 13 27.8 8.6 20.4 16l7.4 7.4L18.1 19 16 28.8 13.9 19 4.2 23.4 11.6 16 4.2 8.6 13.9 13 16 3.2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="16" width="4.5" height="11" rx="1" fill="#E37400" />
      <rect x="11.2" y="11" width="4.5" height="16" rx="1" fill="#F9AB00" />
      <rect x="17.4" y="7" width="4.5" height="20" rx="1" fill="#E37400" />
      <rect x="23.6" y="13" width="4.5" height="14" rx="1" fill="#F9AB00" />
    </svg>
  );
}
