import { Sparkles, History, Bug, Megaphone, Layers, ListTodo, TrendingUp } from "lucide-react";
import Sparkline from "@/components/Sparkline";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "站点动态" };

type Category = "general" | "high-math" | "software" | "letter" | "feature";

type Changelog = {
  id: number;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  created_at: string;
};

const CATEGORY_META: Record<
  Category,
  { label: string; tint: string; Icon: typeof Sparkles }
> = {
  feature: { label: "新功能", tint: "bg-primary-light text-primary", Icon: Sparkles },
  letter: { label: "学长来信", tint: "bg-accent-light text-accent", Icon: History },
  software: { label: "软件资源", tint: "bg-secondary-light text-secondary", Icon: Layers },
  "high-math": { label: "高数笔记", tint: "bg-secondary-light text-secondary", Icon: ListTodo },
  general: { label: "综合", tint: "bg-bg-alt text-muted", Icon: Megaphone },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function groupByMonth(rows: Changelog[]) {
  const groups: Record<string, Changelog[]> = {};
  for (const row of rows) {
    const key = formatDate(row.created_at).slice(0, 7); // YYYY.MM
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  }
  return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

// 按 ISO 周（YYYY-Www）聚合每周发布数
function buildWeeklySeries(rows: Changelog[], weeks = 12): number[] {
  const buckets: Record<string, number> = {};
  for (const row of rows) {
    const d = new Date(row.created_at);
    const year = d.getFullYear();
    // 简单 ISO 周算法
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil(
      ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
    const key = `${year}-W${String(week).padStart(2, "0")}`;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  // 按时间倒序取最近 N 周，再反转为时间正序
  const sortedKeys = Object.keys(buckets).sort().reverse().slice(0, weeks);
  return sortedKeys.reverse().map((k) => buckets[k] ?? 0);
}

export default async function ChangelogPage() {
  let changelogs: Changelog[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("changelogs")
        .select("id, title, content, category, is_published, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(100);
      changelogs = (data ?? []) as Changelog[];
    } catch {
      /* ignore */
    }
  }

  const monthGroups = groupByMonth(changelogs);
  const weeklySeries = buildWeeklySeries(changelogs, 12);
  const weeklyTotal = weeklySeries.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-border pb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          Changelog · {changelogs.length}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">站点动态</h1>
        <p className="mt-3 text-sm text-muted">
          记录平台的更新、新增和修复，按月倒序。
        </p>
      </header>

      {/* 周发布密度 sparkline —— 仅在有数据时显示 */}
      {weeklyTotal > 0 && (
        <section className="mt-6 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium text-text">
              <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
              近 12 周发布节奏
            </h2>
            <span className="font-mono text-[11px] text-muted">
              共 <span className="text-text">{weeklyTotal}</span> 条 · 平均{" "}
              <span className="text-text">
                {(weeklyTotal / Math.max(weeklySeries.length, 1)).toFixed(1)}
              </span>{" "}
              条/周
            </span>
          </div>
          <Sparkline
            data={weeklySeries}
            width={640}
            height={56}
            className="mt-4 w-full text-primary"
            ariaLabel="近 12 周 changelog 发布量"
          />
        </section>
      )}

      {changelogs.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-border bg-bg-alt p-10 text-center">
          <Bug className="mx-auto mb-3 h-8 w-8 text-muted" strokeWidth={1.5} />
          <p className="text-sm text-muted">暂无更新记录。</p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            首次部署后系统会自动写入
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {monthGroups.map(([month, rows]) => (
            <section key={month}>
              <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">
                {month.replace(".", " 年 ")} 月
              </h2>
              <ul className="space-y-3">
                {rows.map((log) => {
                  const meta =
                    CATEGORY_META[log.category as Category] ?? CATEGORY_META.general;
                  const Icon = meta.Icon;
                  return (
                    <li
                      key={log.id}
                      className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/20"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <time className="font-mono">
                          {formatDate(log.created_at)}
                        </time>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${meta.tint}`}
                        >
                          <Icon className="h-3 w-3" strokeWidth={2} />
                          {meta.label}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif text-base font-medium text-text">
                        {log.title}
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                        {log.content}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}