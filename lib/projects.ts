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
    slug: "bilibili-fav-classifier",
    title: "B站收藏夹分类器",
    description: "给越攒越多的收藏夹理个头绪：规则分类、整理预览与可选 AI 辅助。提供 Python 源码及本地运行说明。",
    techStack: ["Python", "Playwright", "CustomTkinter"],
    date: "2026-10-20",
    featured: true,
    load: () => import("@/content/projects/bilibili-fav-classifier.mdx"),
  },
  {
    slug: "erke-helper",
    title: "二课活动提醒助手",
    description: "聚合第二课堂活动，按画像和学时需求筛选、提醒。电脑端与 Android 端源码一起分享，各自附带运行说明。",
    techStack: ["Python", "FastAPI", "Flutter", "Dart"],
    date: "2026-10-20",
    featured: true,
    load: () => import("@/content/projects/erke-helper.mdx"),
  },
  {
    slug: "shenshou",
    title: "神兽职场 · 传统文化互动体验",
    description: "让麒麟送快递、玄武守网络、朱雀当消防员、狻猊做咖啡。翻阅神兽档案，完成六题趣味测试，领取一张自己的神兽工牌。",
    techStack: ["HTML5", "CSS3", "JavaScript", "Canvas", "AIGC"],
    demo: "/experiences/shenshou/index.html",
    date: "2026-10-19",
    featured: true,
    load: () => import("@/content/projects/shenshou.mdx"),
  },
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
