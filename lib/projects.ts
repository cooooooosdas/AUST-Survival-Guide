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
    github: "https://github.com/cooooooosdas/AUST-Survival-Guide",
    date: "2026-06-26",
    featured: true,
    load: () => import("@/content/projects/aust-plan.mdx"),
  },
  {
    slug: "2dti",
    title: "2DTI 次元人格测试",
    description: "轻量、有趣的二次元人格测试网站。3 分钟 30 道题，基于 SBTI 八维度赋分，匹配 34 个动漫角色。",
    techStack: ["HTML5", "CSS3", "JavaScript", "html2canvas"],
    github: "https://github.com/cooooooosdas/2DTI",
    demo: "https://2dti.asia/",
    date: "2026-06-20",
    featured: true,
    load: () => import("@/content/projects/2dti.mdx"),
  },
  {
    slug: "employee-management",
    title: "员工信息管理系统",
    description: "软工大一上学期 C 语言课程设计，结合 EasyX 图形库实现的桌面端员工信息管理系统。",
    techStack: ["C 语言", "EasyX"],
    github: "https://gitee.com/hu-xi666/c-language/tree/master/%E5%A4%A7%E4%B8%80%E4%B8%8AC%E5%A4%A7%E4%BD%9C%E4%B8%9A",
    date: "2026-06-15",
    load: () => import("@/content/projects/employee-management.mdx"),
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
