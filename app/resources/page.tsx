import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { value: "", label: "全部", icon: "📂" },
  { value: "high-math", label: "高数笔记", icon: "📐" },
  { value: "cs-courseware", label: "计算机课件", icon: "💻" },
  { value: "software", label: "软件安装包", icon: "📦" },
  { value: "review", label: "期末复习", icon: "📋" },
  { value: "latex", label: "LaTeX 模板", icon: "📄" },
  { value: "other", label: "其他", icon: "📎" },
];

const CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数笔记",
  "cs-courseware": "计算机课件",
  software: "软件安装包",
  review: "期末复习",
  latex: "LaTeX模板",
  other: "其他",
};

const FILE_TYPE_ICON: Record<string, string> = {
  "application/pdf": "📕",
  "text/markdown": "📝",
  "application/zip": "📦",
  "application/x-zip-compressed": "📦",
  "application/x-7z-compressed": "📦",
  "application/x-rar-compressed": "📦",
  "application/octet-stream": "📎",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "未知大小";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let q = supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (category && CATEGORIES.some((c) => c.value === category)) {
    q = q.eq("category", category);
  }

  const { data: resources, error } = await q;

  // 未配置 Supabase 或查询失败时展示友好提示
  const isNotConfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (error || isNotConfigured) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">资源下载</h1>
        <p className="mt-2 text-sm text-muted">
          正在补充中，敬请期待。
        </p>
        <div className="mt-10 rounded-xl border border-dashed border-border bg-bg-alt p-10 text-center">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-sm text-muted">资源库正在建设中</p>
          <p className="mt-2 text-xs text-muted/70">
            高数笔记、课件、软件安装包等学习资料即将上线。
          </p>
        </div>
      </div>
    );
  }

  const activeCategory = category || "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* 标题区 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Downloads</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-serif font-semibold text-text">资源下载</h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            高数笔记、课件、软件安装包、复习提纲等学习资料。
            {!resources || resources.length === 0
              ? " 目前还没有资源，欢迎贡献。"
              : ` 共 ${resources.length} 个文件。`}
          </p>
        </div>
        <Link
          href="/resources/upload"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
        >
          + 上传资源
        </Link>
      </div>

      {/* 分类筛选 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = activeCategory === c.value;
          return (
            <Link
              key={c.value}
              href={`/resources${c.value ? `?category=${c.value}` : ""}`}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all duration-200",
                isActive
                  ? "border-primary bg-primary-light text-primary shadow-sm shadow-primary/10"
                  : "border-border text-muted hover:border-primary/50 hover:text-primary",
              ].join(" ")}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              {isActive && resources && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {resources.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 资源列表或空状态 */}
      <div className="mt-8">
        {!resources || resources.length === 0 ? (
          <EmptyState hasCategory={!!activeCategory} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasCategory }: { hasCategory: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{hasCategory ? "🔍" : "📭"}</div>
      <p className="text-base font-medium text-text">
        {hasCategory ? "该分类下暂无资源" : "还没有任何资源"}
      </p>
      <p className="mt-2 text-sm text-muted max-w-sm">
        {hasCategory
          ? "这个分类下还没有文件，试试其他分类，或者成为第一个上传的人。"
          : "资源库空空如也。如果你有笔记、课件或好用的工具，欢迎上传分享给同学们。"}
      </p>
      {!hasCategory && (
        <Link
          href="/resources/upload"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          上传第一个资源
        </Link>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  const typeIcon =
    FILE_TYPE_ICON[resource.file_type] ||
    (resource.file_name.endsWith(".pdf")
      ? "📕"
      : resource.file_name.endsWith(".md")
        ? "📝"
        : resource.file_name.match(/\.(zip|7z|rar)$/i)
          ? "📦"
          : "📎");

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-2xl transition-transform duration-200 group-hover:scale-110">
        {typeIcon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text group-hover:text-primary transition-colors truncate">
          {resource.title}
        </p>
        {resource.description && (
          <p className="mt-1 text-xs text-muted line-clamp-2">{resource.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
          <span className="rounded-md border border-border px-1.5 py-0.5">
            {CATEGORY_LABEL[resource.category] ?? "其他"}
          </span>
          <span>{formatSize(resource.file_size)}</span>
          <span className="truncate max-w-[120px]">{resource.file_name}</span>
          <span className="flex items-center gap-0.5">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {resource.download_count ?? 0}
          </span>
        </div>
      </div>
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted/40 transition-colors group-hover:text-primary mt-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
