/**
 * 首页 Hero 手绘风装饰 —— 校刊 / 信纸主题
 * 用 SVG path 模拟手绘笔触，配合噪点滤镜增加质感
 *
 * 元素：
 *  - 摊开的信纸（含三行手写文字线）
 *  - 钢笔（俯视）
 *  - 一片树叶（左上）
 *  - 邮戳（圆形带三色）
 *  - 远处虚线（飞行轨迹）
 */

export default function HeroIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        {/* 手绘噪点：让线条边缘有铅笔质感 */}
        <filter id="hero-pencil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" scale="0.6" />
        </filter>

        {/* 邮戳纹理 */}
        <filter id="hero-stamp-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.6"
            numOctaves="2"
            seed="7"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.72
                    0 0 0 0 0.20
                    0 0 0 0 0.12
                    0 0 0 0.18 0"
          />
        </filter>
      </defs>

      {/* 远处的飞行轨迹（虚线） */}
      <g filter="url(#hero-pencil)" opacity="0.55">
        <path
          d="M30 38 C 70 22, 110 50, 145 36"
          stroke="var(--color-muted)"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        {/* 纸飞机 */}
        <g transform="translate(146 32) rotate(8)">
          <path
            d="M0 0 L24 -10 L14 6 L11 0 L0 0 Z"
            fill="var(--color-surface)"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M0 0 L14 6 L11 0 Z" fill="var(--color-bg-alt)" />
        </g>
      </g>

      {/* 摊开的信纸（主元素） */}
      <g transform="translate(60 78)" filter="url(#hero-pencil)">
        {/* 信纸底 */}
        <rect
          x="0"
          y="0"
          width="240"
          height="200"
          rx="3"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1.2"
        />
        {/* 左侧装订 */}
        <line
          x1="14"
          y1="10"
          x2="14"
          y2="190"
          stroke="var(--color-accent-light)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* 顶部一行：本期 + 日期 */}
        <text
          x="28"
          y="32"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="9"
          fill="var(--color-muted)"
          letterSpacing="1.2"
        >
          AUST · 2026.09
        </text>

        {/* 标题：手绘大字（用 stroke 模拟手写） */}
        <g stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round">
          <path d="M30 60 L30 96" />
          <path d="M30 60 L48 60 L48 96" />
          <path d="M48 60 L48 96" />
          <path d="M58 78 L80 78" />
          <path d="M58 60 L58 96" />
          <path d="M58 96 L80 96" />
        </g>

        {/* 正文三行文字线（手绘感） */}
        <g
          stroke="var(--color-text-secondary)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        >
          <path d="M30 116 C 70 112, 130 120, 200 114" />
          <path d="M30 132 C 80 128, 140 138, 195 130" />
          <path d="M30 148 C 60 145, 110 152, 160 146" />
          <path d="M30 164 C 70 161, 120 168, 170 162" />
          <path d="M30 180 C 50 178, 90 182, 120 178" />
        </g>
      </g>

      {/* 邮戳（圆形 + 三色点 + 文字） */}
      <g transform="translate(208 78)" filter="url(#hero-stamp-grain)">
        <circle
          cx="28"
          cy="28"
          r="28"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          opacity="0.8"
        />
        <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-accent)" strokeWidth="0.6" opacity="0.5" />
        <text
          x="28"
          y="14"
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="6"
          fill="var(--color-accent)"
          opacity="0.9"
          letterSpacing="0.4"
        >
          AUST
        </text>
        <text
          x="28"
          y="34"
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="7"
          fill="var(--color-accent)"
          opacity="0.9"
          letterSpacing="0.4"
        >
          2026
        </text>
        <text
          x="28"
          y="46"
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="5"
          fill="var(--color-accent)"
          opacity="0.8"
          letterSpacing="0.5"
        >
          coolin
        </text>
      </g>

      {/* 钢笔（俯视） */}
      <g transform="translate(40 220) rotate(-22)" filter="url(#hero-pencil)">
        {/* 笔尖 */}
        <path
          d="M0 0 L22 4 L20 9 L2 5 Z"
          fill="var(--color-text)"
          stroke="var(--color-text)"
          strokeWidth="0.5"
        />
        {/* 笔身 */}
        <rect
          x="22"
          y="3"
          width="62"
          height="5"
          rx="1.5"
          fill="var(--color-secondary)"
          stroke="var(--color-secondary-hover)"
          strokeWidth="0.5"
        />
        {/* 笔帽金属环 */}
        <rect
          x="80"
          y="3"
          width="6"
          height="5"
          fill="var(--color-accent)"
        />
        {/* 笔尾 */}
        <rect
          x="86"
          y="3"
          width="10"
          height="5"
          rx="1"
          fill="var(--color-secondary)"
        />
        {/* 笔尖中缝 */}
        <line x1="2" y1="5" x2="20" y2="6.5" stroke="var(--color-surface)" strokeWidth="0.4" />
      </g>

      {/* 一片树叶（左上角，呼应"新生"） */}
      <g transform="translate(28 130) rotate(-30)" filter="url(#hero-pencil)" opacity="0.85">
        <path
          d="M0 0 C 8 -10, 22 -8, 24 6 C 24 18, 14 26, 0 22 C -2 14, -4 8, 0 0 Z"
          fill="var(--color-primary-light)"
          stroke="var(--color-primary)"
          strokeWidth="1"
        />
        <path
          d="M0 0 C 6 8, 14 14, 20 18"
          stroke="var(--color-primary)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* 叶脉 */}
        <path
          d="M5 4 L8 6 M8 6 L10 4 M11 9 L14 11 M14 11 L16 9 M16 14 L19 15"
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>

      {/* 几个小圆点：装饰气泡 */}
      <g fill="var(--color-muted)" opacity="0.5">
        <circle cx="324" cy="220" r="2" />
        <circle cx="334" cy="240" r="1.5" />
        <circle cx="318" cy="252" r="1" />
      </g>
    </svg>
  );
}