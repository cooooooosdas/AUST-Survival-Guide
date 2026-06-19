/**
 * 信件区右侧的氛围装饰：
 * - 两团软光斑（accent + primary 低饱和度），缓慢漂浮
 * - 一张占位线稿插画（信封 + 折线，呼应「学长来信」主题）
 *
 * 想换成真图：把 <svg> 整个替换成
 *   <Image src="/illustrations/your.png" alt="" width={420} height={520} priority />
 * 推荐图源见 docs 或 plan.md「图片来源清单」。
 */
export default function HeroDecoration() {
  return (
    <div className="pointer-events-none relative hidden md:block h-full w-full">
      {/* 杏色光斑 */}
      <div
        className="absolute -top-10 -right-8 h-72 w-72 rounded-full bg-accent/40 blur-3xl"
        style={{ animation: "blob 18s ease-in-out infinite" }}
      />
      {/* 蓝色光斑 */}
      <div
        className="absolute top-32 right-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        style={{ animation: "blob 22s ease-in-out infinite reverse" }}
      />

      {/* 占位线稿：纸飞机 + 信封 */}
      <div
        className="relative mx-auto mt-6 w-[280px]"
        style={{ animation: "float 7s ease-in-out infinite" }}
      >
        <svg
          viewBox="0 0 320 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          aria-hidden="true"
        >
          {/* 信纸 */}
          <rect
            x="60"
            y="80"
            width="200"
            height="220"
            rx="8"
            fill="#FFFFFF"
            stroke="#1E3A5F"
            strokeWidth="2"
          />
          {/* 信纸折角 */}
          <path
            d="M220 80 L260 120 L220 120 Z"
            fill="#F8F9FB"
            stroke="#1E3A5F"
            strokeWidth="2"
          />
          {/* 信纸文字线 */}
          <line x1="80" y1="140" x2="220" y2="140" stroke="#E5C998" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="80" y1="160" x2="240" y2="160" stroke="#E5E7EB" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="80" y1="180" x2="200" y2="180" stroke="#E5E7EB" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="80" y1="200" x2="230" y2="200" stroke="#E5E7EB" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="80" y1="220" x2="180" y2="220" stroke="#E5E7EB" strokeWidth="1.2" strokeLinecap="round" />
          {/* 落款 */}
          <line x1="180" y1="260" x2="240" y2="260" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="200" y1="270" x2="240" y2="270" stroke="#E5C998" strokeWidth="1.5" strokeLinecap="round" />

          {/* 纸飞机 */}
          <g style={{ animation: "float 5s ease-in-out infinite" }}>
            <path
              d="M40 50 L120 30 L70 90 L60 70 L40 50 Z"
              fill="#E5C998"
              stroke="#1E3A5F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M40 50 L70 90 L75 70 Z" fill="#D9B978" />
            <line
              x1="40"
              y1="50"
              x2="0"
              y2="35"
              stroke="#1E3A5F"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
          </g>

          {/* 邮戳印记 */}
          <circle
            cx="240"
            cy="100"
            r="28"
            fill="none"
            stroke="#E5C998"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <text
            x="240"
            y="98"
            textAnchor="middle"
            fontSize="9"
            fill="#1E3A5F"
            opacity="0.7"
            fontFamily="serif"
          >
            AUST
          </text>
          <text
            x="240"
            y="110"
            textAnchor="middle"
            fontSize="7"
            fill="#1E3A5F"
            opacity="0.6"
            fontFamily="serif"
          >
            2026
          </text>
        </svg>
      </div>
    </div>
  );
}
