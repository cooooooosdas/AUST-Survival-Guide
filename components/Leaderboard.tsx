"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeaderboardItem = {
  target_id: string;
  total_views: number;
  title: string;
  href: string;
};

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "letter", label: "学长来信", icon: "📝" },
  { key: "resource", label: "资源下载", icon: "📚" },
];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-alt px-4 py-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-bg animate-pulse" />
      <span className="flex-1 h-4 rounded bg-bg animate-pulse" />
      <span className="shrink-0 w-10 h-4 rounded bg-bg animate-pulse" />
    </div>
  );
}

function SkeletonCategory() {
  return (
    <div>
      <div className="h-5 w-24 rounded bg-bg animate-pulse mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [data, setData] = useState<Record<string, LeaderboardItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/leaderboard")
      .then((r) => r.json())
      .then((json) => {
        setData(json.leaderboard ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 md:py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">🔥 热门推荐</h2>
        <span className="text-sm text-muted">按阅读量排行</span>
      </div>

      {loading ? (
        /* Loading skeleton — 与下方数据区结构一致，避免 CLS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" aria-hidden="true">
          {CATEGORIES.map((cat) => (
            <SkeletonCategory key={cat.key} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => {
            const items = data[cat.key] ?? [];

            return (
              <div key={cat.key}>
                <h3 className="text-base font-medium text-primary mb-4">
                  <span className="border-l-2 border-accent pl-3">
                    {cat.icon} {cat.label}
                  </span>
                </h3>
                {items.length === 0 ? (
                  <p className="text-sm text-muted rounded-lg border border-border bg-bg-alt px-4 py-6 text-center">
                    暂无数据，浏览后这里会显示热门内容
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.slice(0, 5).map((item, i) => (
                      <Link
                        key={item.target_id}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg border border-border bg-bg-alt px-4 py-3 transition-colors hover:border-primary/20"
                      >
                        <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-primary">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-sm text-text truncate">{item.title}</span>
                        <span className="shrink-0 text-xs text-muted">👁 {item.total_views}</span>
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
