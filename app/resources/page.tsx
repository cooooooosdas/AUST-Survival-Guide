import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { value: "", label: "全部" },
  { value: "high-math", label: "高数笔记" },
  { value: "cs-courseware", label: "计算机课件" },
  { value: "software", label: "软件安装包" },
  { value: "review", label: "期末复习" },
  { value: "latex", label: "LaTeX 模板" },
  { value: "other", label: "其他" },
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
  "application/pdf": "📕 PDF",
  "text/markdown": "📝 MD",
  "application/zip": "📦 ZIP",
  "application/x-zip-compressed": "📦 ZIP",
  "application/x-7z-compressed": "📦 7Z",
  "application/x-rar-compressed": "📦 RAR",
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
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">资源下载</h1>
        <p className="mt-2 text-sm text-red-600">加载失败：{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">资源下载</h1>
          <p className="mt-1 text-sm text-muted">
            高数笔记、课件、软件安装包、复习提纲等。游客可预览文件信息，登录用户可下载。
          </p>
        </div>
        <Link
          href="/resources/upload"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          上传资源
        </Link>
      </div>

      {/* 分类筛选 */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={`/resources${c.value ? `?category=${c.value}` : ""}`}
            className={[
              "rounded-full border px-3 py-1 text-xs transition-colors",
              (!category && !c.value) || category === c.value
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* 资源列表 */}
      <div className="mt-8">
        {!resources || resources.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-bg-alt p-10 text-center text-sm text-muted">
            暂无资源，点击右上角上传。
          </div>
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

function ResourceCard({ resource }: { resource: any }) {
  const typeIcon =
    FILE_TYPE_ICON[resource.file_type] ||
    (resource.file_name.endsWith(".pdf")
      ? "📕 PDF"
      : resource.file_name.endsWith(".md")
        ? "📝 MD"
        : resource.file_name.match(/\.(zip|7z|rar)$/i)
          ? "📦 压缩包"
          : "📎 文件");

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-bg-alt p-4 transition-colors hover:border-primary/30">
      <div className="text-2xl shrink-0">{typeIcon}</div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/resources/${resource.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {resource.title}
        </Link>
        {resource.description && (
          <p className="mt-1 text-xs text-muted line-clamp-2">{resource.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
          <span className="rounded-md border border-border px-1.5 py-0.5">
            {CATEGORY_LABEL[resource.category] ?? "其他"}
          </span>
          <span>{formatSize(resource.file_size)}</span>
          <span>{resource.file_name}</span>
          <span>↓ {resource.download_count ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
