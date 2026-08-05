import { Sparkles, History, Bug, Megaphone, Layers, ListTodo } from "lucide-react";
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