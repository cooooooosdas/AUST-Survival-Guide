"use client";

import { useState, useEffect } from "react";
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

function renderItemIcon(url?: string, customIcon?: string) {
  if (customIcon) {
    return (
      <img
        src={customIcon}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="block h-7 w-7 shrink-0 rounded-md object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    // 使用国内可访问的 favicon 服务，避免 google.com/s2/favicons 被 GFW 拦截
    const favicon = `https://api.iowen.cn/favicon/${host}`;
    return (
      <img
        src={favicon}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="block h-7 w-7 shrink-0 rounded-md object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  } catch {
    return null;
  }
}

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
      <a
        href={item.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title}（在新标签页打开）`}
        className={[
          "group card card-hover p-4 flex items-start gap-3",
          !item.url ? "opacity-60 pointer-events-none" : "",
        ].join(" ")}
      >
        {renderItemIcon(item.url, item.icon)}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text group-hover:text-primary truncate">
              {item.title}
            </span>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ${kindMeta.className}`}
              title={kindMeta.label}
            >
              {kindMeta.short}
            </span>
            {primary && (
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ${tagStyle(primary)}`}
              >
                {primary}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
          {extra.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {extra.map((t) => (
                <span
                  key={t}
                  className={`rounded-md px-1.5 py-0.5 text-[10px] leading-4 ${tagStyle(t)}`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={copyLink}
              title="复制链接"
              aria-label="复制链接"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] text-muted transition-all duration-200 hover:border-primary hover:text-primary"
            >
              {copied ? "已复制 ✓" : "复制链接"}
            </button>
            <button
              type="button"
              onClick={openReport}
              title="反馈链接失效"
              aria-label="反馈链接失效"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] text-muted transition-all duration-200 hover:border-secondary hover:text-secondary"
            >
              链接失效？
            </button>
          </div>
        </div>
      </a>

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
