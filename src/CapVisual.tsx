export default function CapVisual({ index }: { index: string }) {
  if (index === "01") {
    return (
      <div className="cap-visual" aria-hidden="true">
        <svg viewBox="0 0 280 168">
          <defs>
            <radialGradient id="agentCore" cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="16%" stopColor="#ffe4f0" />
              <stop offset="48%" stopColor="#ff2d78" />
              <stop offset="100%" stopColor="#2a0614" />
            </radialGradient>
            <radialGradient id="agentBloom" cx="50%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#ff2d78" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff2d78" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ribbonPink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7adfff" stopOpacity="0.05" />
              <stop offset="34%" stopColor="#ff4d8d" />
              <stop offset="66%" stopColor="#fff" />
              <stop offset="100%" stopColor="#ff2d78" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="ribbonCyan" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8ab8" stopOpacity="0.08" />
              <stop offset="46%" stopColor="#5ad7ff" />
              <stop offset="100%" stopColor="#ff2d78" stopOpacity="0.1" />
            </linearGradient>
            <filter id="agentGlow" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse cx="140" cy="148" rx="64" ry="7" fill="#ff1464" opacity="0.32" />
          <circle cx="140" cy="78" r="60" fill="url(#agentBloom)" />
          <g className="cap-swirl" filter="url(#agentGlow)">
            <path d="M72 102 C 96 28, 204 30, 214 90 C 220 122, 164 134, 126 106" fill="none" stroke="url(#ribbonPink)" strokeWidth="14" strokeLinecap="round" />
            <path d="M204 48 C 222 102, 150 142, 86 114 C 54 98, 70 52, 122 42" fill="none" stroke="url(#ribbonCyan)" strokeWidth="11" strokeLinecap="round" />
            <path d="M100 50 C 148 78, 180 38, 198 76 C 212 104, 142 126, 104 98" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
          </g>
          <g className="cap-net">
            <path d="M86 66 L140 80 L196 58 M112 112 L140 80 L178 108" />
            <circle cx="86" cy="66" r="3" />
            <circle className="cap-cyan" cx="196" cy="58" r="2.6" />
            <circle cx="112" cy="112" r="2.2" />
            <circle className="cap-cyan" cx="178" cy="108" r="2.2" />
          </g>
          <circle className="cap-core" cx="140" cy="80" r="14" fill="url(#agentCore)" />
        </svg>
      </div>
    );
  }
  if (index === "02") {
    return (
      <div className="cap-visual" aria-hidden="true">
        <svg viewBox="0 0 280 168">
          <defs>
            <linearGradient id="cubeHot" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="40%" stopColor="#ff4d8d" />
              <stop offset="100%" stopColor="#ff8ab3" />
            </linearGradient>
            <linearGradient id="cubeGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd0e4" />
              <stop offset="100%" stopColor="#ff4d8d" />
            </linearGradient>
            <filter id="stackGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse cx="140" cy="150" rx="72" ry="8" fill="#ff1464" opacity="0.28" />
          <g className="cap-stack" filter="url(#stackGlow)">
            <polygon points="140,108 198,128 140,148 82,128" fill="#120810" stroke="#ff8ab3" strokeWidth="0.8" />
            <polygon points="82,128 140,148 140,162 82,142" fill="#08040a" />
            <polygon points="198,128 140,148 140,162 198,142" fill="#241018" />
            <polygon points="140,70 184,86 140,102 96,86" fill="url(#cubeHot)" />
            <polygon points="96,86 140,102 140,118 96,102" fill="#9a1848" />
            <polygon points="184,86 140,102 140,118 184,102" fill="#ff4d8d" />
            <polygon points="148,78 172,88 148,96 124,86" fill="#fff" opacity="0.55" />
            <polygon points="140,36 172,48 140,60 108,48" fill="url(#cubeGlass)" />
            <polygon points="108,48 140,60 140,72 108,60" fill="#c43a6c" />
            <polygon points="172,48 140,60 140,72 172,60" fill="#ff9ab8" />
            <circle className="cap-core" cx="140" cy="86" r="5" fill="#fff" />
          </g>
          <g className="cap-meters">
            <rect x="214" y="78" width="4" height="28" rx="1" />
            <rect x="222" y="68" width="4" height="38" rx="1" />
            <rect x="230" y="88" width="4" height="18" rx="1" />
          </g>
          <line className="cap-scan" x1="96" x2="184" y1="34" y2="34" />
        </svg>
      </div>
    );
  }
  return (
    <div className="cap-visual" aria-hidden="true">
      <svg viewBox="0 0 280 168">
        <defs>
          <linearGradient id="glassLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a1830" />
            <stop offset="100%" stopColor="#10060e" />
          </linearGradient>
          <linearGradient id="glassFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#24121e" />
            <stop offset="100%" stopColor="#070308" />
          </linearGradient>
          <radialGradient id="productCore" cx="40%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="26%" stopColor="#ffd0e4" />
            <stop offset="64%" stopColor="#ff2d78" />
            <stop offset="100%" stopColor="#5a1028" />
          </radialGradient>
          <filter id="productGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="150" cy="150" rx="76" ry="8" fill="#ff1464" opacity="0.26" />
        <g className="cap-screens">
          <polygon points="28,66 104,48 114,116 38,132" fill="url(#glassLeft)" stroke="#ff9ab8" strokeWidth="1" />
          <path d="M48 84 H78 M50 94 H86 M52 104 H70" stroke="#ff4d8d" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <polygon points="186,40 262,56 250,124 174,108" fill="#120810" stroke="#ff8ab3" strokeWidth="1" />
          <path d="M198 70 H236 M196 82 H228 M200 94 H240" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
          <polygon className="cap-screen-front" points="88,46 188,34 204,118 104,130" fill="url(#glassFront)" stroke="#ff4d8d" strokeWidth="1.2" />
          <path d="M118 64 H168 M118 74 H148" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <polyline points="118,104 132,92 146,98 160,82 176,88" fill="none" stroke="#ff8ab8" strokeWidth="1.6" />
          <circle cx="132" cy="92" r="1.8" fill="#fff" />
          <circle cx="160" cy="82" r="1.8" fill="#7ee7ff" />
          <circle cx="164" cy="90" r="24" fill="#ff2d78" opacity="0.22" filter="url(#productGlow)" />
          <circle className="cap-core" cx="164" cy="90" r="12" fill="url(#productCore)" />
        </g>
        <line className="cap-scan cap-scan-screen" x1="100" x2="192" y1="42" y2="42" />
      </svg>
    </div>
  );
}
