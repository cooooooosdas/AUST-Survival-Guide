"use client";

import { useState, useMemo, useEffect } from "react";
import { Check, Copy, ExternalLink, Flag } from "lucide-react";
import {
  inferLinkKind,
  LINK_KIND_META,
  type LinkItem,
} from "@/lib/types";

type Props = {
  item: LinkItem;
  sectionSlug?: string;
};

const TAG_STYLE: Record<string, string> = {
  免费: "bg-accent-light text-[#3A8B72]",
  开源: "bg-secondary-light text-[#8B4560]",
  推荐: "bg-primary-light text-primary",
  必装: "bg-[#FFE4E4] text-[#9B2C2C]",
  在线: "bg-[#E0F2FE] text-[#075985]",
  本地: "bg-[#F3E8FF] text-[#4A1D96]",
  AI: "bg-primary-light text-primary",
  教程: "bg-secondary-light/60 text-[#8B4560]",
};

function tagStyle(tag: string): string {
  return TAG_STYLE[tag] ?? "bg-[#F1F5F9] text-[#475569]";
}

/* ---------- 图标 ---------- */
const FAVICON_SERVICES = [
  (host: string) => `https://icon.horse/icon/${host}`,
  (host: string) => `https://favicon.cccyun.cc/${host}`,
];

function renderItemIcon(url?: string, customIcon?: string, title = "") {
  if (customIcon) {
    return (
      // 外部站点图标需要原生 onError 降级，不能交给 Next Image 代理。
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={customIcon}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className="h-8 w-8 rounded-lg object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  if (!url) {
    return <HostFallbackIcon host={title} />;
  }
  try {
    const host = new URL(url).hostname;
    return <LazyFavicon host={host} title={title} />;
  } catch {
    return <HostFallbackIcon host={title} />;
  }
}

function HostFallbackIcon({ host }: { host: string }) {
  const letter = host?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-primary"
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

function LazyFavicon({ host, title }: { host: string; title: string }) {
  const [idx, setIdx] = useState(0);
  const src = useMemo(() => FAVICON_SERVICES[idx](host), [host, idx]);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <HostFallbackIcon host={title || host} />;
  }

  return (
    // favicon 服务需要按失败顺序切换，保留原生 img 的 onError。
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      className="h-8 w-8 rounded-lg object-cover"
      onError={() => {
        const next = idx + 1;
        if (next < FAVICON_SERVICES.length) {
          setIdx(next);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

/* ---------- 主组件 ---------- */
export default function LinkCard({ item, sectionSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeReport();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [reportOpen]);

  const primary = item.tag ?? item.tags?.[0] ?? "";
  const extra = (item.tags ?? []).filter((t) => t !== primary);
  const kind = inferLinkKind(item.url || "#", item.tag, sectionSlug);
  const kindMeta = LINK_KIND_META[kind];

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!item.url) return;
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("复制失败，请手动复制");
    }
  }

  function openReport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setReportOpen(true);
  }

  function closeReport() {
    setReportOpen(false);
    setSubmitted(false);
    setNote("");
    setError(null);
  }

  function closeReportOnClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    closeReport();
  }

  async function submitReport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/link-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: item.url,
          title: item.title,
          section: sectionSlug,
          note: note.trim(),
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "提交失败");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <article
        className={[
          "group card card-hover flex min-h-36 flex-col overflow-hidden",
          !item.url ? "opacity-60 pointer-events-none" : "",
        ].join(" ")}
      >
        <a
          href={item.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.title}（在新标签页打开）`}
          className="flex flex-1 items-start gap-3 px-4 pb-3 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
        >
          <div className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5">
            {renderItemIcon(item.url, item.icon, item.title)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-medium text-text transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <ExternalLink
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted transition-colors group-hover:text-primary"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
            {item.description && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">
                {item.description}
              </p>
            )}
          </div>
        </a>

        {/* 标签 + 操作 */}
        <div className="flex items-end justify-between gap-2 border-t border-border/70 px-4 py-2.5">
          <div className="flex flex-wrap gap-1">
            {kindMeta.short !== "外" && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] leading-4 font-medium ${kindMeta.className}`}
                title={kindMeta.label}
              >
                {kindMeta.short}
              </span>
            )}
            {primary && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] leading-4 font-medium ${tagStyle(primary)}`}
              >
                {primary}
              </span>
            )}
            {extra.slice(0, 2).map((t) => (
              <span
                key={t}
                className={`rounded-md px-1.5 py-0.5 text-[10px] leading-4 ${tagStyle(t)}`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={copyLink}
              title="复制链接"
              aria-label="复制链接"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={openReport}
              title="反馈链接失效"
              aria-label="反馈链接失效"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-secondary-light hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
            >
              <Flag className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          {copied ? `${item.title}链接已复制` : ""}
        </span>
      </article>

      {/* 反馈弹窗 */}
      {reportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeReport}
        >
          <div
            className="w-full max-w-md card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="report-title" className="text-lg font-serif font-semibold text-text">
              反馈链接失效
            </h3>
            <p className="mt-1 text-xs text-muted">
              {item.title}
              <br />
              <span className="break-all">{item.url}</span>
            </p>

            {submitted ? (
              <div className="mt-5 rounded-lg border border-amber-200 bg-accent-light px-4 py-3 text-sm text-accent">
                已收到反馈，会尽快处理。谢谢。
              </div>
            ) : (
              <>
                <label
                  htmlFor="report-note"
                  className="mt-5 block text-sm font-medium text-text"
                >
                  说明（可选）
                </label>
                <textarea
                  id="report-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="比如：404、需要校园网但进不去、跳转到错误页面…"
                  className="mt-1 w-full resize-y rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                {error && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeReportOnClick}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-primary hover:text-primary"
              >
                {submitted ? "关闭" : "取消"}
              </button>
              {!submitted && (
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={submitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "提交中…" : "提交"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
