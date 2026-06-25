"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: "primary" | "accent" | "secondary";
  is_active: boolean;
};

type CheckinRecord = { task_id: number; date: string };
type Stats = {
  taskStreaks: Record<number, { current: number; max: number; total: number }>;
  totalCheckins: number;
  uniqueDays: number;
};

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  accent: { bg: "bg-accent/10", text: "text-[#3A8B72]" },
  secondary: { bg: "bg-secondary/10", text: "text-[#8B4560]" },
};

export default function CheckinClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState<number | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    async function load() {
      const [tasksRes, recordsRes, statsRes] = await Promise.all([
        fetch("/api/checkin-tasks"),
        fetch("/api/checkin"),
        fetch("/api/checkin/stats"),
      ]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.filter((t: Task) => t.is_active));
      }
      if (recordsRes.ok) {
        setRecords(await recordsRes.json());
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  const checkedToday = useMemo(() => {
    const set = new Set(records.filter((r) => r.date === today).map((r) => r.task_id));
    return set;
  }, [records, today]);

  const recentDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

  async function checkin(taskId: number) {
    if (checkedToday.has(taskId)) return;
    setCheckingId(taskId);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, date: today }),
      });
      if (res.ok) {
        setRecords((prev) => [...prev, { task_id: taskId, date: today }]);
        if (stats) {
          const taskStreaks = { ...stats.taskStreaks };
          const existing = taskStreaks[taskId] || { current: 0, max: 0, total: 0 };
          taskStreaks[taskId] = {
            current: existing.current + 1,
            max: Math.max(existing.max, existing.current + 1),
            total: existing.total + 1,
          };
          setStats({
            ...stats,
            taskStreaks,
            totalCheckins: stats.totalCheckins + 1,
            uniqueDays: today === (records[0]?.date || today) ? stats.uniqueDays : stats.uniqueDays + 1,
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setCheckingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-muted">加载中…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Check-in</p>
        <h1 className="mt-3 text-3xl font-semibold text-primary">学习打卡</h1>
        <p className="mt-3 text-muted leading-relaxed">
          每天完成学习任务后点一下，养成持续学习的好习惯。
        </p>
      </div>

      {/* 统计概览 */}
      {stats && (
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-semibold text-primary">{stats.uniqueDays}</p>
            <p className="text-xs text-muted mt-1">累计打卡天数</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-semibold text-accent">{stats.totalCheckins}</p>
            <p className="text-xs text-muted mt-1">累计打卡次数</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-semibold text-secondary">
              {Math.max(...Object.values(stats.taskStreaks).map((s) => s.max), 0)}
            </p>
            <p className="text-xs text-muted mt-1">最长连续天数</p>
          </div>
        </div>
      )}

      {/* 任务列表 */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-text mb-4">今日任务</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tasks.map((task) => {
            const colors = COLOR_MAP[task.color] || COLOR_MAP.primary;
            const isDone = checkedToday.has(task.id);
            const streak = stats?.taskStreaks[task.id];
            return (
              <div
                key={task.id}
                className={cn(
                  "rounded-xl border p-5 transition-all duration-200",
                  isDone
                    ? "border-accent/30 bg-accent/5"
                    : "border-border bg-surface hover:border-primary/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{task.icon}</span>
                    <div>
                      <h3 className={cn("text-sm font-medium", isDone ? "text-accent" : "text-text")}>
                        {task.name}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-muted mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>
                  {isDone && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* 连续打卡信息 */}
                {streak && streak.current > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted">
                    <span className={cn("rounded-full px-2 py-0.5 font-medium", colors.bg, colors.text)}>
                      连续 {streak.current} 天
                    </span>
                    <span>· 最长 {streak.max} 天 · 共 {streak.total} 次</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => checkin(task.id)}
                  disabled={isDone || checkingId === task.id}
                  className={cn(
                    "mt-3 w-full rounded-lg py-2 text-sm font-medium transition-all duration-200",
                    isDone
                      ? "bg-accent/10 text-accent cursor-default"
                      : "bg-primary text-white hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
                  )}
                >
                  {checkingId === task.id ? "打卡中…" : isDone ? "今日已打卡 ✓" : "打卡"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 最近 14 天热力图 */}
      <section>
        <h2 className="text-lg font-medium text-text mb-4">最近 14 天</h2>
        <Heatmap dates={recentDates} records={records} />
      </section>
    </div>
  );
}

function Heatmap({
  dates,
  records,
}: {
  dates: string[];
  records: CheckinRecord[];
}) {
  const dateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      map.set(r.date, (map.get(r.date) || 0) + 1);
    }
    return map;
  }, [records]);

  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => {
        const count = dateCounts.get(date) || 0;
        const isToday = date === new Date().toISOString().split("T")[0];
        const d = new Date(date + "T00:00:00");
        const label = `${d.getMonth() + 1}/${d.getDate()}`;

        return (
          <div
            key={date}
            className={cn(
              "flex flex-col items-center rounded-lg border px-2.5 py-2 min-w-[48px]",
              count > 0
                ? "border-accent/30 bg-accent/10"
                : "border-border bg-bg-alt",
              isToday && "ring-1 ring-primary/30"
            )}
          >
            <span className="text-[10px] text-muted">{label}</span>
            <span className={cn("text-sm font-semibold mt-0.5", count > 0 ? "text-accent" : "text-muted/50")}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
