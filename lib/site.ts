// 站点 URL 解析。优先级：
// 1. 显式 NEXT_PUBLIC_SITE_URL（但生产环境会跳过 localhost）
// 2. Vercel 注入的 VERCEL_URL
// 3. localhost 兜底
// 解析后保证：含协议、不带末尾斜杠。

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    const trimmed = stripTrailingSlash(explicit);
    // 生产环境不要回跳到 localhost（例如忘记改 Vercel 环境变量时兜住）
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev || !isLocalhost(trimmed)) {
      return trimmed;
    }
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${stripTrailingSlash(vercel)}`;
  }
  return "http://localhost:3000";
}

function isLocalhost(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url);
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
  github: "https://github.com/cooooooosdas/AUST-Survival-Guide",
};
