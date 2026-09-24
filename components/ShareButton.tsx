"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type Props = {
  targetType: string;
  targetId: string;
  title: string;
  excerpt?: string;
  url?: string;
};

export default function ShareButton({
  targetType,
  targetId,
  title,
  excerpt,
  url,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink(shareUrl: string): Promise<void> {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        if (!document.execCommand("copy")) throw new Error("Copy failed");
      } finally {
        input.remove();
      }
    }
    setCopied(true);
    setFeedback("链接已复制，可以粘贴分享");
    setFeedbackIsError(false);
    void fetch("/api/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: targetType, target_id: targetId, channel: "copy_link" }),
    }).catch(() => {});
  }

  async function share() {
    if (busy) return;
    setBusy(true);
    setFeedback("");
    setFeedbackIsError(false);
    setCopied(false);
    const shareUrl = url || window.location.href;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title, text: excerpt, url: shareUrl });
          setFeedback("已交给系统分享");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
      await copyLink(shareUrl);
    } catch {
      setFeedback("复制失败，请从地址栏复制链接");
      setFeedbackIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={share}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
        <span>{busy ? "处理中…" : copied ? "已复制" : "分享"}</span>
      </button>
      {feedback && (
        <span role={feedbackIsError ? "alert" : "status"} className="max-w-48 text-xs text-muted">
          {feedback}
        </span>
      )}
    </div>
  );
}
