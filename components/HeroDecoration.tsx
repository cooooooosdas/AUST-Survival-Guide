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
          <rect x="60" y="60" width="200" height="240" rx="6" fill="var(--color-deco-envelope)" stroke="var(--color-deco-stroke)" strokeWidth="1.5" />
          {/* 信封盖 */}
          <path d="M60 60 L160 150 L260 60" fill="none" stroke="var(--color-deco-stroke)" strokeWidth="1.5" strokeLinejoin="round" />
          {/* 信封底部 V */}
          <path d="M60 300 L160 200 L260 300" fill="none" stroke="var(--color-deco-stroke-light)" strokeWidth="1.2" />
          {/* 文字线 */}
          <line x1="80" y1="190" x2="220" y2="190" stroke="var(--color-deco-stroke-light)" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="210" x2="200" y2="210" stroke="var(--color-deco-stroke-light)" strokeWidth="1" strokeLinecap="round" />
          <line x1="80" y1="230" x2="180" y2="230" stroke="var(--color-deco-stroke-light)" strokeWidth="1" strokeLinecap="round" />

          {/* 纸飞机 */}
          <g>
            <path d="M60 40 L130 20 L85 70 L75 55 L60 40 Z" fill="var(--color-deco-plane)" stroke="var(--color-deco-stroke)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M60 40 L85 70 L88 55 Z" fill="var(--color-deco-plane-accent)" />
            <line x1="60" y1="40" x2="20" y2="28" stroke="var(--color-deco-dash)" strokeWidth="1.2" strokeDasharray="3 4" strokeLinecap="round" />
          </g>

          {/* 邮戳 */}
          <circle cx="230" cy="80" r="24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.4" />
          <text x="230" y="84" textAnchor="middle" fontSize="9" fill="var(--color-accent)" opacity="0.5" fontFamily="serif">
            AUST · 2026
          </text>
        </svg>
      </div>
    </div>
  );
}
