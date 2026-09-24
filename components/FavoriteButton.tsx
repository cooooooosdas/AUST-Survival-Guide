"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, LogIn } from "lucide-react";

type Props = {
  targetType: string;
  targetId: string;
  currentUserId?: string | null;
  initialFavorited?: boolean;
  refreshOnChange?: boolean;
};

export default function FavoriteButton({
  targetType,
  targetId,
  currentUserId,
  initialFavorited = false,
  refreshOnChange = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [favorited, setFavorited] = useState(() => initialFavorited);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

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
        if (res.status === 401) {
          router.push(loginHref);
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

  if (!currentUserId) {
    return (
      <Link
        href={loginHref}
        className="motion-press inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted hover:border-secondary hover:text-secondary"
        aria-label="登录后加入稍后读"
      >
        <Bookmark className="h-4 w-4" strokeWidth={1.8} />
        <span>稍后读</span>
        <span className="ml-1 inline-flex items-center gap-1 text-xs">
          <LogIn className="h-3 w-3" strokeWidth={2} />
          先登录
        </span>
      </Link>
    );
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
        <Bookmark
          className="h-4 w-4"
          fill={favorited ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
        <span aria-live="polite">
          {loading ? "处理中…" : favorited ? "已保存" : "稍后读"}
        </span>
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
