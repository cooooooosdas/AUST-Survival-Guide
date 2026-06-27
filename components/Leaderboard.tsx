"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeaderboardItem = {
  target_id: string;
  total_views: number;
  title: string;
  href: string;
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "letter", label: "学长来信" },
  { key: "resource", label: "资源下载" },
];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <span className="shrink-0 w-8 h-8 rounded-lg bg-bg-alt animate-pulse" />
      <span className="flex-1 h-4 rounded bg-bg-alt animate-pulse" />
      <span className="shrink-0 w-12 h-4 rounded bg-bg-alt animate-pulse" />
    </div>
  );
}

export default function Leaderboard() {
  const [data, setData] = useState<Record<string, LeaderboardItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/stats/leaderboard")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        setData(json.leaderboard ?? {});
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load leaderboard:", e);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-10 md:py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-serif font-semibold text-text">热门推荐</h2>
        <span className="text-sm text-muted">按阅读量排行</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10" aria-hidden="true">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <h3 className="text-base font-medium text-text mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full" />
                {cat.label}
              </h3>
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {CATEGORIES.map((cat) => {
            const items = data[cat.key] ?? [];

            return (
              <div key={cat.key}>
                <h3 className="text-base font-medium text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-accent rounded-full" />
                  {cat.label}
                </h3>
                {error ? (
                  <div className="rounded-xl border border-dashed border-border bg-bg-alt px-4 py-8 text-center">
                    <p className="text-sm text-muted">加载失败</p>
                    <button
                      type="button"
                      onClick={() => {
                        setError(false);
                        setLoading(true);
                        fetch("/api/stats/leaderboard")
                          .then((r) => r.json())
                          .then((json) => {
                            setData(json.leaderboard ?? {});
                            setLoading(false);
                          })
                          .catch(() => {
                            setError(true);
                            setLoading(false);
                          });
                      }}
                      className="mt-3 text-xs text-primary hover:underline"
                    >
                      点击重试
                    </button>
                  </div>
                ) : items.length === 0 ? (
                  <p className="text-sm text-muted rounded-xl border border-dashed border-border bg-bg-alt px-4 py-8 text-center">
                    暂无数据，浏览后这里会显示热门内容
                  </p>
                ) : (
                  <div>
                    {items.slice(0, 5).map((item, i) => (
                      <Link
                        key={item.target_id}
                        href={item.href}
                        className="group flex items-center gap-4 py-3 border-b border-border last:border-b-0 transition-colors hover:bg-bg-alt/60"
                      >
                        <span className="shrink-0 w-8 text-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-serif font-semibold ${
                            i === 0 ? "bg-amber-100 text-amber-700" :
                            i === 1 ? "bg-stone-100 text-stone-600" :
                            i === 2 ? "bg-orange-50 text-orange-700" :
                            "text-muted"
                          }`}>
                            {i + 1}
                          </span>
                        </span>
                        <span className="flex-1 text-sm text-text group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted tabular-nums">
                          {item.total_views.toLocaleString("zh-CN")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
