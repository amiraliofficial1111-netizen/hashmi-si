export type AppId = "shopify" | "hubspot" | "zapier" | "analytics";
export type ChartKind = "bars" | "area" | "funnel";

export type AppStep = {
  operation: string;
  service: string;
  detail: string;
  result: string;
  activity: string;
  duration: number;
  bump?: Record<string, number>;
};

export type AppMetric = {
  key: string;
  label: string;
  format: "int" | "money" | "pct";
  derived?: boolean;
};

export type AppChart = {
  kind: ChartKind;
  title: string;
  points: { label: string; value: number }[];
  liveIndex: number;
  liveKey: string;
};

export type AppDef = {
  id: AppId;
  name: string;
  discipline: string;
  services: string[];
  base: Record<string, number>;
  metrics: AppMetric[];
  steps: AppStep[];
  chart: AppChart;
  derive?: (totals: Record<string, number>) => Record<string, number>;
};

export type AppFrame = {
  app: AppDef;
  step: AppStep;
  stepIndex: number;
  progress: number;
  totals: Record<string, number>;
  activity: { at: number; text: string; service: string }[];
  operations: { label: string; service: string; detail: string; result: string; state: "done" | "running" | "queued" }[];
};

const STEP = 3400;

export const ROTATE_MS = 7600;

export const APPS: AppDef[] = [
  {
    id: "shopify",
    name: "Shopify",
    discipline: "E-commerce Operations",
    services: ["Checkout", "Inventory", "Fulfillment", "Payments"],
    base: { orders: 126, revenue: 18440, unfulfilled: 7 },
    metrics: [
      { key: "orders", label: "Orders", format: "int" },
      { key: "revenue", label: "Revenue", format: "money" },
      { key: "unfulfilled", label: "Unfulfilled", format: "int" },
      { key: "fulfillment", label: "Fulfillment", format: "pct", derived: true },
    ],
    derive: (totals) => ({
      fulfillment: totals.orders <= 0 ? 0 : ((totals.orders - Math.max(0, totals.unfulfilled)) / totals.orders) * 100,
    }),
    chart: {
      kind: "bars",
      title: "Orders by hour",
      liveIndex: 7,
      liveKey: "orders",
      points: [
        { label: "09", value: 8 },
        { label: "10", value: 11 },
        { label: "11", value: 9 },
        { label: "12", value: 14 },
        { label: "13", value: 12 },
        { label: "14", value: 16 },
        { label: "15", value: 15 },
        { label: "16", value: 18 },
      ],
    },
    steps: [
      { operation: "Importing sandbox checkout HS-10482", service: "Checkout", detail: "A paid sandbox order for the Aurora Silk Scarf is being added to the store.", result: "+1 order · +$48", activity: "Order HS-10482 paid · Aurora Silk Scarf · $48", duration: STEP, bump: { orders: 1, revenue: 48, unfulfilled: 1 } },
      { operation: "Reserving stock for HS-10483", service: "Inventory", detail: "One Nimbus Desk Lamp is being held for order HS-10483 so it cannot sell twice.", result: "1 lamp held", activity: "Stock held · Nimbus Desk Lamp × 1 · HS-10483", duration: STEP },
      { operation: "Opening fulfillment for HS-10483", service: "Fulfillment", detail: "Order HS-10483 is being opened for fulfillment and marked to ship to Dubai.", result: "−1 unfulfilled", activity: "Fulfillment opened · HS-10483 · ship to Dubai", duration: STEP, bump: { unfulfilled: -1 } },
      { operation: "Recording sandbox payout batch", service: "Payments", detail: "Today’s payout batch is being written to the demo ledger. No real money moves.", result: "Demo ledger only", activity: "Payout written to the demo ledger", duration: STEP },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    discipline: "Customer & Lead Management",
    services: ["Contacts", "Email", "Deals", "Meetings"],
    base: { leads: 46, meetings: 8, pipeline: 128400, replies: 18 },
    metrics: [
      { key: "leads", label: "New leads", format: "int" },
      { key: "meetings", label: "Meetings", format: "int" },
      { key: "pipeline", label: "Pipeline", format: "money" },
      { key: "replyRate", label: "Reply rate", format: "pct", derived: true },
    ],
    derive: (totals) => ({
      replyRate: totals.leads <= 0 ? 0 : (totals.replies / totals.leads) * 100,
    }),
    chart: {
      kind: "funnel",
      title: "Pipeline stages",
      liveIndex: 0,
      liveKey: "leads",
      points: [
        { label: "New", value: 46 },
        { label: "Qualified", value: 28 },
        { label: "Proposal", value: 12 },
        { label: "Won", value: 5 },
      ],
    },
    steps: [
      { operation: "Scoring sandbox lead · Amina F.", service: "Contacts", detail: "Sandbox contact Amina F. is being scored and added as a new lead.", result: "+1 lead", activity: "Lead scored · Amina F. · added to new leads", duration: STEP, bump: { leads: 1 } },
      { operation: "Enrolling intro sequence", service: "Email", detail: "Amina F. is being enrolled in the sandbox intro email series.", result: "Sequence on", activity: "Amina F. enrolled in the intro email series", duration: STEP },
      { operation: "Moving Northwind Demo to Proposal", service: "Deals", detail: "Deal Northwind Demo is moving into the Proposal stage.", result: "+$8,400 pipeline", activity: "Northwind Demo moved to Proposal · +$8,400", duration: STEP, bump: { pipeline: 8400 } },
      { operation: "Booking product walkthrough", service: "Meetings", detail: "A product walkthrough is being booked, and one reply is counted.", result: "+1 meeting", activity: "Walkthrough booked · 1 reply counted", duration: STEP, bump: { meetings: 1, replies: 1 } },
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    discipline: "Workflow Automation",
    services: ["Shopify", "HubSpot", "Sheets", "Filters"],
    base: { runs: 842, successes: 834, tasks: 1264, zaps: 14 },
    metrics: [
      { key: "runs", label: "Runs today", format: "int" },
      { key: "successRate", label: "Success", format: "pct", derived: true },
      { key: "tasks", label: "Tasks", format: "int" },
      { key: "zaps", label: "Zaps on", format: "int" },
    ],
    derive: (totals) => ({
      successRate: totals.runs <= 0 ? 0 : (totals.successes / totals.runs) * 100,
    }),
    chart: {
      kind: "bars",
      title: "Runs by hour",
      liveIndex: 7,
      liveKey: "runs",
      points: [
        { label: "09", value: 64 },
        { label: "10", value: 88 },
        { label: "11", value: 72 },
        { label: "12", value: 96 },
        { label: "13", value: 81 },
        { label: "14", value: 110 },
        { label: "15", value: 104 },
        { label: "16", value: 120 },
      ],
    },
    steps: [
      { operation: "Running order-to-CRM zap", service: "Shopify", detail: "A sandbox Shopify order is being written into the CRM. Two tasks run.", result: "+1 run · 2 tasks", activity: "Order-to-CRM zap finished · order written to CRM", duration: STEP, bump: { runs: 1, successes: 1, tasks: 2 } },
      { operation: "Posting deal-stage alert", service: "HubSpot", detail: "A deal-stage change is being sent out as an alert.", result: "+1 run", activity: "Deal-stage alert sent", duration: STEP, bump: { runs: 1, successes: 1, tasks: 1 } },
      { operation: "Appending paid order to sheet", service: "Sheets", detail: "The paid order is being added as a new row on the sandbox sheet.", result: "+1 row", activity: "Paid order appended as a new sheet row", duration: STEP, bump: { runs: 1, successes: 1, tasks: 1 } },
      { operation: "Holding a filtered task for review", service: "Filters", detail: "This task matched a filter, so it is held for review instead of running.", result: "Held for review", activity: "Filter held a task for review · zap skipped", duration: STEP, bump: { runs: 1, tasks: 1 } },
    ],
  },
  {
    id: "analytics",
    name: "Google Analytics",
    discipline: "Business Intelligence",
    services: ["Web stream", "Ecommerce", "Realtime", "Acquisition"],
    base: { users: 2480, sessions: 3124, engaged: 1936, conversions: 86 },
    metrics: [
      { key: "users", label: "Users", format: "int" },
      { key: "sessions", label: "Sessions", format: "int" },
      { key: "engagement", label: "Engagement", format: "pct", derived: true },
      { key: "conversions", label: "Conversions", format: "int" },
    ],
    derive: (totals) => ({
      engagement: totals.sessions <= 0 ? 0 : (totals.engaged / totals.sessions) * 100,
    }),
    chart: {
      kind: "area",
      title: "Sessions by hour",
      liveIndex: 7,
      liveKey: "sessions",
      points: [
        { label: "09", value: 180 },
        { label: "10", value: 240 },
        { label: "11", value: 210 },
        { label: "12", value: 320 },
        { label: "13", value: 280 },
        { label: "14", value: 360 },
        { label: "15", value: 340 },
        { label: "16", value: 410 },
      ],
    },
    steps: [
      { operation: "Collecting page_view · /pricing", service: "Web stream", detail: "A visit to /pricing is being recorded as a session, a user, and an engaged view.", result: "+1 session", activity: "page_view on /pricing · 1 session, 1 user", duration: STEP, bump: { sessions: 1, users: 1, engaged: 1 } },
      { operation: "Recording purchase · HS-10482", service: "Ecommerce", detail: "Purchase HS-10482 for $48 is being recorded as a conversion.", result: "+1 conversion · $48", activity: "Purchase HS-10482 recorded · $48 conversion", duration: STEP, bump: { conversions: 1, sessions: 1, engaged: 1 } },
      { operation: "Refreshing realtime users", service: "Realtime", detail: "The realtime user report is refreshing for the sandbox property.", result: "Report refreshed", activity: "Realtime users refreshed on the sandbox property", duration: STEP },
      { operation: "Updating organic search channel", service: "Acquisition", detail: "An organic search visit is being added to the channel report.", result: "+1 organic session", activity: "Organic search session added to the channel report", duration: STEP, bump: { sessions: 1, users: 1 } },
    ],
  },
];

export function projectApp(app: AppDef, workMs: number, now: number): AppFrame {
  const cycle = app.steps.reduce((sum, step) => sum + step.duration, 0);
  const safeWork = Math.max(0, workMs);
  const loops = Math.floor(safeWork / cycle);
  let remain = safeWork - loops * cycle;
  let stepIndex = 0;
  let into = 0;

  for (let index = 0; index < app.steps.length; index += 1) {
    const duration = app.steps[index].duration;
    if (remain < duration) {
      stepIndex = index;
      into = remain;
      break;
    }
    remain -= duration;
  }

  const step = app.steps[stepIndex];
  const completed = loops * app.steps.length + stepIndex;
  const totals: Record<string, number> = { ...app.base };

  for (let index = 0; index < completed; index += 1) {
    const bump = app.steps[index % app.steps.length].bump;
    if (!bump) continue;
    for (const [key, amount] of Object.entries(bump)) totals[key] = (totals[key] ?? 0) + amount;
  }

  if (totals.unfulfilled != null) totals.unfulfilled = Math.max(0, totals.unfulfilled);
  if (app.derive) Object.assign(totals, app.derive(totals));

  const activity: AppFrame["activity"] = [
    { at: now - safeWork, text: "Sandbox session started · demo data only", service: "Demo" },
  ];

  for (let offset = 0; offset < 6; offset += 1) {
    const nth = completed - 1 - offset;
    if (nth < 0) break;
    const occurrence = Math.floor(nth / app.steps.length);
    const index = nth % app.steps.length;
    let end = occurrence * cycle;
    for (let cursor = 0; cursor <= index; cursor += 1) end += app.steps[cursor].duration;
    activity.push({
      at: now - (safeWork - end),
      text: app.steps[index].activity,
      service: app.steps[index].service,
    });
  }

  activity.sort((a, b) => b.at - a.at);

  return {
    app,
    step,
    stepIndex,
    progress: step.duration === 0 ? 0 : into / step.duration,
    totals,
    activity,
    operations: app.steps.map((item, index) => ({
      label: item.operation,
      service: item.service,
      detail: item.detail,
      result: item.result,
      state: index < stepIndex ? "done" : index === stepIndex ? "running" : "queued",
    })),
  };
}

export function formatMetric(format: AppMetric["format"], value: number) {
  if (format === "money") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }
  if (format === "pct") return `${value.toFixed(1)}%`;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function formatClock(at: number) {
  return new Date(at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
