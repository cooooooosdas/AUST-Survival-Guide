/**
 * 信件区右侧装饰：信封 + 纸飞机 + 三色圆点标记
 * 带 letter-float 浮动动画
 */

const DOT_COLORS = ["var(--color-primary)", "var(--color-secondary)", "var(--color-tertiary)"];

export default function HeroDecoration() {
  return (
    <div
      className="pointer-events-none relative hidden md:flex h-full w-full items-center justify-center"
      style={{ animation: "letter-float 8s ease-in-out infinite" }}
    >
      <div className="relative w-[260px]">
        {/* 柔和辉光 */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(123,140,222,0.25) 0%, rgba(255,158,181,0.15) 40%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        <svg
          viewBox="0 0 320 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full relative z-10"
          aria-hidden="true"
        >
          {/* 信封 */}
          <rect x="60" y="60" width="200" height="240" rx="8"
            fill="var(--color-surface)"
            stroke="var(--color-deco-stroke-light)"
            strokeWidth="1.2"
          />
          {/* 信封盖 */}
          <path d="M60 60 L160 150 L260 60" fill="none" stroke="var(--color-deco-stroke)" strokeWidth="1.5" strokeLinejoin="round" />
          {/* 信封底部 V */}
          <path d="M60 300 L160 200 L260 300" fill="none" stroke="var(--color-deco-stroke-light)" strokeWidth="1" />
          {/* 文字线 */}
          <line x1="80" y1="190" x2="220" y2="190" stroke="var(--color-deco-stroke-light)" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="80" y1="210" x2="200" y2="210" stroke="var(--color-deco-stroke-light)" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="80" y1="230" x2="180" y2="230" stroke="var(--color-deco-stroke-light)" strokeWidth="0.8" strokeLinecap="round" />

          {/* 邮戳（三色圆点） */}
          <circle cx="230" cy="80" r="22" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
          {DOT_COLORS.map((c, i) => (
            <circle key={i} cx={218 + i * 12} cy={80} r="2.5" fill={c} opacity="0.7" />
          ))}
          <text x="230" y="96" textAnchor="middle" fontSize="7.5" fill="var(--color-text-muted)" fontFamily="var(--font-geist-mono), monospace" opacity="0.7">
            AUST · 2026
          </text>

          {/* 纸飞机 + 轨迹线 */}
          <g>
            <path
              d="M20 28 L85 8 L48 58 L38 42 L20 28 Z"
              fill="var(--color-primary-ghost)"
              stroke="var(--color-primary)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M20 28 L48 58 L52 42 Z" fill="var(--color-primary)" opacity="0.25" />
            {/* 飞行轨迹 */}
            <line x1="20" y1="28" x2="-20" y2="16"
              stroke="var(--color-border)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
              strokeLinecap="round"
              style={{ animation: "plane-dash 3s linear infinite" }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
