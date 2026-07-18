"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  targetType: string;
  targetId: string;
  initialFavorited?: boolean;
  refreshOnChange?: boolean;
};

export default function FavoriteButton({
  targetType,
  targetId,
  initialFavorited = false,
  refreshOnChange = false,
}: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(() => initialFavorited);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.error?.includes("未登录")) {
          router.push("/login");
        } else {
          setError(json.error ?? "保存失败，请稍后重试");
        }
        return;
      }
      const json = await res.json();
      setFavorited(json.favorited);
      if (refreshOnChange) router.refresh();
    } catch {
      setError("网络连接失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={favorited}
        title={favorited ? "从稍后读移除" : "加入稍后读"}
        className={[
          "motion-press inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-[color,background-color,border-color]",
          favorited
            ? "border-secondary bg-secondary-light text-secondary"
            : "border-border bg-bg text-muted hover:border-secondary hover:text-secondary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        </svg>
        <span aria-live="polite">{loading ? "处理中…" : favorited ? "已保存" : "稍后读"}</span>
      </button>
      {error && <span role="alert" className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
