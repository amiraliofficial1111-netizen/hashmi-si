export default function LayerVisual({ index }: { index: string }) {
  const glowId = `layerGlow-${index}`;
  const glassId = `layerGlass-${index}`;
  const hotId = `layerHot-${index}`;
  return (
    <div className="layer-art" aria-hidden="true">
      <svg viewBox="0 0 160 140">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={glassId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a1830" />
            <stop offset="100%" stopColor="#10060e" />
          </linearGradient>
          <linearGradient id={hotId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="42%" stopColor="#ff4d8d" />
            <stop offset="100%" stopColor="#ff8ab8" />
          </linearGradient>
          <radialGradient id={`layerCore-${index}`} cx="40%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="34%" stopColor="#ffd0e4" />
            <stop offset="70%" stopColor="#ff2d78" />
            <stop offset="100%" stopColor="#5a1028" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="124" rx="46" ry="7" fill="#ff1464" opacity="0.32" />
        <g filter={`url(#${glowId})`}>{art(index, glassId, hotId)}</g>
      </svg>
    </div>
  );
}

function art(index: string, glassId: string, hotId: string) {
  if (index === "01") {
    return (
      <g className="li-float">
        <rect x="22" y="34" width="78" height="52" rx="8" fill={`url(#${glassId})`} stroke="#ff9ab8" strokeWidth="1.1" transform="rotate(-8 61 60)" />
        <path d="M36 50 H78 M36 60 H64" stroke="#ff4d8d" strokeWidth="2" strokeLinecap="round" opacity="0.7" transform="rotate(-8 61 60)" />
        <rect x="52" y="42" width="86" height="58" rx="10" fill="#120810" stroke="#ff4d8d" strokeWidth="1.3" />
        <path d="M66 58 H112 M66 70 H96 M66 82 H104" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <rect className="li-caret" x="108" y="78" width="7" height="2" rx="1" fill="#fff" />
        <line className="li-scan" x1="60" x2="128" y1="48" y2="48" />
      </g>
    );
  }
  if (index === "02") {
    return (
      <g>
        <g className="li-cube">
          <polygon points="80,18 112,34 80,50 48,34" fill={`url(#${hotId})`} />
          <polygon points="48,34 80,50 80,66 48,50" fill="#c43a6c" />
          <polygon points="112,34 80,50 80,66 112,50" fill="#ff6b9d" />
        </g>
        <g className="li-cube">
          <polygon points="80,48 118,66 80,84 42,66" fill="#ff7aaa" />
          <polygon points="42,66 80,84 80,102 42,84" fill="#8a2048" />
          <polygon points="118,66 80,84 80,102 118,84" fill="#ff2d78" />
          <circle className="li-core" cx="80" cy="66" r="4" fill="#fff" />
        </g>
        <g className="li-cube">
          <polygon points="80,78 108,92 80,106 52,92" fill="#2a1020" stroke="#ff8ab3" strokeWidth="0.8" />
          <polygon points="52,92 80,106 80,116 52,102" fill="#10060c" />
          <polygon points="108,92 80,106 80,116 108,102" fill="#3a1424" />
        </g>
      </g>
    );
  }
  if (index === "03") {
    return (
      <g className="li-float">
        <path className="li-cloud" d="M48 62c0-14 12-22 24-18 4-12 26-14 34-2 14-2 24 10 20 22H52c-8 2-16-4-4-2z" fill={`url(#${hotId})`} />
        <path className="li-rise" d="M78 78 V58 M70 66 L78 56 L86 66" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="54" y="86" width="52" height="8" rx="2" fill="#241018" stroke="#ff8ab3" />
        <rect x="48" y="98" width="64" height="8" rx="2" fill="#140810" stroke="#ff4d8d" />
        <rect className="li-core" x="42" y="110" width="76" height="8" rx="2" fill="#ff2d78" />
      </g>
    );
  }
  if (index === "04") {
    return (
      <g className="li-float">
        <rect className="li-bar" x="28" y="78" width="16" height="36" rx="3" fill="#ffb3d0" />
        <rect className="li-bar" x="52" y="62" width="16" height="52" rx="3" fill="#ff7aaa" />
        <rect className="li-bar" x="76" y="44" width="16" height="70" rx="3" fill="#ff4d8d" />
        <rect className="li-bar" x="100" y="26" width="16" height="88" rx="3" fill={`url(#${hotId})`} />
        <g className="li-rise">
          <path d="M34 58 C62 36 88 40 112 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 14 L118 12 L108 28" fill="#fff" />
        </g>
      </g>
    );
  }
  if (index === "05") {
    return (
      <g className="li-float">
        <path d="M38 36 H58 L70 86 H118" fill="none" stroke="#ffd0e4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="62" y="48" width="62" height="36" rx="8" fill={`url(#${hotId})`} />
        <path d="M74 60 H108 M74 70 H98" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <g className="li-wheel">
          <circle cx="78" cy="100" r="9" fill="#120810" stroke="#fff" strokeWidth="2" />
          <path d="M78 93 V107 M71 100 H85" stroke="#ff8ab8" strokeWidth="1.2" />
        </g>
        <g className="li-wheel">
          <circle cx="108" cy="100" r="9" fill="#120810" stroke="#fff" strokeWidth="2" />
          <path d="M108 93 V107 M101 100 H115" stroke="#ff8ab8" strokeWidth="1.2" />
        </g>
      </g>
    );
  }
  if (index === "06") {
    return (
      <g className="li-float">
        <ellipse className="li-orbit" cx="80" cy="62" rx="34" ry="16" fill="none" stroke="#ff8ab8" strokeWidth="1.2" />
        <ellipse className="li-orbit li-orbit-b" cx="80" cy="62" rx="22" ry="34" fill="none" stroke="#ff4d8d" strokeWidth="1.1" />
        <path d="M64 50 C64 30 96 30 96 50 C96 64 86 70 86 82 H74 C74 70 64 64 64 50 Z" fill="url(#layerCore-06)" stroke="#fff" strokeWidth="0.8" />
        <rect x="72" y="84" width="16" height="6" rx="1" fill="#ff4d8d" />
        <rect x="66" y="92" width="28" height="7" rx="2" fill="#fff" />
        <circle className="li-core" cx="80" cy="54" r="4" fill="#fff" />
      </g>
    );
  }
  if (index === "07") {
    return (
      <g className="li-float">
        <circle cx="80" cy="66" r="36" fill="#140810" stroke="#ff8ab8" strokeWidth="1.3" />
        <g className="li-globe">
          <ellipse cx="80" cy="66" rx="16" ry="36" fill="none" stroke="#ff4d8d" />
          <ellipse cx="80" cy="66" rx="36" ry="14" fill="none" stroke="#ffd0e4" />
          <path d="M44 66 H116 M52 48 H108 M52 84 H108" stroke="#ff4d8d" strokeWidth="1" opacity="0.75" />
        </g>
        <circle className="li-node" cx="108" cy="42" r="3.2" fill="#fff" />
        <circle className="li-node" cx="52" cy="86" r="2.6" fill="#7ee7ff" />
      </g>
    );
  }
  return (
    <g className="li-float">
      <path d="M80 18 L118 36 V70 C118 96 80 116 80 116 C80 116 42 96 42 70 V36 Z" fill={`url(#${glassId})`} stroke="#ff4d8d" strokeWidth="1.5" />
      <path className="li-scan" d="M50 40 H110" stroke="#fff" strokeWidth="1.4" opacity="0.8" />
      <circle cx="80" cy="66" r="18" fill="none" stroke="#ffd0e4" />
      <rect x="73" y="62" width="14" height="16" rx="2" fill="#ff2d78" />
      <path d="M70 62 V56 A10 10 0 0 1 90 56 V62" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="li-core" cx="80" cy="70" r="2.4" fill="#fff" />
    </g>
  );
}
