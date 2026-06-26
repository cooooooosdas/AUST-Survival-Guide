// 站点 URL 解析。优先级：显式 NEXT_PUBLIC_SITE_URL > Vercel 注入的 VERCEL_URL > localhost。
// 解析后保证：含协议、不带末尾斜杠。

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return stripTrailingSlash(explicit);
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${stripTrailingSlash(vercel)}`;
  }
  return "http://localhost:3000";
}

function stripTrailingSlash(s: string) {
  return s.replace(/\/+$/, "");
}

export const SITE = {
  name: "安徽理工大学生存指南",
  shortName: "AUST 生存指南",
  description:
    "写给安徽理工大学新生的一站式资源导航与学长来信。工具、微服务、学习资源、软件、AI 与长文经验，慢慢更新。",
  author: "coolin",
  locale: "zh-CN",
};
