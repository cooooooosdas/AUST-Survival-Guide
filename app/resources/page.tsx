import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { USEFUL_WEBSITES } from "@/lib/resource-websites";

export const dynamic = "force-dynamic";
export const metadata = { title: "资源中心" };

const COMING_SOON = [
  { value: "high-math", label: "高数笔记" },
  { value: "cs-courseware", label: "计算机课件" },
  { value: "software", label: "软件安装包" },
  { value: "review", label: "期末复习" },
  { value: "latex", label: "LaTeX 模板" },
  { value: "other", label: "其他" },
] as const;

const TAG_STYLE: Record<string, string> = {
  推荐: "bg-accent-light text-accent",
  国内: "bg-primary-light text-primary",
  学习: "bg-secondary-light text-secondary",
  社区: "bg-secondary-light text-secondary",
  工具: "bg-bg-alt text-text-secondary",
};

export default function ResourceCenterPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 标题区 */}
      <div className="border-b border-border pb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          Resource Hub
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">资源中心</h1>
        <p className="mt-2 text-sm text-muted">
          计算机专业学生常用网址与学习资料。第一期上线「常用网址」板块。
        </p>
      </div>

      {/* 分类筛选：常用网址 active，其他板块 disabled 显示"即将上线" */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-primary bg-primary-light px-3 py-1.5 text-xs font-medium text-primary">
          常用网址
        </span>
        {COMING_SOON.map((c) => (
          <span
            key={c.value}
            className="rounded-full border border-border bg-bg-alt px-3 py-1.5 text-xs text-muted"
            title="即将上线"
          >
            {c.label}
            <span className="ml-1.5 text-[10px] opacity-60">即将上线</span>
          </span>
        ))}
      </div>

      {/* 常用网址列表 */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-text">
            <Bookmark className="h-4 w-4 text-primary" strokeWidth={2} />
            常用网址
            <span className="font-mono text-[11px] font-normal text-muted">
              {USEFUL_WEBSITES.length} 个
            </span>
          </h2>
          <span className="font-mono text-[11px] text-muted">
            持续更新中
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {USEFUL_WEBSITES.map((site) => (
            <li key={site.url}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-sm font-mono text-text-secondary">
                  {site.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text transition-colors group-hover:text-primary">
                      {site.title}
                    </span>
                    {site.tag && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          TAG_STYLE[site.tag] ?? "bg-bg-alt text-muted"
                        }`}
                      >
                        {site.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {site.description}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted/40 transition-colors group-hover:text-primary"
                  strokeWidth={2}
                />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 未来扩展提示 */}
      <section className="mt-12 rounded-xl border border-dashed border-border bg-bg-alt/50 p-5 text-sm text-text-secondary">
        <p className="font-medium text-text">后续会加上</p>
        <p className="mt-2 leading-relaxed">
          高数笔记、课件、软件安装包、期末复习、LaTeX 模板等资料——会陆续通过 Supabase
          Storage 上传。如果你有想分享的资料，<Link
            href="/board"
            className="text-primary underline-offset-2 hover:underline"
          >
            到留言区
          </Link>{" "}
          告诉 coolin。
        </p>
      </section>
    </div>
  );
}