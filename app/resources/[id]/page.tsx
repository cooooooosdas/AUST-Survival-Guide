import { notFound } from "next/navigation";
import Link from "next/link";
import ViewTracker from "@/components/ViewTracker";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数笔记",
  "cs-courseware": "计算机课件",
  software: "软件安装包",
  review: "期末复习",
  latex: "LaTeX模板",
  other: "其他",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "未知大小";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function getResource(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function getDownloadUrl(storagePath: string) {
  const supabase = await createClient();
  const result = await supabase.storage.from("resources").createSignedUrl(storagePath, 300);
  const url = result.data?.signedUrl ?? null;
  return url;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getResource(id);
  if (!r) return {};
  return { title: r.title };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  const downloadUrl = await getDownloadUrl(resource.storage_path);
  const isPDF = resource.file_type === "application/pdf" || resource.file_name.endsWith(".pdf");
  const isMD = resource.file_type === "text/markdown" || resource.file_name.endsWith(".md");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ViewTracker targetType="resource" targetId={String(resource.id)} />
      <Link
        href="/resources"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        ← 资源列表
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">{resource.title}</h1>
        {resource.description && (
          <p className="mt-2 text-sm text-muted leading-relaxed">{resource.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="rounded-md border border-border px-1.5 py-0.5">
            {CATEGORY_LABEL[resource.category] ?? "其他"}
          </span>
          <span>{formatSize(resource.file_size)}</span>
          <span>{resource.file_name}</span>
          <span>↓ {resource.download_count ?? 0} 次下载</span>
        </div>
      </header>

      {/* 预览区 */}
      {isPDF && downloadUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary mb-3">在线预览</h2>
          <div className="rounded-xl border border-border overflow-hidden" style={{ height: "70vh" }}>
            <iframe
              src={downloadUrl}
              title={resource.title}
              className="h-full w-full"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}

      {isMD && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary mb-3">内容预览</h2>
          <Suspense fallback={<p className="text-sm text-muted">加载中…</p>}>
            <MdPreview path={resource.storage_path} />
          </Suspense>
        </div>
      )}

      {!isPDF && !isMD && (
        <div className="mt-8 rounded-xl border border-border bg-bg-alt p-8 text-center text-sm text-muted">
          <p className="text-4xl mb-3">📎</p>
          <p>此文件类型不支持在线预览，请下载后查看。</p>
        </div>
      )}

      {/* 下载按钮 */}
      {downloadUrl && (
        <div className="mt-8">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            下载文件
          </a>
        </div>
      )}
    </div>
  );
}

async function MdPreview({ path }: { path: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("resources").createSignedUrl(path, 300);
  if (error || !data?.signedUrl) {
    return <p className="text-sm text-red-600">无法加载文件内容</p>;
  }

  const res = await fetch(data.signedUrl);
  const text = await res.text();

  return (
    <div className="glass-card p-6 overflow-x-auto">
      <pre className="text-sm leading-relaxed text-text whitespace-pre-wrap font-mono">
        {text}
      </pre>
    </div>
  );
}
