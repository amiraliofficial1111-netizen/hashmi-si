export default function SignalIcon({ index }: { index: string }) {
  const common = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
  if (index === "01") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="16" r="4" />
        <path d="M16 16h10M22 12v8" />
      </svg>
    );
  }
  if (index === "02") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="16" cy="16" r="8" />
        <path d="M16 10v6l4 2" />
      </svg>
    );
  }
  if (index === "03") {
    return (
      <svg {...common} aria-hidden="true">
        <ellipse cx="16" cy="11" rx="7" ry="3" />
        <path d="M9 11v8c0 1.7 3.1 3 7 3s7-1.3 7-3v-8" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <path d="M6 22l6-8 4 4 8-10" />
      <path d="M18 8h6v6" />
    </svg>
  );
}
