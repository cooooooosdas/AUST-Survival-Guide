import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = { title: "站点动态" };

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">站点动态</h1>
      <p className="mt-2 text-sm text-muted">
        记录平台的更新和维护动态。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <ChangelogClient />
      </Suspense>

      {/* 打卡入口 */}
      <div className="mt-10 border-t border-border pt-8">
        <Link
          href="/checkin"
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
        >
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">学习打卡</p>
            <p className="text-xs text-muted mt-0.5">每日任务打卡，养成持续学习习惯</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
