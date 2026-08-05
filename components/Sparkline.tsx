/**
 * 迷你趋势线 —— 用于首页 Desk note 卡片 / EditorialShelf
 * 纯 SVG，零依赖。
 *
 * 自动响应式：mobile（<640px）显示紧凑圆点列，desktop 显示完整折线 + 面积
 */
type Props = {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  className,
  ariaLabel = "近期访问趋势",
}: Props) {
  if (data.length === 0) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);

  // 折线坐标
  const points = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const lastPoint = points[points.length - 1];

  // 紧凑模式：圆点序列（mobile 显示）
  const dotCount = Math.min(data.length, 14);
  const compactDots = Array.from({ length: dotCount }, (_, i) => {
    const x = (i / Math.max(dotCount - 1, 1)) * width;
    const v = data[i] ?? 0;
    const r = ((v - min) / range) * 8 + 1.5; // 1.5~9.5px
    return { cx: x, cy: height / 2, r };
  });

  return (
    <>
      {/* 完整模式（桌面） */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={`hidden sm:block ${className ?? ""}`}
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.18"
            />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#sparkline-fill)" />
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="2.5" fill="var(--color-primary)" />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="5" fill="var(--color-primary)" opacity="0.18" />
      </svg>

      {/* 紧凑模式（移动端）—— 圆点列 */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={`sm:hidden ${className ?? ""}`}
        role="img"
        aria-label={ariaLabel}
      >
        {compactDots.map((d, i) => {
          const isLast = i === compactDots.length - 1;
          return (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={isLast ? "var(--color-primary)" : "var(--color-primary)"}
              opacity={isLast ? 1 : 0.4 + (d.r - 1.5) / 12}
            />
          );
        })}
      </svg>
    </>
  );
}