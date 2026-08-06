/**
 * ProjectStack —— 项目技术栈图谱
 * 展示 AUST 生存指南自身用了什么，不是"我会什么"
 * 中央是项目名，向外辐射到各技术领域
 */

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  size?: number;
  primary?: boolean;
  tint?: "primary" | "secondary" | "accent" | "muted";
};

type Link = {
  from: string;
  to: string;
  dashed?: boolean;
};

const NODES: Node[] = [
  // 中央
  {
    id: "center",
    label: "AUST Survival Guide",
    x: 440,
    y: 240,
    size: 56,
    primary: true,
  },

  // 4 大领域
  { id: "frontend", label: "前端", x: 160, y: 120, size: 36, tint: "primary" },
  { id: "content", label: "内容", x: 720, y: 120, size: 36, tint: "accent" },
  { id: "backend", label: "后端", x: 160, y: 380, size: 36, tint: "secondary" },
  { id: "infra", label: "基建", x: 720, y: 380, size: 36, tint: "muted" },

  // 前端子
  { id: "nextjs", label: "Next.js 16", x: 60, y: 30, size: 24, tint: "muted" },
  { id: "react", label: "React 19", x: 200, y: 20, size: 24, tint: "muted" },
  { id: "tailwind", label: "Tailwind v4", x: 280, y: 70, size: 24, tint: "muted" },

  // 内容子
  { id: "mdx", label: "MDX", x: 600, y: 30, size: 24, tint: "muted" },
  { id: "lucide", label: "lucide-react", x: 760, y: 30, size: 24, tint: "muted" },
  { id: "inter", label: "Inter / 衬线字", x: 860, y: 90, size: 22, tint: "muted" },

  // 后端子
  { id: "supabase", label: "Supabase", x: 60, y: 320, size: 26, tint: "muted" },
  { id: "api", label: "API Routes", x: 60, y: 460, size: 22, tint: "muted" },
  { id: "auth", label: "Supabase Auth", x: 220, y: 470, size: 22, tint: "muted" },

  // 基建子
  { id: "vercel", label: "Vercel Edge", x: 580, y: 320, size: 24, tint: "muted" },
  { id: "ts", label: "TypeScript 5", x: 700, y: 470, size: 24, tint: "muted" },
  { id: "eslint", label: "ESLint", x: 860, y: 460, size: 22, tint: "muted" },
];

const LINKS: Link[] = [
  // 中央到 4 大领域
  { from: "center", to: "frontend" },
  { from: "center", to: "content" },
  { from: "center", to: "backend" },
  { from: "center", to: "infra" },
  // 前端
  { from: "frontend", to: "nextjs", dashed: true },
  { from: "frontend", to: "react", dashed: true },
  { from: "frontend", to: "tailwind", dashed: true },
  // 内容
  { from: "content", to: "mdx", dashed: true },
  { from: "content", to: "lucide", dashed: true },
  { from: "content", to: "inter", dashed: true },
  // 后端
  { from: "backend", to: "supabase", dashed: true },
  { from: "backend", to: "api", dashed: true },
  { from: "backend", to: "auth", dashed: true },
  // 基建
  { from: "infra", to: "vercel", dashed: true },
  { from: "infra", to: "ts", dashed: true },
  { from: "infra", to: "eslint", dashed: true },
];

const TINT_BG: Record<NonNullable<Node["tint"]>, string> = {
  primary: "bg-primary-light text-primary",
  secondary: "bg-secondary-light text-secondary",
  accent: "bg-accent-light text-accent",
  muted: "bg-bg-alt text-text-secondary",
};

export default function ProjectStack() {
  const nodeMap = new Map(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full">
      <svg
        viewBox="-30 40 940 460"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        role="img"
        aria-label="AUST Survival Guide 技术栈"
      >
        <defs>
          <filter id="sk-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.95"
              numOctaves="2"
              seed="5"
            />
            <feDisplacementMap in="SourceGraphic" scale="0.5" />
          </filter>
          <marker
            id="sk-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border-hover)" />
          </marker>
        </defs>

        {/* 连线 */}
        <g stroke="var(--color-border-hover)" strokeWidth="1.2" fill="none" opacity="0.85">
          {LINKS.map((l, i) => {
            const from = nodeMap.get(l.from);
            const to = nodeMap.get(l.to);
            if (!from || !to) return null;
            return (
              <path
                key={i}
                d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${
                  (from.y + to.y) / 2 - 12
                } ${to.x} ${to.y}`}
                strokeDasharray={l.dashed ? "3 4" : undefined}
                markerEnd="url(#sk-arrow)"
              />
            );
          })}
        </g>

        {/* 节点 */}
        <g filter="url(#sk-grain)">
          {NODES.map((n) => {
            const r = n.size ?? 28;
            const tintClass = n.primary
              ? "fill-primary stroke-primary"
              : n.tint
              ? TINT_BG[n.tint].split(" ")[0].replace("bg-", "fill-").replace("-light", "-light")
              : "fill-bg-alt";
            const labelClass = n.primary
              ? "fill-white"
              : n.tint
              ? TINT_BG[n.tint].split(" ")[1].replace("text-", "fill-")
              : "fill-text-secondary";

            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  className={tintClass}
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-serif font-medium ${labelClass}`}
                  fontSize={n.primary ? 12 : n.size && n.size > 28 ? 12 : 11}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 图例 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-6 border-t border-border-hover" /> 中心辐射
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-6 border-t border-dashed border-border-hover" /> 依赖项
        </span>
        <span>共 {NODES.length} 个节点 · 2026</span>
      </div>
    </div>
  );
}