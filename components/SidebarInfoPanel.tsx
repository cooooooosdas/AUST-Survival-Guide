"use client";

import { useEffect, useMemo, useState } from "react";

/* ================================================================
   配置区 — 建站起始日期（可按需修改）
   ================================================================ */
const SITE_START_DATE = new Date("2025-09-01");
/* ================================================================ */

const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const QUOTES = [
  /* ---- 中二热血 ---- */
  "我命由我不由天。 —— 哪吒",
  "爆裂吧，现实！粉碎吧，精神！ —— 《魔法少女小圆》",
  "弱小的人才害怕失败，而我从未成功过，又谈何失败？ —— 佚名",
  "站在最高处，俯瞰这个破碎的世界。 —— 《罪恶王冠》",
  "就算是地狱，我也要闯给你看。 —— 佚名",
  "如果结果不如你所愿，那就在尘埃落定前奋力一搏。 —— 佚名",
  "纵有疾风起，人生不言弃。 —— 《诗选》",
  "弱小与无知不是生存的障碍，傲慢才是。 —— 刘慈欣《三体》",
  "凡是到达了的地方，都属于昨天。 —— 汪国真",
  "星辰坠落之处，即是吾等前进之路。 —— 佚名",
  /* ---- 古文短句 ---- */
  "路漫漫其修远兮，吾将上下而求索。 —— 屈原《离骚》",
  "长风破浪会有时，直挂云帆济沧海。 —— 李白《行路难》",
  "山重水复疑无路，柳暗花明又一村。 —— 陆游《游山西村》",
  "落霞与孤鹜齐飞，秋水共长天一色。 —— 王勃《滕王阁序》",
  "人生如逆旅，我亦是行人。 —— 苏轼《临江仙》",
  "纵有千古，横有八荒，前途似海，来日方长。 —— 梁启超《少年中国说》",
  "追风赶月莫停留，平芜尽处是春山。 —— 佚名（宋·欧阳詹《赋得秋江晚渡》化用）",
  "须知少时凌云志，曾许人间第一流。 —— 吴庆坻《题三十小像》",
  "浮云一别后，流水十年间。 —— 韦应物《淮上喜会梁川故人》",
  "玻璃晴朗，橘子辉煌。 —— 北岛《过节》",
];

/* ---------- 小图标（二次元线稿风，14px 统一描边） ---------- */
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

/* ---------- 条目渐变配色 ---------- */
const ITEM_GRADIENTS: Record<string, string> = {
  days: "from-primary-light/80 to-primary/5",
  words: "from-accent-light/80 to-accent/5",
  clock: "from-secondary-light/80 to-secondary/5",
  visits: "from-primary-light/60 to-accent-light/40",
  uptime: "from-secondary-light/60 to-primary-light/40",
  quote: "from-accent-light/60 to-secondary-light/40",
};

const ITEM_LABEL_COLORS: Record<string, string> = {
  days: "text-primary",
  words: "text-accent-hover",
  clock: "text-secondary-hover",
  visits: "text-primary",
  uptime: "text-secondary",
  quote: "text-accent-hover",
};

/* ---------- 工具函数 ---------- */
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

/* ---------- 主组件 ---------- */
export default function SidebarInfoPanel() {
  const [now, setNow] = useState(() => new Date());
  const sessionStart = useMemo(() => Date.now(), []);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [visits, setVisits] = useState<{ today: number; total: number }>({ today: 0, total: 0 });
  const [quote, setQuote] = useState("");

  // 时钟 & 运行时长：每秒刷新
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 访问量（只跑一次）
  useEffect(() => {
    const current = loadVisits();
    const next = { today: current.today + 1, total: current.total + 1 };
    saveVisits(next);
    setVisits(next);
  }, []);

  // 字数（拉一次接口）
  useEffect(() => {
    fetch("/api/stats/word-count", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.resolve({ count: 0 })))
      .then((d) => setWordCount(d.count))
      .catch(() => {});
  }, []);

  // 一言（刷新随机）
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // 建站天数（随时间自然增长，0.5 分钟更新一次即可减少重渲染，每秒也行，这里每秒）
  const siteDays = useMemo(
    () => Math.floor((now.getTime() - SITE_START_DATE.getTime()) / 86400000),
    [now]
  );
  const sessionUptime = useMemo(() => formatDuration(Date.now() - sessionStart), [now]);

  const dateLine = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WEEKDAYS[now.getDay()]}`;
  const timeLine = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  /* ---------- 条目 ---------- */
  type Item = {
    key: string;
    label: string;
    primary: React.ReactNode;
    secondary?: React.ReactNode;
  };

  const items: Item[] = [
    {
      key: "days",
      label: "建站运行天数",
      primary: <>{siteDays.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-80">天</span></>,
    },
    {
      key: "words",
      label: "全站文章总字数",
      primary: <>{wordCount !== null ? wordCount.toLocaleString("zh-CN") : "..."} <span className="text-xs font-normal opacity-80">字</span></>,
    },
    {
      key: "clock",
      label: "电子时钟",
      primary: <span className="tabular-nums">{timeLine}</span>,
      secondary: <span className="text-[11px]">{dateLine}</span>,
    },
    {
      key: "visits",
      label: "访问统计",
      primary: <>{visits.total.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-70">累计</span></>,
      secondary: <>{visits.today} 次今日浏览</>,
    },
    {
      key: "uptime",
      label: "本次停留时长",
      primary: <span className="text-sm">{sessionUptime}</span>,
    },
    {
      key: "quote",
      label: "一言",
      primary: <span className="text-sm italic">“{quote}”</span>,
    },
  ];

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">
        站点信息
      </p>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const grad = ITEM_GRADIENTS[item.key];
          const labelColor = ITEM_LABEL_COLORS[item.key];
          return (
            <li
              key={item.key}
              className={`rounded-xl bg-gradient-to-br ${grad} px-3.5 py-3`}
            >
              <div className="flex items-center gap-2">
                <span className={`opacity-75 ${labelColor}`}>{ICONS[item.key]}</span>
                <span className="text-[11px] font-medium tracking-wide text-muted">
                  {item.label}
                </span>
              </div>
              <p className={`mt-1.5 text-base font-semibold leading-snug ${labelColor}`}>
                {item.primary}
              </p>
              {item.secondary && (
                <p className="mt-0.5 text-[11px] text-muted/80">{item.secondary}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
