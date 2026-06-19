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
  { slug: "letters", title: "学长来信", href: "/letters", description: "长文随笔 · 写给即将到来的你", group: "extra" },
  { slug: "board", title: "留言区", href: "/board", description: "登录后留言、提问、吐槽", group: "extra" },
  { slug: "about", title: "关于我", href: "/about", description: "胡希 · 软工25-4", group: "extra" },
];

export const MAIN_SECTIONS = SECTIONS.filter((s) => s.group === "main");
export const EXTRA_SECTIONS = SECTIONS.filter((s) => s.group === "extra");

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
