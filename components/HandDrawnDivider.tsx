/**
 * 手绘风分隔符 —— 用 SVG path 模拟笔触中断效果
 * 用于 Section 标题之间，增加 "手写感" 而不抢戏
 */
type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export default function HandDrawnDivider({
  width = 80,
  height = 12,
  className,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* 主体笔触：带轻微弧度的横线 */}
      <path
        d={`M2 ${height / 2} Q ${width * 0.3} ${height * 0.1}, ${
          width * 0.5
        } ${height / 2} T ${width - 2} ${height / 2}`}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* 起笔点的小圆点（仿毛笔/钢笔起笔） */}
      <circle cx="2" cy={height / 2} r="1.6" fill="currentColor" opacity="0.7" />
      {/* 收笔的轻撇 */}
      <path
        d={`M${width - 2} ${height / 2} l -8 4`}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}