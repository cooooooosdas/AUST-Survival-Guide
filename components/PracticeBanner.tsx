"use client";

import Link from "next/link";
import { Code2, Sparkles, ListChecks, ArrowUpRight } from "lucide-react";

const PRACTICE_ITEMS = [
  {
    title: "洛谷",
    desc: "NOIP/NOI 竞赛题库，从入门到提高全覆盖",
    href: "https://www.luogu.com.cn/",
    icon: Code2,
    tint: "border-secondary/30 bg-secondary-light text-secondary",
  },
  {
    title: "LeetCode",
    desc: "算法面试经典题库，企业真题收录",
    href: "https://leetcode.cn/",
    icon: Sparkles,
    tint: "border-accent/30 bg-accent-light text-accent",
  },
  {
    title: "精选题单",
    desc: "按难度筛选的精选题目列表，点击直接跳转",
    href: "/checkin/practice",
    icon: ListChecks,
    tint: "border-primary/30 bg-primary-light text-primary",
  },
];

export default function PracticeBanner() {
  return (
    <section className="mb-8">
      <div className="rounded-xl border border-border bg-surface p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
            <ListChecks className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-base font-serif font-medium text-text">刷题练习</h2>
            <p className="text-xs text-muted mt-0.5">
              对接洛谷 + LeetCode，选难度后直接跳转刷题
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRACTICE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-lg border bg-bg p-3.5 transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-md border ${item.tint}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-primary transition-colors"
                  strokeWidth={2}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}