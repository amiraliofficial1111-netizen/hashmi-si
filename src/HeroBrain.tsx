import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./styles/brain.css";

type Side = "left" | "right";

type Fact = { label: string; value: string };

type Task = {
  line: string;
  facts: [Fact, Fact, Fact];
};

type BrainNode = {
  id: string;
  name: string;
  tasks: [Task, Task, Task];
  x: number;
  y: number;
  side: Side;
  color: string;
  points: [number, number][];
};

const W = 1200;
const H = 740;
const TYPE_MS = 28;

const LABELS: Record<string, string> = {
  shopify: "Shopify",
  hubspot: "HubSpot",
  stripe: "Stripe",
  slack: "Slack",
  analytics: "Analytics",
  salesforce: "Salesforce",
  zendesk: "Zendesk",
  zapier: "Zapier",
};

const NODES: BrainNode[] = [
  {
    id: "shopify",
    name: "Shopify Admin",
    tasks: [
      { line: "Recording sandbox payout batch", facts: [{ label: "Batch", value: "PB-204" }, { label: "Amount", value: "$1,840" }, { label: "Orders", value: "12 paid" }] },
      { line: "Reserving stock for the paid order", facts: [{ label: "Order", value: "HS-10482" }, { label: "SKU", value: "Tee-04" }, { label: "Stock", value: "2 reserved" }] },
      { line: "Opening fulfillment for the new order", facts: [{ label: "Order", value: "HS-10482" }, { label: "Carrier", value: "DHL" }, { label: "Warehouse", value: "Karachi" }] },
    ],
    x: 312,
    y: 78,
    side: "left",
    color: "#95bf47",
    points: [
      [548, 168],
      [548, 78],
      [312, 78],
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    tasks: [
      { line: "Scoring sandbox lead Amina F.", facts: [{ label: "Lead", value: "Amina F." }, { label: "Score", value: "86" }, { label: "Source", value: "Demo form" }] },
      { line: "Moving the demo deal to proposal", facts: [{ label: "Deal", value: "Northwind" }, { label: "Amount", value: "$18,400" }, { label: "Stage", value: "Proposal" }] },
      { line: "Booking the product walkthrough", facts: [{ label: "When", value: "Tue 11:30" }, { label: "Contact", value: "Amina F." }, { label: "Status", value: "Booked" }] },
    ],
    x: 248,
    y: 214,
    side: "left",
    color: "#ff7a59",
    points: [
      [470, 248],
      [330, 248],
      [330, 214],
      [248, 214],
    ],
  },
  {
    id: "stripe",
    name: "Stripe Dashboard",
    tasks: [
      { line: "Capturing the sandbox payment", facts: [{ label: "Payment", value: "pi_10482" }, { label: "Amount", value: "$240.00" }, { label: "Card", value: "••42" }] },
      { line: "Queueing today's payout batch", facts: [{ label: "Payout", value: "po_18" }, { label: "Amount", value: "$1,840" }, { label: "Arrival", value: "Tomorrow" }] },
      { line: "Sending the paid invoice", facts: [{ label: "Invoice", value: "INV-204" }, { label: "Customer", value: "Northwind" }, { label: "Status", value: "Sent" }] },
    ],
    x: 248,
    y: 392,
    side: "left",
    color: "#635bff",
    points: [
      [470, 360],
      [340, 360],
      [340, 392],
      [248, 392],
    ],
  },
  {
    id: "slack",
    name: "Slack",
    tasks: [
      { line: "Posting the deal-stage alert", facts: [{ label: "Channel", value: "#ops-alerts" }, { label: "Topic", value: "Deal stage" }, { label: "Status", value: "Posted" }] },
      { line: "Updating the ops channel", facts: [{ label: "Channel", value: "#ops-alerts" }, { label: "New", value: "3 messages" }, { label: "Members", value: "12" }] },
      { line: "Sending the hourly digest", facts: [{ label: "Channel", value: "#daily" }, { label: "Events", value: "8" }, { label: "Status", value: "Sent" }] },
    ],
    x: 312,
    y: 548,
    side: "left",
    color: "#e01e5a",
    points: [
      [530, 430],
      [530, 490],
      [390, 490],
      [390, 548],
      [312, 548],
    ],
  },
  {
    id: "analytics",
    name: "Google Analytics 4",
    tasks: [
      { line: "Recording purchase HS-10482", facts: [{ label: "Purchase", value: "HS-10482" }, { label: "Revenue", value: "$240" }, { label: "Source", value: "Direct" }] },
      { line: "Logging the pricing page session", facts: [{ label: "Page", value: "/pricing" }, { label: "Time", value: "4m 12s" }, { label: "City", value: "Karachi" }] },
      { line: "Refreshing realtime users", facts: [{ label: "Users", value: "128" }, { label: "Active", value: "36" }, { label: "Window", value: "30 min" }] },
    ],
    x: 888,
    y: 78,
    side: "right",
    color: "#f9ab00",
    points: [
      [652, 168],
      [652, 78],
      [888, 78],
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    tasks: [
      { line: "Moving the opportunity to proposal", facts: [{ label: "Opportunity", value: "Northwind" }, { label: "Amount", value: "$18,400" }, { label: "Stage", value: "Proposal" }] },
      { line: "Syncing the sandbox account", facts: [{ label: "Account", value: "Northwind" }, { label: "Contacts", value: "6" }, { label: "Sync", value: "Just now" }] },
      { line: "Setting the follow-up task", facts: [{ label: "Task", value: "Follow up" }, { label: "Due", value: "Tomorrow" }, { label: "Owner", value: "Ayesha" }] },
    ],
    x: 952,
    y: 228,
    side: "right",
    color: "#00a1e0",
    points: [
      [730, 268],
      [860, 268],
      [860, 228],
      [952, 228],
    ],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    tasks: [
      { line: "Opening the new support ticket", facts: [{ label: "Ticket", value: "#4821" }, { label: "Priority", value: "High" }, { label: "Requester", value: "Amina F." }] },
      { line: "Sending the drafted reply", facts: [{ label: "Ticket", value: "#4821" }, { label: "Agent", value: "Sara" }, { label: "Status", value: "Sent" }] },
      { line: "Clearing the waiting queue", facts: [{ label: "Waiting", value: "0" }, { label: "Solved", value: "14" }, { label: "Status", value: "Cleared" }] },
    ],
    x: 952,
    y: 400,
    side: "right",
    color: "#30e3c2",
    points: [
      [735, 352],
      [860, 352],
      [860, 400],
      [952, 400],
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    tasks: [
      { line: "Running the order-to-CRM zap", facts: [{ label: "Zap", value: "Order to CRM" }, { label: "Step", value: "2 of 4" }, { label: "Status", value: "Running" }] },
      { line: "Appending the paid order row", facts: [{ label: "Sheet", value: "Paid orders" }, { label: "Row", value: "HS-10482" }, { label: "Status", value: "Appended" }] },
      { line: "Passing the filtered task", facts: [{ label: "Filter", value: "Amount > $50" }, { label: "Next", value: "Slack" }, { label: "Status", value: "Passed" }] },
    ],
    x: 888,
    y: 548,
    side: "right",
    color: "#ff4f00",
    points: [
      [670, 430],
      [670, 490],
      [810, 490],
      [810, 548],
      [888, 548],
    ],
  },
];

function line(points: [number, number][]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
}

export default function HeroBrain() {
  const [cursor, setCursor] = useState({ active: 0, task: 0, count: 0 });
  const [hold, setHold] = useState<number | null>(null);
  const [reduce, setReduce] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const holdRef = useRef<number | null>(null);
  const cursorRef = useRef(cursor);
  holdRef.current = hold;
  cursorRef.current = cursor;

  useEffect(() => {
    setSlot(document.getElementById("hero-card-slot"));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!reduce) return;
    const id = window.setInterval(() => {
      setCursor((current) => {
        const held = holdRef.current;
        const active = held ?? (current.active + 1) % NODES.length;
        const task = held != null && held === current.active ? (current.task + 1) % 3 : 0;
        const next = { active, task, count: 999 };
        cursorRef.current = next;
        return next;
      });
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    let wait = 0;
    const id = window.setInterval(() => {
      const current = cursorRef.current;
      const index = holdRef.current ?? current.active;
      if (index !== current.active) {
        const next = { active: index, task: 0, count: 1 };
        cursorRef.current = next;
        setCursor(next);
        wait = 0;
        return;
      }
      const text = NODES[index].tasks[current.task]?.line ?? "";
      if (current.count < text.length) {
        const next = { ...current, count: current.count + 1 };
        cursorRef.current = next;
        setCursor(next);
        return;
      }
      wait += TYPE_MS;
      if (wait < 1400) return;
      wait = 0;
      let task = current.task + 1;
      let active = current.active;
      if (task > 2) {
        task = 0;
        if (holdRef.current == null) active = (active + 1) % NODES.length;
      }
      const next = { active, task, count: 0 };
      cursorRef.current = next;
      setCursor(next);
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const active = cursor.active;
  const node = NODES[active];
  const job = node.tasks[cursor.task];
  const full = job?.line ?? "";
  const facts = job?.facts ?? [];
  const typed = reduce ? full : full.slice(0, cursor.count);
  const percent = full.length === 0 ? 0 : Math.round((typed.length / full.length) * 100);

  return (
    <div className={`hero-brain${reduce ? " is-still" : ""}`} role="region" aria-label="Live apps running through the AI brain">
      <div className="hero-brain__stage">
      <svg className="hero-brain__wires" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <filter id="hb-wire" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {NODES.map((item, itemIndex) => {
          const live = itemIndex === active;
          const d = line(item.points);
          return (
            <g key={item.id} filter="url(#hb-wire)">
              <path d={d} fill="none" stroke={item.color} strokeWidth={live ? 2.4 : 1.6} strokeLinejoin="round" strokeLinecap="round" opacity={live ? 0.95 : 0.72} />
              {!reduce ? (
                <path className="hero-brain__flow" d={d} fill="none" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" opacity={live ? 0.95 : 0.45} style={{ animationDelay: `${itemIndex * -0.35}s` }} />
              ) : null}
              {item.points.slice(1, -1).map(([x, y]) => (
                <circle key={`${item.id}-${x}-${y}`} cx={x} cy={y} r={live ? 3 : 2.2} fill={item.color} />
              ))}
              <path id={`hb-${item.id}`} d={d} fill="none" />
              {!reduce ? (
                <circle r={live ? 3.4 : 2.2} fill={live ? "#fff" : item.color} opacity={live ? 1 : 0.9}>
                  <animateMotion dur={`${3.1 + (itemIndex % 4) * 0.45}s`} repeatCount="indefinite" calcMode="linear">
                    <mpath href={`#hb-${item.id}`} />
                  </animateMotion>
                </circle>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="hero-brain__core" aria-hidden="true">
        <span className="hero-brain__halo" />
        <img className="hero-brain__art" src="/images/hero-brain-glow.webp" alt="" />
        <p className="hero-brain__chip hero-brain__chip--net">Neural Networks</p>
        <p className="hero-brain__chip hero-brain__chip--deep">Deep Learning<br />Modules</p>
      </div>

      {NODES.map((item, itemIndex) => {
        const live = itemIndex === active;
        return (
          <button
            key={item.id}
            type="button"
            className={`hero-brain__node is-${item.side}${live ? " is-live" : ""}`}
            style={{
              left: `${(item.x / W) * 100}%`,
              top: `${(item.y / H) * 100}%`,
              ["--node" as string]: item.color,
            }}
            aria-pressed={live}
            aria-label={item.name}
            onMouseEnter={() => setHold(itemIndex)}
            onMouseLeave={() => setHold(null)}
            onFocus={() => setHold(itemIndex)}
            onBlur={() => setHold(null)}
          >
            <span className="hero-brain__orb">
              <NodeIcon id={item.id} />
            </span>
            <span className="hero-brain__label" aria-hidden="true">{LABELS[item.id]}</span>
          </button>
        );
      })}
      </div>

      {slot
        ? createPortal(
            <div className="hero-brain__card" style={{ ["--node" as string]: node.color }} aria-hidden="true">
              <div className="hero-brain__status">
                <span className="hero-brain__mark"><NodeIcon id={node.id} /></span>
                <i className="hero-brain__work">Working - {percent}%</i>
              </div>
              <strong>{node.name}</strong>
              <em>
                {typed}
                {!reduce && typed.length < full.length ? <b className="hero-brain__caret" /> : null}
              </em>
              <ul className="hero-brain__facts">
                {facts.map((fact, index) => (
                  <li key={fact.label} className={percent >= [18, 48, 78][index] ? "is-in" : undefined}>
                    <span>{fact.label}</span>
                    <b>{fact.value}</b>
                  </li>
                ))}
              </ul>
              <i className="hero-brain__bar"><i style={{ width: `${percent}%` }} /></i>
            </div>,
            slot,
          )
        : null}

      <p className="hero-brain__sr" aria-live="polite">
        {node.name}. {full}. {facts.map((fact) => `${fact.label} ${fact.value}`).join(". ")}
      </p>
    </div>
  );
}

function NodeIcon({ id }: { id: string }) {
  if (id === "shopify") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M8.2 13.4h15.6l-1.4 13a1.8 1.8 0 0 1-1.8 1.6h-9.2a1.8 1.8 0 0 1-1.8-1.6l-1.4-13z" />
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" d="M12.2 13.4V11a2.2 2.2 0 0 1 4.4 0v2.4M17.2 13.4V11a2.2 2.2 0 0 1 4.4 0v2.4" />
      </svg>
    );
  }
  if (id === "hubspot") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="3.15" fill="currentColor" />
        <circle cx="16" cy="5.7" r="2.35" fill="currentColor" />
        <circle cx="24.9" cy="21.15" r="2.35" fill="currentColor" />
        <circle cx="7.1" cy="21.15" r="2.35" fill="currentColor" />
        <path d="M16 8.1v4.6M18.7 17.7l3.8 2.2M13.3 17.7 9.5 19.9" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "stripe") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M14.6 13.1c0-1 .8-1.5 2.1-1.5 1.8 0 4.1.6 5.9 1.6V9.2c-2-.8-3.9-1.2-5.9-1.2-4.8 0-8 2.5-8 6.6 0 6.4 8.8 5.4 8.8 8.2 0 1.1-1 1.5-2.3 1.5-2 0-4.5-.8-6.5-2v4.1c2.2 1 4.5 1.4 6.5 1.4 4.9 0 8.3-2.4 8.3-6.6 0-6.9-8.9-5.7-8.9-8.1z" />
      </svg>
    );
  }
  if (id === "slack") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M13.6 5.4H10a2.3 2.3 0 0 0 0 4.6h3.6V5.4zM13.6 10h2.3v2.3h-2.3A2.3 2.3 0 0 1 13.6 10z" />
        <path fill="currentColor" d="M26.6 13.6V10a2.3 2.3 0 0 0-4.6 0v3.6h4.6zM22 13.6v2.3h-2.3v-2.3A2.3 2.3 0 0 1 22 13.6z" />
        <path fill="currentColor" d="M18.4 26.6H22a2.3 2.3 0 0 0 0-4.6h-3.6v4.6zM18.4 22h-2.3v-2.3h2.3a2.3 2.3 0 0 1 0 2.3z" />
        <path fill="currentColor" d="M5.4 18.4V22a2.3 2.3 0 0 0 4.6 0v-3.6H5.4zM10 18.4v-2.3h2.3V18.4A2.3 2.3 0 0 1 10 18.4z" />
      </svg>
    );
  }
  if (id === "analytics") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5.2 25.2h21.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
        <rect x="6" y="16.2" width="3.8" height="9" rx="1.15" fill="currentColor" />
        <rect x="11.5" y="11.4" width="3.8" height="13.8" rx="1.15" fill="currentColor" />
        <rect x="17" y="13.8" width="3.8" height="11.4" rx="1.15" fill="currentColor" />
        <rect x="22.5" y="7.2" width="3.8" height="18" rx="1.15" fill="currentColor" />
      </svg>
    );
  }
  if (id === "salesforce") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M12.4 23.4h8.8a4.15 4.15 0 0 0 .55-8.25 5.35 5.35 0 0 0-10.15-1.35A3.7 3.7 0 0 0 12.4 23.4z" />
      </svg>
    );
  }
  if (id === "zendesk") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M7.8 17.4v-.8a8.2 8.2 0 0 1 16.4 0v.8" />
        <rect x="4.8" y="16" width="5" height="8" rx="1.8" fill="currentColor" />
        <rect x="22.2" y="16" width="5" height="8" rx="1.8" fill="currentColor" />
        <path fill="currentColor" d="M22.6 23.2h2.2a2.4 2.4 0 0 1-2.4 2.2h-.6a1 1 0 0 1-.8-1.6l1.6-.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d="M18.4 3.8 10.6 15.6h5.1L13.2 28.2l9.6-14.2h-5.2l.8-10.2z" />
    </svg>
  );
}
