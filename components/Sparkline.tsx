/**
 * 迷你趋势线 —— 用于首页 Desk note 卡片
 * 纯 SVG，无依赖。默认展示最近 14 个数据点 + 末尾高亮
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

  // 末端区域填充（淡淡的渐变）
  const areaD =
    `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 面积渐变 */}
      <path d={areaD} fill="url(#sparkline-fill)" />

      {/* 折线 */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 末端高亮 */}
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2.5"
        fill="var(--color-primary)"
      />
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="5"
        fill="var(--color-primary)"
        opacity="0.18"
      />
    </svg>
  );
}