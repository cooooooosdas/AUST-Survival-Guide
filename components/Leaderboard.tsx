"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeaderboardItem = {
  target_type: string;
  target_id: string;
  total_views: number;
  // title and href need to be resolved client-side
};

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "letter", label: "学长来信", icon: "📝" },
  { key: "resource", label: "资源下载", icon: "📚" },
];

// Resolve title/href from static data
function resolveItem(item: LeaderboardItem): { title: string; href: string } | null {
  if (item.target_type === "letter") {
    // Dynamic import to avoid circular
    const letters = [
      { slug: "information-gap", title: "大学最大的差距不是天赋，是信息差" },
      { slug: "start-building", title: "为什么大一就该开始动手做点东西" },
      { slug: "first-week", title: "开学第一周，先把这几件事处理好" },
      { slug: "college-truths", title: "大学四年，这些事你越早知道越好" },
      { slug: "campus-survival", title: "贴吧学长说的那些事：安理入学生存指南" },
      { slug: "ai-as-tutor", title: "把 AI 当家教用：写给不会用 ChatGPT 的同学" },
    ];
    const found = letters.find((l) => l.slug === item.target_id);
    if (found) return { title: found.title, href: `/letters/${found.slug}` };
  }
  // resources need server-side fetch
  return null;
}

export default function Leaderboard() {
  const [data, setData] = useState<Record<string, LeaderboardItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from API
    fetch("/api/stats/leaderboard")
      .then((r) => r.json())
      .then((json) => {
        setData(json.leaderboard ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-10 md:py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">🔥 热门推荐</h2>
        <span className="text-sm text-muted">按阅读量排行</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map((cat) => {
          const items = data[cat.key] ?? [];
          if (items.length === 0) return null;

          return (
            <div key={cat.key}>
              <h3 className="text-base font-medium text-primary mb-4">
                <span className="border-l-2 border-accent pl-3">
                  {cat.icon} {cat.label}
                </span>
              </h3>
              <div className="space-y-2">
                {items.slice(0, 5).map((item, i) => {
                  const resolved = resolveItem(item);
                  if (!resolved) return null;
                  return (
                    <Link
                      key={item.target_id}
                      href={resolved.href}
                      className="flex items-center gap-3 rounded-lg border border-border bg-bg-alt px-4 py-3 transition-colors hover:border-primary/20"
                    >
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm text-text truncate">{resolved.title}</span>
                      <span className="shrink-0 text-xs text-muted">👁 {item.total_views}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
