"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, LogIn } from "lucide-react";

type Props = {
  targetType: string;
  targetId: string;
  currentUserId?: string | null;
  initialLiked?: boolean;
  initialCount?: number;
};

export default function LikeButton({
  targetType,
  targetId,
  currentUserId,
  initialLiked = false,
  initialCount = 0,
}: Props) {
  const [liked, setLiked] = useState(() => initialLiked);
  const [count, setCount] = useState(() => initialCount);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    if (loading) return;
    setError("");
    setLoading(true);
    setPulse(true);
    setTimeout(() => setPulse(false), 350);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? `操作失败 (${res.status})`);
        return;
      }
      const json = await res.json();
      setLiked(json.liked);
      if (json.count !== null && json.count !== undefined) {
        setCount(json.count);
      } else {
        // 服务端没返 count 时，本地 +1 / -1 估算
        setCount((prev) => prev + (json.liked ? 1 : -1));
      }
    } catch {
      setError("网络连接失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  // 未登录态：直接显示"先登录"引导
  if (currentUserId === null || currentUserId === undefined) {
    return (
      <div className="inline-flex flex-col items-start gap-1">
        <Link
          href="/login"
          className="motion-press inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <Heart className="h-4 w-4" strokeWidth={2} />
          <span>点赞</span>
          <span className="ml-1 inline-flex items-center gap-1 rounded bg-bg-alt px-1.5 py-0.5 text-[10px] text-muted">
            <LogIn className="h-3 w-3" strokeWidth={2} />
            先登录
          </span>
        </Link>
        {error && (
          <span role="alert" className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={liked}
        aria-label={liked ? "取消点赞" : "点赞"}
        className={[
          "motion-press inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-[color,background-color,border-color] duration-200",
          liked
            ? "border-accent bg-accent-light text-accent"
            : "border-border bg-surface text-muted hover:border-accent hover:text-primary",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-300 ${
            pulse ? "scale-125" : "scale-100"
          }`}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={2}
        />
        <span aria-live="polite">
          {loading ? "处理中…" : liked ? "已赞" : "点赞"}
        </span>
        {count > 0 && (
          <span className="font-mono text-xs opacity-70">{count}</span>
        )}
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}