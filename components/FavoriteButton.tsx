"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  targetType: string;
  targetId: string;
  initialFavorited?: boolean;
};

export default function FavoriteButton({
  targetType,
  targetId,
  initialFavorited = false,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/favorite", {
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
      setFavorited(json.favorited);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      className={[
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
        favorited
          ? "border-secondary bg-secondary-light text-secondary"
          : "border-border bg-bg text-muted hover:border-secondary hover:text-secondary",
        "disabled:cursor-not-allowed disabled:opacity-50",
      ].join(" ")}
    >
      <span aria-hidden="true">{favorited ? "★" : "☆"}</span>
      <span>{favorited ? "已收藏" : "收藏"}</span>
    </button>
  );
}
