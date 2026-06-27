/**
 * 信件区右侧装饰：简洁信封 + 纸飞机线稿
 */

export default function HeroDecoration() {
  return (
    <div className="pointer-events-none relative hidden md:flex h-full w-full items-center justify-center">
      <div className="relative w-[260px]">
        <svg
          viewBox="0 0 320 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          aria-hidden="true"
        >
          {/* 信封 */}
          <rect x="60" y="60" width="200" height="240" rx="6" fill="#FFFFFF" stroke="#1C1917" strokeWidth="1.5" />
          {/* 信封盖 */}
          <path d="M60 60 L160 150 L260 60" fill="none" stroke="#1C1917" strokeWidth="1.5" strokeLinejoin="round" />
          {/* 信封底部 V */}
          <path d="M60 300 L160 200 L260 300" fill="none" stroke="#E7E5E4" strokeWidth="1.2" />
          {/* 文字线 */}
          <line x1="80" y1="190" x2="220" y2="190" stroke="#E7E5E4" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="210" x2="200" y2="210" stroke="#E7E5E4" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="230" x2="180" y2="230" stroke="#E7E5E4" strokeWidth="1" strokeLinecap="round" />

          {/* 纸飞机 */}
          <g>
            <path d="M60 40 L130 20 L85 70 L75 55 L60 40 Z" fill="#FEF3C7" stroke="#1C1917" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M60 40 L85 70 L88 55 Z" fill="#FDE68A" />
            <line x1="60" y1="40" x2="20" y2="28" stroke="#D6D3D1" strokeWidth="1.2" strokeDasharray="3 4" strokeLinecap="round" />
          </g>

          {/* 邮戳 */}
          <circle cx="230" cy="80" r="24" fill="none" stroke="#B45309" strokeWidth="1.2" opacity="0.4" />
          <text x="230" y="84" textAnchor="middle" fontSize="9" fill="#B45309" opacity="0.5" fontFamily="serif">
            AUST · 2026
          </text>
        </svg>
      </div>
    </div>
  );
}
