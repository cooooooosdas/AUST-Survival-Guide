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
  groupIcon?: string;
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

function renderItemIcon(icon?: string) {
  if (!icon) return null;
  return (
    <div
      className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

export default function LinkCard({ item, sectionSlug, groupIcon }: Props) {
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
          "group flex items-start gap-3 rounded-xl p-3",
          "bg-surface backdrop-blur-md backdrop-saturate-150",
          "border border-border",
          "shadow-sm transition-all duration-300",
          "hover:-translate-y-0.5",
          "hover:border-primary/30",
          "hover:shadow-md hover:shadow-primary/10",
          "active:translate-y-0 active:scale-[0.99]",
          !item.url ? "opacity-60 pointer-events-none" : "",
        ].join(" ")}
      >
        {renderItemIcon(groupIcon)}
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
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-primary hover:text-primary"
            >
              {copied ? "已复制 ✓" : "复制链接"}
            </button>
            <button
              type="button"
              onClick={openReport}
              title="反馈链接失效"
              aria-label="反馈链接失效"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-secondary hover:text-secondary"
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
            className="w-full max-w-md rounded-xl border border-border bg-bg p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="report-title" className="text-lg font-semibold text-primary">
              反馈链接失效
            </h3>
            <p className="mt-1 text-xs text-muted">
              {item.title}
              <br />
              <span className="break-all">{item.url}</span>
            </p>

            {submitted ? (
              <div className="mt-5 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-primary">
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
                  className="mt-1 w-full rounded-md border border-border bg-bg-alt px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="rounded-md border border-border bg-bg px-4 py-1.5 text-sm text-muted hover:border-primary hover:text-primary"
              >
                {submitted ? "关闭" : "取消"}
              </button>
              {!submitted && (
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={submitting}
                  className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
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
