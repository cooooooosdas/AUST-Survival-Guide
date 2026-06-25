export type Section = {
  slug: string;
  title: string;
  href: string;
  description: string;
  group: "main" | "extra";
};

export const SECTIONS: Section[] = [
  { slug: "tools", title: "工具箱", href: "/tools", description: "学习生活常用网址", group: "main" },
  { slug: "microservices", title: "学校微服务", href: "/microservices", description: "教务处与校内官方入口", group: "main" },
  { slug: "learn", title: "学习资源", href: "/learn", description: "B 站精选课程与教学文档", group: "main" },
  { slug: "software", title: "软件资源", href: "/software", description: "计算机学生常用软件", group: "main" },
  { slug: "ai", title: "AI 专区", href: "/ai", description: "AI 工具与使用方法", group: "main" },
  { slug: "resources", title: "资源下载", href: "/resources", description: "笔记、课件、软件包", group: "main" },
  { slug: "checkin", title: "学习打卡", href: "/checkin", description: "每日任务打卡 · 刷题练习", group: "main" },
  { slug: "letters", title: "学长来信", href: "/letters", description: "长文随笔 · 写给即将到来的你", group: "extra" },
  { slug: "tags", title: "标签云", href: "/tags", description: "按标签浏览内容", group: "extra" },
  { slug: "about", title: "关于我", href: "/about", description: "胡希 · 软工25-4", group: "extra" },
];

export const MAIN_SECTIONS = SECTIONS.filter((s) => s.group === "main");
export const EXTRA_SECTIONS = SECTIONS.filter((s) => s.group === "extra");

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
