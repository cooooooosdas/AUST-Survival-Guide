import { Suspense } from "react";
import Link from "next/link";
import {
  Star,
  ExternalLink,
  Globe,
  Calendar,
  Pencil,
  Copy,
  Code2,
} from "lucide-react";
import { PROJECTS, ALL_TECH } from "@/lib/projects";
import { requireAdminPage } from "@/lib/admin-guard";
import { createClient } from "@/lib/supabase/server";

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type ViewRow = { target_id: string };

const GITHUB_EDIT_URL =
  "https://github.com/cooooooosdas/AUST-Survival-Guide/edit/main/lib/projects.ts";
const GITHUB_NEW_PROJECT_URL =
  "https://github.com/cooooooosdas/AUST-Survival-Guide/new/main/content/projects";
const GITHUB_BLOB_URL =
  "https://github.com/cooooooosdas/AUST-Survival-Guide/blob/main/lib/projects.ts";

export const metadata = { title: "项目管理" };

export default async function AdminProjectsPage() {
  await requireAdminPage();

  const supabase = await createClient();
  const { data: views } = await supabase
    .from("content_views")
    .select("target_id")
    .eq("target_type", "project")
    .limit(100);

  const viewMap = new Map<string, number>();
  if (views) {
    for (const v of views as unknown as ViewRow[]) {
      viewMap.set(v.target_id, (viewMap.get(v.target_id) ?? 0) + 1);
    }
  }

  // JSON 快照（方便管理员复制后改）
  const snapshot = JSON.stringify(
    PROJECTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      github: p.github,
      demo: p.demo,
      date: p.date,
      featured: p.featured ?? false,
    })),
    null,
    2
  );

  return (
    <div>
      <header className="border-b border-border pb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          Projects · {PROJECTS.length}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">项目管理</h1>
        <p className="mt-3 text-sm text-muted">
          所有项目元数据来自{" "}
          <code className="rounded bg-bg-alt px-1.5 py-0.5 font-mono text-[12px] text-text">
            lib/projects.ts
          </code>
          ，修改后需重新部署。
        </p>
      </header>

      {/* 快速操作 */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={GITHUB_EDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-text group-hover:text-primary">
              在 GitHub 上编辑元数据
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">
              lib/projects.ts
            </p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
        </a>

        <a
          href={GITHUB_NEW_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-secondary/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-light text-secondary">
            <Code2 className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-text group-hover:text-secondary">
              新建项目 MDX
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">
              content/projects/[slug].mdx
            </p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
        </a>
      </section>

      {/* 技术栈分布 */}
      <section className="mt-8">
        <h2 className="mb-3 text-[11px] uppercase tracking-widest text-muted">
          技术栈 · {ALL_TECH.length}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TECH.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-bg-alt px-2 py-0.5 font-mono text-xs text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* 项目列表 */}
      <section className="mt-10">
        <h2 className="mb-3 text-[11px] uppercase tracking-widest text-muted">
          项目列表
        </h2>
        <ul className="space-y-3">
          {PROJECTS.map((p) => {
            const views = viewMap.get(p.slug) ?? 0;
            return (
              <li
                key={p.slug}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-semibold text-text">
                        {p.title}
                      </h3>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-light px-1.5 py-0.5 text-[10px] text-accent">
                          <Star
                            className="h-2.5 w-2.5"
                            strokeWidth={2}
                            fill="currentColor"
                          />
                          featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {p.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {p.techStack.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-border bg-bg-alt px-1.5 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right font-mono text-[11px] text-muted">
                    <Calendar
                      className="mb-1 ml-auto h-3 w-3 text-muted"
                      strokeWidth={2}
                    />
                    <div>{DATE_FORMATTER.format(new Date(p.date))}</div>
                    <div className="mt-2">
                      <span className="text-text">{views}</span> views
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 font-mono text-[11px]">
                  <code className="rounded bg-bg-alt px-1.5 py-0.5 text-muted">
                    /{p.slug}
                  </code>
                  <div className="ml-auto flex items-center gap-2">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-text-secondary transition-colors hover:border-primary hover:text-primary"
                      >
                        <Globe className="h-3 w-3" strokeWidth={2} />
                        GitHub
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-text-secondary transition-colors hover:border-primary hover:text-primary"
                      >
                        <ExternalLink className="h-3 w-3" strokeWidth={2} />
                        Demo
                      </a>
                    )}
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-sans text-[11px] font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                      查看公开页
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 配置快照 */}
      <section className="mt-10 rounded-xl border border-dashed border-border bg-bg-alt p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium text-text">
              <Code2 className="h-4 w-4 text-primary" strokeWidth={2} />
              当前配置快照
            </h3>
            <p className="mt-1 text-xs text-muted">
              复制后在 GitHub 粘贴即可，注意缩进和末尾逗号。
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(snapshot);
                alert("已复制到剪贴板");
              } catch {
                alert("复制失败，请手动选择");
              }
            }}
            className="motion-press inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <Copy className="h-3 w-3" strokeWidth={2} />
            复制 JSON
          </button>
        </div>
        <pre className="mt-4 max-h-80 overflow-auto rounded-md border border-border bg-surface p-4 font-mono text-[11px] leading-relaxed text-text-secondary">
          {snapshot}
        </pre>
        <p className="mt-3 flex items-center gap-1 font-mono text-[11px] text-muted">
          <Globe className="h-3 w-3" />
          源码：
          <a
            href={GITHUB_BLOB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            lib/projects.ts
          </a>
        </p>
      </section>
    </div>
  );
}