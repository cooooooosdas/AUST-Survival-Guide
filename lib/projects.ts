import type { ComponentType } from "react";

export type ProjectMeta = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  github?: string;
  demo?: string;
  date: string;
  featured?: boolean;
};

export type ProjectModule = {
  default: ComponentType;
  metadata?: Partial<ProjectMeta>;
};

type ProjectEntry = ProjectMeta & {
  load: () => Promise<ProjectModule>;
};

export const PROJECTS: ProjectEntry[] = [
  {
    slug: "aust-plan",
    title: "安理大生存指南",
    description: "面向安理大新生的资源导航与经验分享站点。包含工具箱、学长来信、AI 助手等功能模块。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    github: "https://github.com/hu-xi666/AUST-plan",
    demo: "https://aust-plan.vercel.app",
    date: "2026-06-26",
    featured: true,
    load: () => import("@/content/projects/aust-plan.mdx"),
  },
  {
    slug: "ai-study-assistant",
    title: "AI 学习助手",
    description: "基于大模型的智能学习辅助工具，支持高等数学题目解答、代码调试和学习路径规划。",
    techStack: ["Python", "FastAPI", "React", "Claude API"],
    github: "https://github.com/hu-xi666/ai-study-assistant",
    date: "2026-03-15",
    featured: true,
    load: () => import("@/content/projects/ai-study-assistant.mdx"),
  },
  {
    slug: "course-management",
    title: "课程管理系统",
    description: "课程大作业项目，实现了学生选课、成绩查询、课表生成等功能的 Web 应用。",
    techStack: ["Vue.js", "Node.js", "MySQL", "Element Plus"],
    github: "https://github.com/hu-xi666/course-management",
    date: "2026-01-20",
    load: () => import("@/content/projects/course-management.mdx"),
  },
];

export const PROJECT_MAP = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p])
) as Record<string, ProjectEntry>;

export function getProject(slug: string): ProjectEntry | undefined {
  return PROJECT_MAP[slug];
}

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const ALL_TECH = Array.from(new Set(PROJECTS.flatMap((p) => p.techStack))).sort();
