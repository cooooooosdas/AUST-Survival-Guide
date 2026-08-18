"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Sprout,
  Leaf,
  Flame,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  NotebookPen,
  Eraser,
  TrendingUp,
} from "lucide-react";
import Sparkline from "@/components/Sparkline";
import {
  PRACTICE_LINKS,
  DIFFICULTY_COLOR,
  PLATFORM_LABEL,
} from "@/lib/practice-links";

type Difficulty = "easy" | "medium" | "hard";

const HISTORY_KEY = "aust-practice-history-v1";
const HISTORY_LIMIT = 30;

type HistoryEntry = {
  questionId: string;
  difficulty: Difficulty;
  platform: "luogu" | "leetcode";
  title: string;
  result: "solved" | "attempted" | "skipped";
  ts: number;
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(ts).toLocaleDateString("zh-CN");
}

const DIFFICULTY_ICON: Record<Difficulty, typeof Sprout> = {
  easy: Sprout,
  medium: Leaf,
  hard: Flame,
};

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [dailyDiff, setDailyDiff] = useState<Difficulty | "">("");
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [dailyResult, setDailyResult] = useState<HistoryEntry["result"] | null>(null);
  const dailyResultLocked = useRef(false);
  const [weeklyStats, setWeeklyStats] = useState<number[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 拉取服务端最近 7 天统计
  useEffect(() => {
    fetch("/api/practice")
      .then((r) => r.json())
      .then((json) => {
        setIsLoggedIn(!!json.loggedIn);
        const series: number[] = Array.isArray(json.weekly) ? json.weekly : [];
        setWeeklyStats(series);
        setWeeklyTotal(series.reduce((a, b) => a + b, 0));
      })
      .catch(() => {});
  }, []);

  function recordResult(
    q: { id: string; difficulty: Difficulty; platform: "luogu" | "leetcode"; title: string },
    result: HistoryEntry["result"]
  ) {
    const entry: HistoryEntry = {
      questionId: q.id,
      difficulty: q.difficulty,
      platform: q.platform,
      title: q.title,
      result,
      ts: Date.now(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.questionId !== q.id);
      const next = [entry, ...filtered].slice(0, HISTORY_LIMIT);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* quota or disabled */
      }
      return next;
    });

    // 同步到服务端（登录用户）
    fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: q.id,
        platform: q.platform,
        difficulty: q.difficulty,
        result,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        // 提交成功后 refetch 最新 weekly（避免乐观更新与 server 数据漂移）
        return fetch("/api/practice").then((r2) => r2.json());
      })
      .then((json) => {
        const series: number[] = Array.isArray(json.weekly) ? json.weekly : [];
        setWeeklyStats(series);
        setWeeklyTotal(series.reduce((a, b) => a + b, 0));
      })
      .catch(() => {});
  }

  function clearHistory() {
    if (!confirm("确定清空所有刷题记录？")) return;
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  }

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
    if (pool.length === 0) return null;
    // 内联 hash（4 行代码不值得一个 lib export）
    const seed = dailyDiff + todayStr();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    return pool[Math.abs(hash) % pool.length];
  }, [dailyDiff]);

  // 同步每日一题的标记结果（dailyQuestion 变化时重置并同步）
  useEffect(() => {
    if (!dailyQuestion) return;
    dailyResultLocked.current = false;
    const today = history.find((h) => h.questionId === dailyQuestion.id);
    if (!dailyResultLocked.current) {
      setDailyResult(today ? today.result : null);
    }
  }, [dailyQuestion]);

  function handleDailyStart(diff: Difficulty) {
    setDailyDiff(diff);
    setDifficulty("");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/checkin"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        返回打卡
      </Link>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">
          Practice
        </p>
        <h1 className="mt-2 text-2xl font-serif font-semibold text-text">
          刷题练习
        </h1>
        <p className="mt-2 text-sm text-muted">
          精选洛谷 + LeetCode 题目，选难度后直接跳转。
        </p>

        {/* 近 7 天统计 sparkline —— 登录后服务端数据，未登录显示登录提示 */}
        {weeklyStats.length === 7 && weeklyTotal > 0 ? (
          <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <TrendingUp className="h-3 w-3 text-primary" strokeWidth={2} />
              <span className="font-mono">近 7 天</span>
              <span className="text-text">{weeklyTotal} 题</span>
            </div>
            <Sparkline
              data={weeklyStats}
              width={160}
              height={28}
              className="text-primary"
              ariaLabel="近 7 天做题数量"
            />
          </div>
        ) : isLoggedIn === false ? (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-dashed border-border bg-bg-alt px-4 py-2.5 text-xs text-muted">
            <TrendingUp className="h-3 w-3 text-muted" strokeWidth={2} />
            <span>
              登录后这里会显示你{" "}
              <span className="font-mono text-text">近 7 天</span> 的做题统计
            </span>
            <Link
              href="/login"
              className="ml-auto text-primary transition-colors hover:text-primary-hover"
            >
              登录 →
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-dashed border-border bg-bg-alt px-4 py-2.5 text-xs text-muted">
            <TrendingUp className="h-3 w-3 text-muted" strokeWidth={2} />
            <span>
              还没有做题记录，今天做一题就会出现在这里
            </span>
          </div>
        )}
      </div>

      {/* ===== 每日一题 ===== */}
      <section className="mt-8 rounded-xl border border-border bg-surface p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
            <Target className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-base font-serif font-medium text-text">
              每日一题
            </h2>
            <p className="text-xs text-muted">
              每天 0 点自动刷新，今日推荐一题
            </p>
          </div>
          <span className="ml-auto rounded-full border border-accent/30 bg-accent-light px-2 py-0.5 font-mono text-[10px] text-accent">
            {todayStr().slice(5)}
          </span>
        </div>

        {dailyQuestion ? (
          <div className="rounded-lg border border-accent/20 bg-bg/40 p-4">
            <div className="flex items-start gap-4">
              <span
                className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${DIFFICULTY_COLOR[dailyQuestion.difficulty].bg} ${DIFFICULTY_COLOR[dailyQuestion.difficulty].text}`}
              >
                {DIFFICULTY_COLOR[dailyQuestion.difficulty].label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">
                  {dailyQuestion.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {dailyQuestion.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted">
                    {PLATFORM_LABEL[dailyQuestion.platform]}
                  </span>
                  {dailyQuestion.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <a
                href={dailyQuestion.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { dailyResultLocked.current = true; recordResult(dailyQuestion, "attempted"); }}
                className="motion-press inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                开始挑战
              </a>
              <button
                type="button"
                onClick={() => recordResult(dailyQuestion, "solved")}
                disabled={dailyResult === "solved"}
                className="motion-press inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent-light px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent-light/70 disabled:cursor-default disabled:opacity-60"
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                做出来了
              </button>
              <button
                type="button"
                onClick={() => recordResult(dailyQuestion, "skipped")}
                disabled={dailyResult === "skipped"}
                className="motion-press inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                跳过
              </button>
              {dailyResult && (
                <span className="ml-auto font-mono text-[11px] text-muted">
                  已标记 · {dailyResult === "solved" ? "完成" : dailyResult === "attempted" ? "尝试中" : "跳过"}
                </span>
              )}
            </div>
          </div>
        ) : dailyDiff ? (
          <div className="py-8 text-center text-sm text-muted">
            该难度暂无题目
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DIFFICULTY_COLOR) as Difficulty[]).map((d) => {
              const Icon = DIFFICULTY_ICON[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDailyStart(d)}
                  className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${DIFFICULTY_COLOR[d].bg} ${DIFFICULTY_COLOR[d].text} border-current hover:shadow-sm`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  今日 {DIFFICULTY_COLOR[d].label} 一题
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== 刷题历史 ===== */}
      {history.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-medium text-text">
              <NotebookPen className="h-4 w-4 text-primary" strokeWidth={2} />
              刷题记录
              <span className="rounded-full border border-border bg-bg-alt px-1.5 py-0.5 font-mono text-[10px] text-muted">
                {history.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-red-600"
            >
              <Eraser className="h-3 w-3" strokeWidth={2} />
              清空
            </button>
          </div>
          <ul className="space-y-1.5">
            {history.slice(0, 5).map((h) => {
              const ResultIcon =
                h.result === "solved"
                  ? CheckCircle2
                  : h.result === "attempted"
                  ? XCircle
                  : RotateCcw;
              const resultColor =
                h.result === "solved"
                  ? "text-accent"
                  : h.result === "attempted"
                  ? "text-secondary"
                  : "text-muted";
              return (
                <li
                  key={`${h.questionId}-${h.ts}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <ResultIcon
                    className={`h-4 w-4 shrink-0 ${resultColor}`}
                    strokeWidth={2}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-text">{h.title}</p>
                    <p className="font-mono text-[10px] text-muted">
                      {PLATFORM_LABEL[h.platform]} · {DIFFICULTY_COLOR[h.difficulty].label} · {formatRelative(h.ts)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ===== 刷题列表 ===== */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-text">刷题列表</h2>

        {/* 难度选择 */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "easy" as Difficulty, label: "简单" },
              { key: "medium" as Difficulty, label: "中等" },
              { key: "hard" as Difficulty, label: "困难" },
            ]
          ).map((d) => {
            const color = DIFFICULTY_COLOR[d.key];
            const Icon = DIFFICULTY_ICON[d.key];
            const isActive = difficulty === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setDifficulty(isActive ? "" : d.key)}
                className={[
                  "flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? `${color.bg} ${color.text} border-current shadow-sm`
                    : "border-border text-muted hover:border-primary/50 hover:text-primary",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span>{color.label}</span>
                {isActive && (
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 font-mono text-[10px]">
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
              <NotebookPen
                className="mx-auto mb-3 h-12 w-12 text-muted/50"
                strokeWidth={1.5}
              />
              <p className="text-sm text-muted">选择难度，查看精选题目。</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <NotebookPen
                className="mx-auto mb-3 h-12 w-12 text-muted/50"
                strokeWidth={1.5}
              />
              <p className="text-sm text-muted">该难度暂无题目。</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(["luogu", "leetcode"] as const).map((platform) => {
                const items = grouped[platform];
                if (!items || items.length === 0) return null;
                return (
                  <section key={platform}>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text">
                      <span className="rounded-lg border border-border bg-bg-alt px-2 py-0.5 text-xs">
                        {PLATFORM_LABEL[platform]}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {items.length} 题
                      </span>
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
                          <ArrowUpRight
                            className="mt-0.5 h-5 w-5 shrink-0 text-muted/40 transition-colors group-hover:text-primary"
                            strokeWidth={2}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text transition-colors group-hover:text-primary">
                              {q.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-muted">
                              {q.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {q.tags.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted"
                                >
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