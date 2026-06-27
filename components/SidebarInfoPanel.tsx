"use client";

import { useEffect, useMemo, useState } from "react";
import { QUOTES, SITE_START_DATE } from "@/content/quotes";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const ICONS: Record<string, React.ReactNode> = {
  days: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="14" height="12" rx="2" />
      <line x1="1" y1="6" x2="15" y2="6" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
    </svg>
  ),
  words: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 1L15 5L5 15L1 14L11 1Z" />
      <polyline points="9 3 13 7" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="8 4.5 8 8 10.5 10" />
    </svg>
  ),
  visits: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8C3 4 5 2 8 2s5 2 7 6-2 4-5 6-5 2-8 6" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ),
  uptime: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 1 2 9 9 9 7 15 14 7 9 7 11 1" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2H14V11C14 12 13 13 12 13H5L2 15V2Z" />
      <line x1="6" y1="5.5" x2="10" y2="5.5" />
      <line x1="6" y1="8.5" x2="9" y2="8.5" />
    </svg>
  ),
};

const ITEM_COLORS: Record<string, string> = {
  days: "text-accent",
  words: "text-accent",
  clock: "text-primary",
  visits: "text-primary",
  uptime: "text-primary",
  quote: "text-accent",
};

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (d > 0) parts.push(`${d} 天`);
  if (h > 0 || d > 0) parts.push(`${h} 时`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m} 分`);
  parts.push(`${sec} 秒`);
  return parts.join(" ");
}

function loadVisits(): { today: number; total: number } {
  try {
    const raw = localStorage.getItem("aust_visits");
    if (!raw) return { today: 0, total: 0 };
    const v = JSON.parse(raw);
    const today = new Date().toDateString();
    if (v.date !== today) {
      return { today: 0, total: v.total ?? 0 };
    }
    return { today: v.today ?? 0, total: v.total ?? 0 };
  } catch {
    return { today: 0, total: 0 };
  }
}

function saveVisits(v: { today: number; total: number }) {
  try {
    localStorage.setItem("aust_visits", JSON.stringify({ ...v, date: new Date().toDateString() }));
  } catch {
    // quota exceeded — ignore
  }
}

export default function SidebarInfoPanel() {
  const [now, setNow] = useState(() => new Date());
  const sessionStart = useMemo(() => Date.now(), []);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [visits, setVisits] = useState<{ today: number; total: number }>({ today: 0, total: 0 });
  const [quote, setQuote] = useState(() => {
    const idx = Math.floor((Date.now() - SITE_START_DATE.getTime()) / 86400000) % QUOTES.length;
    return QUOTES[idx];
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const current = loadVisits();
    const next = { today: current.today + 1, total: current.total + 1 };
    saveVisits(next);
    setVisits(next);
  }, []);

  useEffect(() => {
    fetch("/api/stats/word-count", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.resolve({ count: 0 })))
      .then((d) => setWordCount(d.count))
      .catch((e) => console.error("Failed to load word count:", e));
  }, []);

  useEffect(() => {
    const idx = Math.floor((now.getTime() - SITE_START_DATE.getTime()) / 86400000) % QUOTES.length;
    setQuote(QUOTES[idx]);
  }, [now]);

  const siteDays = useMemo(
    () => Math.floor((now.getTime() - SITE_START_DATE.getTime()) / 86400000),
    [now]
  );
  const sessionUptime = useMemo(() => formatDuration(Date.now() - sessionStart), [now]);

  const dateLine = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WEEKDAYS[now.getDay()]}`;
  const timeLine = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  type Item = {
    key: string;
    label: string;
    primary: React.ReactNode;
    secondary?: React.ReactNode;
  };

  const items: Item[] = [
    { key: "days", label: "建站运行天数", primary: <>{siteDays.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-70">天</span></> },
    { key: "words", label: "全站文章总字数", primary: <>{wordCount !== null ? wordCount.toLocaleString("zh-CN") : "..."} <span className="text-xs font-normal opacity-70">字</span></> },
    { key: "clock", label: "电子时钟", primary: <span className="tabular-nums text-base font-medium">{timeLine}</span>, secondary: <span className="text-[11px]">{dateLine}</span> },
    { key: "visits", label: "访问统计", primary: <>{visits.total.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-70">累计</span></>, secondary: <>{visits.today} 次今日浏览</> },
    { key: "uptime", label: "本次停留时长", primary: <span className="text-sm">{sessionUptime}</span> },
    { key: "quote", label: "一言", primary: <span className="text-sm italic text-text-secondary">"{quote}"</span> },
  ];

  return (
    <div>
      <p className="mb-4 text-xs font-medium tracking-widest text-muted uppercase">
        站点信息
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const color = ITEM_COLORS[item.key];
          return (
            <div key={item.key} className="rounded-xl border border-border bg-surface px-4 py-3.5">
              <div className="flex items-center gap-1.5">
                <span className={`opacity-60 ${color}`}>{ICONS[item.key]}</span>
                <span className="text-[11px] font-medium tracking-wide text-muted">{item.label}</span>
              </div>
              <p className={`mt-1.5 text-sm font-semibold leading-snug ${color}`}>{item.primary}</p>
              {item.secondary && <p className="mt-0.5 text-[11px] text-muted">{item.secondary}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
