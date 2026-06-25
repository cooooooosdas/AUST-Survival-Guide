"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRACTICE_LINKS, DIFFICULTY_COLOR, PLATFORM_LABEL } from "@/lib/practice-links";

type Difficulty = "easy" | "medium" | "hard" | "";

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("");

  const filtered = useMemo(() => {
    if (!difficulty) return [];
    return PRACTICE_LINKS.filter((q) => q.difficulty === difficulty);
  }, [difficulty]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof PRACTICE_LINKS> = { luogu: [], leetcode: [] };
    for (const q of filtered) {
      if (map[q.platform]) map[q.platform].push(q);
    }
    return map;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/checkin" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        返回打卡
      </Link>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Practice</p>
        <h1 className="mt-2 text-2xl font-semibold text-primary">刷题练习</h1>
        <p className="mt-2 text-sm text-muted">精选洛谷 + LeetCode 题目，选难度后直接跳转。</p>
      </div>

      {/* 难度选择 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { key: "easy" as Difficulty, label: "简单", emoji: "🌱" },
          { key: "medium" as Difficulty, label: "中等", emoji: "🌿" },
          { key: "hard" as Difficulty, label: "困难", emoji: "🔥" },
        ].map((d) => {
          const color = DIFFICULTY_COLOR[d.key];
          const isActive = difficulty === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setDifficulty(d.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? `${color.bg} ${color.text} border-current shadow-sm`
                  : "border-border text-muted hover:border-primary/50 hover:text-primary"
              )}
            >
              <span>{d.emoji}</span>
              <span>{color.label}</span>
              {isActive && (
                <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px]">
                  {filtered.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 题目列表 */}
      <div className="mt-8">
        {!difficulty ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">📝</p>
            <p className="text-sm text-muted">选择难度，查看精选题目。</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">😅</p>
            <p className="text-sm text-muted">该难度暂无题目。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(["luogu", "leetcode"] as const).map((platform) => {
              const items = grouped[platform];
              if (!items || items.length === 0) return null;
              return (
                <section key={platform}>
                  <h3 className="text-sm font-medium text-text mb-3 flex items-center gap-2">
                    <span className="rounded-lg bg-bg-alt border border-border px-2 py-0.5 text-xs">
                      {PLATFORM_LABEL[platform]}
                    </span>
                    <span className="text-muted text-xs">{items.length} 题</span>
                  </h3>
                  <div className="grid gap-3">
                    {items.map((q) => (
                      <a
                        key={q.id}
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted/40 transition-colors group-hover:text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                            {q.title}
                          </p>
                          <p className="mt-1 text-xs text-muted line-clamp-2">{q.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {q.tags.map((t) => (
                              <span key={t} className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
