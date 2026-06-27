"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CheckinRecord = { task_id: number; date: string; created_at: string };
type Stats = {
  totalDays: number;
  currentStreak: number;
  maxStreak: number;
};

const HEATMAP_DAYS = 30;

export default function CheckinClient() {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const checkedToday = useMemo(
    () => records.some((r) => r.date === today),
    [records, today]
  );

  useEffect(() => {
    async function load() {
      const [recordsRes, statsRes] = await Promise.all([
        fetch("/api/checkin"),
        fetch("/api/checkin/stats"),
      ]);
      if (recordsRes.ok) setRecords(await recordsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      setLoading(false);
    }
    load();
  }, []);

  async function handleCheckin() {
    if (checkedToday || checking) return;
    setChecking(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      if (res.ok) {
        const json = await res.json();
        setRecords((prev) => [...prev, json.record]);
        if (stats) {
          setStats({
            ...stats,
            totalDays: stats.totalDays + 1,
            currentStreak: json.streak.current,
            maxStreak: Math.max(stats.maxStreak, json.streak.current),
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  }

  const recentDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

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
          每天点一下，记录今天的学习。不打卡、不取消，只是每天做个标记。
        </p>
      </div>

      {/* 今日打卡按钮 */}
      <section className="mb-10">
        <button
          type="button"
          onClick={handleCheckin}
          disabled={checkedToday || checking}
          className={[
            "w-full rounded-2xl border px-6 py-10 text-center transition-all duration-300",
            checkedToday
              ? "border-accent/30 bg-accent/5 cursor-default"
              : "border-border bg-surface hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 active:scale-[0.99]",
          ].join(" ")}
        >
          <div className="text-4xl mb-3">{checkedToday ? "✅" : "📝"}</div>
          <p className={["text-lg font-semibold", checkedToday ? "text-accent" : "text-primary"].join(" ")}>
            {checking
              ? "打卡中…"
              : checkedToday
                ? "今日已打卡"
                : "今日打卡"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {checkedToday
              ? `${today} · 明天再来`
              : "点击完成今日学习记录"}
          </p>
        </button>
      </section>

      {/* 统计概览 */}
      {stats && (
        <section className="mb-10">
          <h2 className="text-base font-medium text-primary mb-4">我的记录</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-semibold text-primary">{stats.totalDays}</p>
              <p className="text-xs text-muted mt-1">累计打卡</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-semibold text-accent">{stats.currentStreak}</p>
              <p className="text-xs text-muted mt-1">连续天数</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-semibold text-secondary">{stats.maxStreak}</p>
              <p className="text-xs text-muted mt-1">最长连续</p>
            </div>
          </div>
        </section>
      )}

      {/* 热力图 */}
      <section>
        <h2 className="text-base font-medium text-primary mb-4">最近 {HEATMAP_DAYS} 天</h2>
        <Heatmap dates={recentDates} records={records} />
      </section>

      {/* 刷题练习入口 */}
      <section className="mt-10">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📝</span>
            <div className="flex-1">
              <h2 className="text-base font-medium text-primary">刷题练习</h2>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                选择题 + 编程题，支持简单 / 中等 / 困难三档难度，随机出题。
              </p>
              <Link
                href="/checkin/practice"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
              >
                开始刷题
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
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
  const dateSet = useMemo(() => new Set(records.map((r) => r.date)), [records]);

  return (
    <div className="flex flex-wrap gap-1.5">
      {dates.map((date) => {
        const done = dateSet.has(date);
        const isToday = date === new Date().toISOString().split("T")[0];
        const d = new Date(date + "T00:00:00");
        const label = `${d.getMonth() + 1}/${d.getDate()}`;

        return (
          <div
            key={date}
            title={`${date} · ${done ? "已打卡" : "未打卡"}`}
            className={[
              "flex flex-col items-center rounded-lg border px-2 py-1.5 min-w-[44px]",
              done
                ? "border-accent/30 bg-accent/10"
                : "border-border bg-bg-alt",
              isToday && "ring-1 ring-primary/30",
            ].join(" ")}
          >
            <span className="text-[10px] text-muted">{label}</span>
            <span className={["text-xs font-semibold mt-0.5", done ? "text-accent" : "text-muted/40"].join(" ")}>
              {done ? "✓" : "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
