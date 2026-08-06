/**
 * SkillTree —— 技能图谱
 * 手绘风节点 + 连线，中央是 coolin，向外辐射
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
  { id: "center", label: "coolin", x: 440, y: 240, size: 50, primary: true },

  // 8 大领域（4 老 + 4 新）
  { id: "frontend", label: "前端", x: 160, y: 110, size: 34, tint: "primary" },
  { id: "backend", label: "后端", x: 720, y: 110, size: 34, tint: "primary" },
  { id: "ai", label: "AI / 数据", x: 160, y: 370, size: 34, tint: "accent" },
  { id: "tools", label: "工具 / 工程", x: 720, y: 370, size: 34, tint: "accent" },
  { id: "database", label: "数据库", x: 440, y: 50, size: 32, tint: "secondary" },
  { id: "os", label: "操作系统", x: 50, y: 240, size: 32, tint: "secondary" },
  { id: "cloud", label: "云服务", x: 440, y: 430, size: 32, tint: "secondary" },
  { id: "collab", label: "协作", x: 830, y: 240, size: 32, tint: "secondary" },

  // 前端子技能
  { id: "react", label: "React 19", x: 50, y: 30, size: 22, tint: "muted" },
  { id: "next", label: "Next.js 16", x: 200, y: 22, size: 24, tint: "muted" },
  { id: "tailwind", label: "Tailwind v4", x: 280, y: 70, size: 22, tint: "muted" },

  // 后端子技能
  { id: "ts", label: "TypeScript", x: 580, y: 30, size: 22, tint: "muted" },
  { id: "supabase", label: "Supabase", x: 760, y: 30, size: 24, tint: "muted" },
  { id: "mdx", label: "MDX", x: 860, y: 90, size: 22, tint: "muted" },

  // AI 子技能
  { id: "deepseek", label: "DeepSeek", x: 50, y: 310, size: 22, tint: "muted" },
  { id: "rag", label: "RAG 检索", x: 60, y: 450, size: 22, tint: "muted" },
  { id: "embed", label: "Transformers", x: 260, y: 460, size: 22, tint: "muted" },

  // 工具子技能
  { id: "git", label: "Git", x: 580, y: 320, size: 22, tint: "muted" },
  { id: "vscode", label: "VS Code", x: 700, y: 460, size: 22, tint: "muted" },
  { id: "figma", label: "Figma", x: 860, y: 460, size: 22, tint: "muted" },

  // 数据库子技能
  { id: "postgres", label: "PostgreSQL", x: 360, y: 0, size: 20, tint: "muted" },
  { id: "redis", label: "Redis", x: 520, y: 0, size: 20, tint: "muted" },

  // OS 子技能
  { id: "linux", label: "Linux", x: -10, y: 175, size: 22, tint: "muted" },
  { id: "bash", label: "Bash", x: -10, y: 310, size: 22, tint: "muted" },
];

const LINKS: Link[] = [
  // 中央到 8 大领域
  { from: "center", to: "frontend" },
  { from: "center", to: "backend" },
  { from: "center", to: "ai" },
  { from: "center", to: "tools" },
  { from: "center", to: "database" },
  { from: "center", to: "os" },
  { from: "center", to: "cloud" },
  { from: "center", to: "collab" },
  // 前端
  { from: "frontend", to: "react", dashed: true },
  { from: "frontend", to: "next", dashed: true },
  { from: "frontend", to: "tailwind", dashed: true },
  // 后端
  { from: "backend", to: "ts", dashed: true },
  { from: "backend", to: "supabase", dashed: true },
  { from: "backend", to: "mdx", dashed: true },
  // AI
  { from: "ai", to: "deepseek", dashed: true },
  { from: "ai", to: "rag", dashed: true },
  { from: "ai", to: "embed", dashed: true },
  // 工具
  { from: "tools", to: "git", dashed: true },
  { from: "tools", to: "vscode", dashed: true },
  { from: "tools", to: "figma", dashed: true },
  // 数据库
  { from: "database", to: "postgres", dashed: true },
  { from: "database", to: "redis", dashed: true },
  // OS
  { from: "os", to: "linux", dashed: true },
  { from: "os", to: "bash", dashed: true },
];

const TINT_BG: Record<NonNullable<Node["tint"]>, string> = {
  primary: "bg-primary-light text-primary",
  secondary: "bg-secondary-light text-secondary",
  accent: "bg-accent-light text-accent",
  muted: "bg-bg-alt text-text-secondary",
};

export default function SkillTree() {
  const nodeMap = new Map(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full">
      <svg
        viewBox="-30 40 940 460"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        role="img"
        aria-label="coolin 技能图谱"
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
                  fontSize={n.primary ? 16 : n.size && n.size > 28 ? 12 : 11}
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
          <span className="h-0.5 w-6 border-t border-dashed border-border-hover" /> 相关技术
        </span>
        <span>{NODES.length} 个节点 · 持续学习中</span>
      </div>
    </div>
  );
}