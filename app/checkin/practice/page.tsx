"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRACTICE_LINKS, DIFFICULTY_COLOR, PLATFORM_LABEL, getDailyQuestionIndex } from "@/lib/practice-links";

type Difficulty = "easy" | "medium" | "hard";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [dailyDiff, setDailyDiff] = useState<Difficulty | "">("");

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

  const dailyQuestion = useMemo(() => {
    if (!dailyDiff) return null;
    const pool = PRACTICE_LINKS.filter((q) => q.difficulty === dailyDiff);
    const idx = getDailyQuestionIndex(dailyDiff, todayStr());
    if (idx < 0 || pool.length === 0) return null;
    return pool[idx];
  }, [dailyDiff]);

  function handleDailyStart(diff: Difficulty) {
    setDailyDiff(diff);
    setDifficulty("");
  }

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
        <h1 className="mt-2 text-2xl font-serif font-semibold text-text">刷题练习</h1>
        <p className="mt-2 text-sm text-muted">精选洛谷 + LeetCode 题目，选难度后直接跳转。</p>
      </div>

      {/* ===== 每日一题 ===== */}
      <section className="mt-8 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 via-bg-alt to-primary/5 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎯</span>
          <div>
            <h2 className="text-base font-serif font-medium text-text">每日一题</h2>
            <p className="text-xs text-muted">每天 0 点自动刷新，今日推荐一题</p>
          </div>
          <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">
            {todayStr().slice(5)}
          </span>
        </div>

        {dailyQuestion ? (
          <a
            href={dailyQuestion.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-lg border border-accent/15 bg-surface p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-md"
          >
            <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-medium ${DIFFICULTY_COLOR[dailyQuestion.difficulty].bg} ${DIFFICULTY_COLOR[dailyQuestion.difficulty].text}`}>
              {DIFFICULTY_COLOR[dailyQuestion.difficulty].label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                {dailyQuestion.title}
              </p>
              <p className="mt-1 text-xs text-muted line-clamp-2">{dailyQuestion.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted">
                  {PLATFORM_LABEL[dailyQuestion.platform]}
                </span>
                {dailyQuestion.tags.map((t) => (
                  <span key={t} className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted">{t}</span>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : dailyDiff ? (
          <div className="py-8 text-center text-sm text-muted">该难度暂无题目</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DIFFICULTY_COLOR) as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDailyStart(d)}
                className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${DIFFICULTY_COLOR[d].bg} ${DIFFICULTY_COLOR[d].text} border-current hover:shadow-sm`}
              >
                <span>{d === "easy" ? "🌱" : d === "medium" ? "🌿" : "🔥"}</span>
                <span>今日 {DIFFICULTY_COLOR[d].label} 一题</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ===== 刷题列表 ===== */}
      <section className="mt-8">
        <h2 className="text-lg font-medium text-text mb-4">刷题列表</h2>

        {/* 难度选择 */}
        <div className="flex flex-wrap gap-2">
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
                onClick={() => setDifficulty(isActive ? "" : d.key)}
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
        <div className="mt-6">
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
      </section>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
