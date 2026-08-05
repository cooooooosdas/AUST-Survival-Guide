"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

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
  const [liked, setLiked] = useState(() => initialLiked);
  const [count, setCount] = useState(() => initialCount);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  async function toggle() {
    if (loading) return;
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
      aria-label={liked ? "取消点赞" : "点赞"}
      className={[
        "motion-press inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-[color,background-color,border-color] duration-200",
        liked
          ? "border-accent bg-accent-light text-accent"
          : "border-border bg-surface text-muted hover:border-accent hover:text-accent",
        "disabled:cursor-not-allowed disabled:opacity-60",
      ].join(" ")}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-300 ${pulse ? "scale-125" : "scale-100"}`}
        fill={liked ? "currentColor" : "none"}
        strokeWidth={2}
      />
      <span>{liked ? "已赞" : "点赞"}</span>
      {count > 0 && <span className="font-mono text-xs opacity-70">{count}</span>}
    </button>
  );
}