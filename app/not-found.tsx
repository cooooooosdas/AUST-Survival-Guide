import Link from "next/link";

export const metadata = { title: "找不到页面" };

const POPULAR = [
  { title: "学长来信", href: "/letters", desc: "长文经验分享" },
  { title: "工具箱", href: "/tools", desc: "学习生活常用网址" },
  { title: "学习资源", href: "/learn", desc: "B 站精选课程" },
  { title: "AI 专区", href: "/ai", desc: "AI 工具与用法" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      {/* 装饰性 404 标签 */}
      <p className="text-sm uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 text-3xl font-serif font-semibold text-text">这页没找着</h1>
      <p className="mt-4 leading-relaxed text-muted">
        可能链接打错了，也可能我把页面挪走了。试试下面这些方式找到你想看的内容：
      </p>

      {/* 搜索框 */}
      <div className="mt-8">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-xl border border-border bg-bg-alt px-4 py-3 text-sm text-muted transition-all duration-200 hover:border-primary hover:text-primary"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>搜索全站内容…</span>
          <kbd className="ml-auto hidden sm:inline-block rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] font-mono text-muted">/</kbd>
        </Link>
      </div>

      {/* 热门内容 */}
      <div className="mt-10">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">热门内容</p>
        <div className="grid grid-cols-2 gap-3">
          {POPULAR.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              <p className="text-sm font-medium text-text group-hover:text-primary">{p.title}</p>
              <p className="mt-1 text-xs text-muted">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 导航链接 */}
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li>
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            ← 回首页
          </Link>
        </li>
        <li>
          <Link href="/letters" className="text-primary underline-offset-4 hover:underline">
            学长来信
          </Link>
        </li>
        <li>
          <Link href="/faq" className="text-primary underline-offset-4 hover:underline">
            常见问题 FAQ
          </Link>
        </li>
        <li>
          <Link href="/tools" className="text-primary underline-offset-4 hover:underline">
            工具箱
          </Link>
        </li>
      </ul>

      {/* 常见原因 */}
      <div className="mt-12 rounded-xl border border-border bg-bg-alt p-6">
        <p className="text-sm font-medium text-primary">常见原因</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>• 链接拼写错误，请检查 URL</li>
          <li>• 页面已被移除或改名</li>
          <li>• 分享链接已过期</li>
        </ul>
      </div>
    </div>
  );
}
