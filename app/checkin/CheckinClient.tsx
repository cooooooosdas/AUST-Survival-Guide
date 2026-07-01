"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CheckinCelebration from "@/components/effects/CheckinCelebration";

const HEATMAP_DAYS = 30;
const SUMMARY_PREFIX = "aust-checkin-summary-";
const RECORDS_PREFIX = "aust-checkin-records-";

type CheckinRecord = { date: string };
type Stats = { totalDays: number; currentStreak: number; maxStreak: number };

function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function loadRecords(): CheckinRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_PREFIX + formatLocalDate(new Date()).slice(0, 7));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords(records: CheckinRecord[]): void {
  const monthKey = formatLocalDate(new Date()).slice(0, 7);
  try { localStorage.setItem(RECORDS_PREFIX + monthKey, JSON.stringify(records)); } catch {}
}

function loadSummary(date: string): string | null {
  try { return localStorage.getItem(SUMMARY_PREFIX + date); } catch { return null; }
}

function saveSummary(date: string, text: string): void {
  try { localStorage.setItem(SUMMARY_PREFIX + date, text); } catch {}
}

function computeStats(records: CheckinRecord[]): Stats {
  const uniqueDates = [...new Set(records.map((r) => r.date))].sort();
  let current = 0;
  let max = 0;
  let streak = 0;
  let prev: string | null = null;
  for (const d of uniqueDates) {
    if (prev) {
      const diff = (new Date(d).getTime() - new Date(prev).getTime()) / 86400000;
      streak = diff === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    max = Math.max(max, streak);
    prev = d;
  }
  const today = formatLocalDate(new Date());
  const yesterday = formatLocalDate(new Date(Date.now() - 86400000));
  const lastDate = uniqueDates[uniqueDates.length - 1];
  if (lastDate === today || lastDate === yesterday) {
    current = streak;
  }
  return { totalDays: uniqueDates.length, currentStreak: current, maxStreak: max };
}

export default function CheckinClient() {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDays: 0, currentStreak: 0, maxStreak: 0 });
  const [checking, setChecking] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [savedSummary, setSavedSummary] = useState<string | null>(null);
  const [editingSummary, setEditingSummary] = useState(false);

  const today = useMemo(() => formatLocalDate(new Date()), []);
  const checkedToday = useMemo(() => records.some((r) => r.date === today), [records, today]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  useEffect(() => {
    if (checkedToday) {
      setSavedSummary(loadSummary(today));
    }
  }, [checkedToday, today]);

  useEffect(() => {
    setStats(computeStats(records));
  }, [records]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCheckin = useCallback(() => {
    if (checkedToday || checking) return;
    setChecking(true);
    // 模拟短延迟，让用户感知到操作
    setTimeout(() => {
      const newRecord = { date: today };
      const next = [...records, newRecord];
      setRecords(next);
      saveRecords(next);
      setCelebrate((c) => c + 1);
      setToast("🎉 今日已打卡");
      setShowSummary(true);
      setSummaryText("");
      setEditingSummary(false);
      setChecking(false);
    }, 350);
  }, [checkedToday, checking, records, today]);

  const handleSaveSummary = useCallback(() => {
    const trimmed = summaryText.trim();
    if (!trimmed) return;
    saveSummary(today, trimmed);
    setSavedSummary(trimmed);
    setShowSummary(false);
    setEditingSummary(false);
    setSummaryText("");
  }, [summaryText, today]);

  const recentDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(formatLocalDate(d));
    }
    return dates;
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {toast && (
        <div
          role="status"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[10001] rounded-full border border-accent/20 bg-accent/95 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 animate-fade-in"
        >
          {toast}
        </div>
      )}
      <CheckinCelebration trigger={celebrate} />

      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Check-in</p>
        <h1 className="mt-3 text-3xl font-serif font-bold text-text">学习打卡</h1>
        <p className="mt-3 text-muted leading-relaxed">
          每天点一下，记录今天的学习。不打卡、不取消，只是每天做个标记。
        </p>
      </div>

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
          <div className="text-4xl mb-3">{checking ? "⏳" : checkedToday ? "✅" : "📝"}</div>
          <p className={["text-lg font-semibold", checkedToday ? "text-accent" : "text-primary"].join(" ")}>
            {checking ? "打卡中…" : checkedToday ? "今日已打卡" : "今日打卡"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {checkedToday ? `${today} · 明天再来` : "点击完成今日学习记录"}
          </p>
        </button>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-serif font-medium text-text mb-4">我的记录</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-serif font-semibold text-text">{stats.totalDays}</p>
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

      {checkedToday && (
        <section className="mb-10">
          <div className="rounded-xl border border-border bg-surface p-5">
            {savedSummary && !editingSummary ? (
              <div>
                <p className="text-xs text-muted mb-1.5">今日心得</p>
                <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{savedSummary}</p>
                <button
                  type="button"
                  onClick={() => { setEditingSummary(true); setSummaryText(savedSummary); }}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  编辑
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-text mb-3">
                  想记录一下今天的学习心得吗？<span className="text-muted">（可选，本地存储）</span>
                </p>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="今天学了什么？有什么收获..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveSummary}
                    className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (savedSummary) setEditingSummary(false);
                      else setShowSummary(false);
                      setSummaryText("");
                    }}
                    className="rounded-lg border border-border px-4 py-1.5 text-sm text-muted hover:text-text transition-colors"
                  >
                    {savedSummary ? "取消编辑" : "跳过"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-serif font-medium text-text mb-4">最近 {HEATMAP_DAYS} 天</h2>
        <Heatmap dates={recentDates} records={records} />
      </section>

      <section className="mt-10">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📝</span>
            <div className="flex-1">
              <h2 className="text-base font-serif font-medium text-text">刷题练习</h2>
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
        const isToday = date === formatLocalDate(new Date());
        const d = parseLocalDate(date);
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
