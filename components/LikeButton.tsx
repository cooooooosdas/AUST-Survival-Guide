"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  targetType: string;
  targetId: string;
  initialLiked?: boolean;
  initialCount?: number;
};

export default function LikeButton({
  targetType,
  targetId,
  initialLiked = false,
  initialCount = 0,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.error?.includes("未登录")) {
          window.location.href = "/login";
        }
        return;
      }
      const json = await res.json();
      setLiked(json.liked);
      if (json.count !== null) setCount(json.count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      className={[
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all duration-200",
        liked
          ? "border-accent bg-accent-light text-accent"
          : "border-border bg-surface text-muted hover:border-accent hover:text-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
      ].join(" ")}
    >
      <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
      <span>{liked ? "已赞" : "点赞"}</span>
      {count > 0 && <span className="text-xs text-muted">({count})</span>}
    </button>
  );
}
