import { FormEvent, useEffect, useRef, useState } from "react";
import HeroSpiral from "./HeroSpiral";
import ImpactCore from "./ImpactCore";
import LayerCluster from "./LayerCluster";
import LayerVisual from "./LayerVisual";
import CapVisual from "./CapVisual";
import Mark from "./Mark";
import SignalIcon from "./SignalIcon";
import { createBed, type Bed } from "./audioBed";
import { approach, budgets, disciplines, impact, interests, method, signals } from "./content";
import { runCount } from "./runCount";
import "./styles/cinematic.css";

export default function CinematicApp() {
  const bedRef = useRef<Bed | null>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"gate" | "leaving" | "live">("gate");
  const [sound, setSound] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (phase === "gate") enterRef.current?.focus();
  }, [phase]);

  useEffect(() => () => bedRef.current?.stop(), []);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (phase === "gate") {
        const gate = document.querySelector<HTMLElement>(".gate");
        if (gate) {
          const px = (event.clientX / window.innerWidth - 0.5) * 14;
          const py = (event.clientY / window.innerHeight - 0.5) * 10;
          gate.style.setProperty("--gx", `${px}px`);
          gate.style.setProperty("--gy", `${py}px`);
        }
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [phase]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          entry.target.querySelectorAll<HTMLElement>("[data-count]").forEach(runCount);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    const watch = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((node) => {
        const group = node.parentElement?.querySelectorAll(":scope > .reveal");
        const index = group ? Array.from(group).indexOf(node) : 0;
        if (index > 0 && !node.style.transitionDelay) node.style.transitionDelay = `${index * 90}ms`;
        observer.observe(node);
      });
    };
    watch();
    const root = document.getElementById("root");
    const changes = new MutationObserver(watch);
    if (root) changes.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      changes.disconnect();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "live") return;
    document.querySelectorAll<HTMLElement>(".hud [data-count]").forEach(runCount);
  }, [phase]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  function armSound(enabled: boolean) {
    if (!enabled) {
      bedRef.current?.setLevel(0);
      setSound(false);
      return;
    }
    if (!bedRef.current) bedRef.current = createBed();
    bedRef.current?.setLevel(1);
    setSound(true);
  }

  function enter(withSound: boolean) {
    if (phase === "leaving" || phase === "live") return;
    armSound(withSound);
    setPhase("leaving");
    window.setTimeout(() => setPhase("live"), 720);
  }

  function closeMenu() {
    setMenu(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      [
        `Name: ${form.get("name")}`,
        `Email: ${form.get("email")}`,
        `Company: ${form.get("company") || "—"}`,
        `Phone: ${form.get("phone") || "—"}`,
        `Interest: ${form.get("interest")}`,
        `Budget: ${form.get("budget") || "—"}`,
        "",
        String(form.get("brief") || ""),
      ].join("\n"),
    );
    setSent(true);
    window.location.href = `mailto:hello@hashmi.si?subject=Project%20enquiry&body=${body}`;
  }

  return (
    <div className={`hx${phase === "live" ? "" : " is-locked"}`}>
      <header className={`topbar${solid ? " is-solid" : ""}${menu ? " is-open" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu}>
          <Mark />
          <span>Hashmi<em>.SI</em></span>
        </a>
        <nav>
          <a href="#capabilities" onClick={closeMenu}>Capabilities</a>
          <a href="#approach" onClick={closeMenu}>Approach</a>
          <a href="#company" onClick={closeMenu}>Company</a>
          <a className="nav-cta" href="#start" onClick={closeMenu}>Start a project</a>
        </nav>
        <button
          type="button"
          className="menu"
          aria-expanded={menu}
          aria-label={menu ? "Close menu" : "Open menu"}
          onClick={() => setMenu((open) => !open)}
        >
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-stage">
            <div className="hero-copy">
              <p className="eyebrow">Intelligence for the next era</p>
              <h1>Intelligence,<br /><em>beautifully</em><br />engineered.</h1>
              <p className="lede">
                AI-native products and intelligent systems for ambitious businesses—built to move faster, operate smarter, and lead what&apos;s next.
              </p>
              <div className="hero-actions">
                <a className="btn btn-fill" href="#start">Build with us</a>
                <a className="btn btn-line" href="#capabilities">See capabilities</a>
              </div>
            </div>

            <div className="hero-visual">
              <p className="hero-mark">
                <span>Hashmi SI</span>
                Karachi · Dubai · Global
              </p>
              <HeroSpiral />
            </div>
          </div>

          <div className="hero-rail">
            <p><span>01</span><strong>Private systems</strong><em>Your data stays in your control.</em></p>
            <p><span>02</span><strong>Human-led</strong><em>Strategy before software.</em></p>
            <p><span>03</span><strong>Global</strong><em>Selective engagement. Production delivery.</em></p>
            <a className="scroll-cue" href="#thinking">Scroll <i /></a>
          </div>
        </section>

        <p className="ribbon">
          <span>
            <i>Powered by AI · Built for real impact · </i>
            <i>Powered by AI · Built for real impact · </i>
            <i>Powered by AI · Built for real impact · </i>
            <i>Powered by AI · Built for real impact · </i>
          </span>
        </p>

        <section className="pov" id="thinking">
          <div className="reveal">
            <p className="kicker">Our point of view</p>
            <p className="year">2026 — Beyond</p>
          </div>
          <p className="essay reveal">
            The next generation of category-defining companies won&apos;t simply use AI. They will be built around intelligence. Hashmi SI partners with leaders to create that future—responsibly, securely, and at production speed.
          </p>
          <ul className="pills reveal">
            <li>Responsible</li>
            <li>Secure</li>
            <li>Human-led</li>
          </ul>
          <a className="text-link reveal" href="#approach">Explore our thinking</a>
        </section>

        <section className="impact" id="capabilities">
          <div className="impact-terrain" aria-hidden="true">
            <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ridgeWash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff2d78" stopOpacity="0" />
                  <stop offset="72%" stopColor="#ff1464" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ff2d78" stopOpacity="0" />
                </linearGradient>
                <filter id="ridgeBlur" x="-5%" y="-20%" width="110%" height="160%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
              </defs>
              <path fill="#120814" d="M0 168 L90 132 L170 156 L280 96 L390 148 L510 78 L640 140 L760 70 L900 150 L1030 64 L1160 138 L1280 92 L1440 150 L1440 420 L0 420 Z" />
              <path fill="#09050e" d="M0 214 L120 168 L230 198 L360 142 L500 196 L640 128 L790 188 L930 118 L1080 176 L1220 130 L1440 188 L1440 420 L0 420 Z" />
              <path fill="url(#ridgeWash)" d="M0 250 L1440 250 L1440 420 L0 420 Z" />
              <path fill="#050308" d="M0 268 L150 214 L270 248 L410 186 L560 242 L720 176 L880 236 L1040 168 L1200 228 L1440 190 L1440 420 L0 420 Z" />
              <path d="M0 292 C180 236 280 268 430 214 C590 156 700 230 860 176 C1020 122 1140 210 1440 168" stroke="#ff2d78" strokeWidth="14" fill="none" filter="url(#ridgeBlur)" opacity="0.85" />
              <path d="M0 292 C180 236 280 268 430 214 C590 156 700 230 860 176 C1020 122 1140 210 1440 168" stroke="#ffd0e4" strokeWidth="1.4" fill="none" />
            </svg>
          </div>
          <div className="impact-stage">
            <div className="impact-stats">
              {signals.map(([index, value, label, count, suffix]) => (
                <article className="reveal" key={index}>
                  <div>
                    <span>{index}</span>
                    <strong {...(count ? { "data-count": count, "data-suffix": suffix } : {})}>{value}</strong>
                    <em>{label}</em>
                  </div>
                  <SignalIcon index={index} />
                </article>
              ))}
            </div>

            <div className="impact-hero">
              <div className="impact-copy reveal">
                <p className="kicker">Capabilities</p>
                <h2>From intelligence<br /><em>to impact.</em></h2>
                <p>We turn complex challenges into intelligent solutions with AI-powered systems, data-driven insights and scalable technology — built for real business impact.</p>
              </div>
              <ImpactCore />
              <aside className="impact-rail reveal">
                <p>AI-powered<br />intelligence systems</p>
                <small>Data + Models + Automation</small>
                <ol>
                  <li><a href="#capabilities"><span>01</span> Overview</a></li>
                  <li><a href="#cap-agentic"><span>02</span> AI Systems</a></li>
                  <li><a href="#cap-enterprise"><span>03</span> Enterprise</a></li>
                  <li><a href="#cap-products"><span>04</span> Products</a></li>
                </ol>
              </aside>
            </div>

            <div className="impact-grid">
              {impact.map((item) => (
                <article className="reveal" id={item.index === "01" ? "cap-agentic" : item.index === "02" ? "cap-enterprise" : "cap-products"} key={item.title}>
                  <header>
                    <span>{item.index}</span>
                    <em>{item.badge}</em>
                  </header>
                  <CapVisual index={item.index} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <ul>
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </article>
              ))}
            </div>

            <div className="impact-foot">
              <a href="#approach">See our approach</a>
              <p>Building intelligence<br />for a smarter tomorrow</p>
            </div>
          </div>
        </section>

        <section className="partner" id="layers">
          <div className="impact-terrain" aria-hidden="true">
            <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
              <path fill="#120814" d="M0 168 L90 132 L170 156 L280 96 L390 148 L510 78 L640 140 L760 70 L900 150 L1030 64 L1160 138 L1280 92 L1440 150 L1440 420 L0 420 Z" />
              <path fill="#09050e" d="M0 214 L120 168 L230 198 L360 142 L500 196 L640 128 L790 188 L930 118 L1080 176 L1220 130 L1440 188 L1440 420 L0 420 Z" />
              <path fill="#050308" d="M0 268 L150 214 L270 248 L410 186 L560 242 L720 176 L880 236 L1040 168 L1200 228 L1440 190 L1440 420 L0 420 Z" />
            </svg>
          </div>
          <div className="layer-stage">
            <div className="layer-hero">
              <div className="layer-copy reveal">
                <p className="kicker">Our capabilities</p>
                <h2>One partner.<br /><em>Every digital layer.</em></h2>
                <p>Hashmi Innovations&apos; complete technology, creative, commerce, and growth expertise—now powered by the intelligence of Hashmi SI.</p>
                <div className="layer-stats">
                  <p>
                    <i aria-hidden="true">
                      <svg viewBox="0 0 32 32"><circle cx="11" cy="12" r="3.2" /><circle cx="20" cy="13" r="2.6" /><path d="M5.5 23c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5M17 23c.4-2.4 2-3.8 3.8-3.8 1.6 0 3 .9 3.6 2.6" /></svg>
                    </i>
                    <strong data-count="8" data-pad="2" data-suffix="+">08+</strong>
                    <span>Specialist disciplines</span>
                  </p>
                  <p>
                    <i aria-hidden="true">
                      <svg viewBox="0 0 32 32"><path d="M14 18.5 18.5 14" /><path d="M12.2 13.2 9.4 10.4a3.2 3.2 0 0 1 4.5-4.5l2.8 2.8M19.8 18.8l2.8 2.8a3.2 3.2 0 0 1-4.5 4.5l-2.8-2.8" /></svg>
                    </i>
                    <strong data-count="35" data-suffix="+">35+</strong>
                    <span>Connected capabilities</span>
                  </p>
                </div>
              </div>
              <div className="layer-cluster">
                <LayerCluster />
                <p className="layer-tag tag-ai"><b>Stack</b><small>Connected layers</small></p>
                <p className="layer-tag tag-data"><b>Flow</b><small>Live intelligence</small></p>
                <p className="layer-tag tag-cloud"><b>Scale</b><small>Compound growth</small></p>
              </div>
              <aside className="layer-rail reveal">
                <p>Capabilities</p>
                <ol>
                  <li><a href="#layer-01"><span>01</span> Software</a></li>
                  <li><a href="#layer-02"><span>02</span> Data</a></li>
                  <li><a href="#layer-03"><span>03</span> Cloud</a></li>
                  <li><a href="#layer-04"><span>04</span> Growth</a></li>
                </ol>
              </aside>
            </div>
            <div className="layer-grid">
              {disciplines.map((group) => (
                <article className="layer-card reveal" id={`layer-${group.index}`} key={group.title}>
                  <div>
                    <span>{group.index}</span>
                    <h3>{group.title}</h3>
                    <p>{group.copy}</p>
                    <ul>
                      {group.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <LayerVisual index={group.index} />
                </article>
              ))}
            </div>
            <div className="layer-foot">
              <a href="#start">Start a project</a>
              <p>Built for what&apos;s next</p>
            </div>
          </div>
        </section>

        <section className="compound" id="approach">
          <header className="section-head reveal">
            <h2>Designed to<br />compound.</h2>
            <p>We don&apos;t deliver experiments. We build living systems that get smarter with every interaction.</p>
          </header>
          <p className="flow reveal"><span>Strategy</span><i>→</i><span>Systems</span><i>→</i><span>Growth</span></p>
          <ul className="outcomes reveal">
            <li>Better decisions</li>
            <li>Intelligent systems</li>
            <li>Long-term impact</li>
          </ul>
          <ol className="method">
            {method.map((step) => (
              <li className="reveal" key={step.title}>
                <span>{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <ul>{step.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="future">
          <blockquote className="reveal">
            The future belongs to organizations that can turn intelligence into action.
            <cite>We&apos;re building the systems that make it possible.</cite>
          </blockquote>
          <div className="approach-lines">
            <p className="kicker reveal">Our approach</p>
            {approach.map(([lead, rest]) => (
              <p className="reveal" key={lead}><strong>{lead}</strong> {rest}</p>
            ))}
          </div>
        </section>

        <section className="contact" id="start">
          <div className="contact-copy reveal">
            <p className="pill">Accepting select projects for 2026</p>
            <h2>What&apos;s your<br />impossible?</h2>
            <p>Share the challenge you&apos;re solving. Our strategy team reviews every brief and responds within one business day.</p>
            <a href="mailto:hello@hashmi.si">hello@hashmi.si</a>
            <span>Karachi · Dubai · Global</span>
          </div>
          <div className="card reveal">
            {sent ? (
              <div className="success">
                <strong>Enquiry ready.</strong>
                <p>Your email app has been opened with the brief.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <label>
                  <span>Your name *</span>
                  <input name="name" required placeholder="Full name" autoComplete="name" />
                </label>
                <label>
                  <span>Work email *</span>
                  <input name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
                </label>
                <label>
                  <span>Company</span>
                  <input name="company" placeholder="Company name" autoComplete="organization" />
                </label>
                <label>
                  <span>Phone / WhatsApp</span>
                  <input name="phone" placeholder="+92 300 0000000" autoComplete="tel" />
                </label>
                <label>
                  <span>I&apos;m interested in *</span>
                  <select name="interest" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {interests.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  <span>Estimated budget</span>
                  <select name="budget" defaultValue="">
                    <option value="">Select a range</option>
                    {budgets.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="full">
                  <span>Tell us about the opportunity *</span>
                  <textarea name="brief" required rows={5} placeholder="The challenge, your goals, and where you need us..." />
                </label>
                <label className="check full">
                  <input name="agree" type="checkbox" required />
                  <span>By submitting, you agree to be contacted about your enquiry.</span>
                </label>
                <button className="btn btn-fill" type="submit">Send enquiry</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="colophon reveal" id="company">
        <div className="colophon-main">
          <div className="colophon-brand">
            <a className="brand" href="#top"><Mark /><span>Hashmi<em>.SI</em></span></a>
            <p className="colophon-tag">Superintelligence for human progress.</p>
            <p className="colophon-blurb">
              We build AI-native products and intelligence systems for ambitious companies—secure, production-ready, and designed to compound.
            </p>
            <a className="colophon-mail" href="mailto:hello@hashmi.si">hello@hashmi.si</a>
          </div>

          <div className="colophon-cols">
            <div className="colophon-col">
              <p className="colophon-label">Explore</p>
              <a href="#capabilities">Capabilities</a>
              <a href="#thinking">Point of view</a>
              <a href="#approach">Approach</a>
              <a href="#start">Start a project</a>
            </div>
            <div className="colophon-col">
              <p className="colophon-label">Capabilities</p>
              <a href="#cap-agentic">Agentic AI</a>
              <a href="#cap-enterprise">Enterprise intelligence</a>
              <a href="#cap-products">AI-native products</a>
              <a href="#layers">Digital layers</a>
            </div>
            <div className="colophon-col">
              <p className="colophon-label">Studios</p>
              <span>Karachi, Pakistan</span>
              <span>Dubai, UAE</span>
              <span>Remote · Global</span>
              <a href="mailto:hello@hashmi.si">Partnerships</a>
            </div>
          </div>
        </div>

        <div className="colophon-bar">
          <small>© 2026 Hashmi SI. All rights reserved.</small>
          <div className="colophon-legal">
            <span>Selective engagement</span>
            <span>Private by design</span>
            <span>Built for production</span>
          </div>
        </div>
      </footer>

      {phase !== "live" && (
        <div
          className={`gate${phase === "leaving" ? " is-leaving" : ""}${phase === "gate" ? " is-ready" : ""}`}
        >
          <div className="gate-shapes" aria-hidden="true">
            <span className="gate-shape gate-shape--a" />
            <span className="gate-shape gate-shape--b" />
            <span className="gate-shape gate-shape--c" />
          </div>

          <div className="gate-center">
            <p className="gate-logo" aria-label="Hashmi SI">
              <span className="gate-logo__hashmi">Hashmi</span>
              <span className="gate-logo__si">.SI</span>
            </p>

            <button ref={enterRef} type="button" className="enter" onClick={() => enter(true)}>
              Enter experience
            </button>
          </div>

          <button type="button" className="skip" onClick={() => enter(false)}>
            Continue without sound
          </button>

          <p className="note">
            Optional ambient audio. Enable sound for the full atmosphere.
          </p>
        </div>
      )}
    </div>
  );
}
