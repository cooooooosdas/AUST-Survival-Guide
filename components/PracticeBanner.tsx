"use client";

import Link from "next/link";

const PRACTICE_ITEMS = [
  {
    title: "洛谷",
    desc: "NOIP/NOI 竞赛题库，从入门到提高全覆盖",
    href: "https://www.luogu.com.cn/",
    icon: "📘",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    title: "LeetCode",
    desc: "算法面试经典题库，企业真题收录",
    href: "https://leetcode.cn/",
    icon: "⚡",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    title: "精选题单",
    desc: "按难度筛选的精选题目列表，点击直接跳转",
    href: "/checkin/practice",
    icon: "📝",
    color: "bg-accent/10 text-[#3A8B72] border-accent/20",
  },
];

export default function PracticeBanner() {
  return (
    <section className="mb-8">
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-bg-alt to-accent/5 p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📝</span>
          <div>
            <h2 className="text-base font-semibold text-primary">刷题练习</h2>
            <p className="text-xs text-muted mt-0.5">对接洛谷 + LeetCode，选难度后直接跳转刷题</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRACTICE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-lg border bg-surface p-3.5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
            >
              <span className={`text-lg rounded-md border px-2 py-1 ${item.color}`}>
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted mt-0.5 line-clamp-1">{item.desc}</p>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
