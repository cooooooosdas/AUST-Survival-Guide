import { Suspense } from "react";
import {
  Eye,
  MessageSquare,
  Sparkles,
  HelpCircle,
  CalendarCheck,
  Files,
  Users,
  ArrowUpRight,
  Rss,
} from "lucide-react";
import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import HandDrawnDivider from "@/components/HandDrawnDivider";
import { requireAdminPage } from "@/lib/admin-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · 概览" };

type AdminStats = {
  totalViews: number;
  uniqueVisitors: number;
  comments: number;
  commentsToday: number;
  questions: number;
  questionsPending: number;
  resources: number;
  checkins: number;
  checkinsToday: number;
  submissions: number;
  submissionsPending: number;
  sevenDays: number[];
};

type RecentItem = {
  id: number | string;
  type: "留言" | "提问" | "投稿" | "打卡";
  content: string;
  user: string;
  at: string;
};

async function loadStats(): Promise<{ stats: AdminStats; recent: RecentItem[] }> {
  const fallback: { stats: AdminStats; recent: RecentItem[] } = {
    stats: {
      totalViews: 0,
      uniqueVisitors: 0,
      comments: 0,
      commentsToday: 0,
      questions: 0,
      questionsPending: 0,
      resources: 0,
      checkins: 0,
      checkinsToday: 0,
      submissions: 0,
      submissionsPending: 0,
      sevenDays: [0, 0, 0, 0, 0, 0, 0],
    },
    recent: [],
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallback;

  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const [
      { data: visitRow },
      { count: comments },
      { count: questions },
      { count: questionsPending },
      { count: resources },
      { count: checkins },
      { count: submissions },
      { count: submissionsPending },
      { data: sevenDaysRows },
      { count: commentsToday },
      { count: checkinsToday },
    ] = await Promise.all([
      supabase.from("site_visit_stats").select("total_views, unique_visitors").maybeSingle(),
      supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("questions").select("*", { count: "exact", head: true }),
      supabase.from("questions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("resources").select("*", { count: "exact", head: true }),
      supabase.from("checkin_records").select("*", { count: "exact", head: true }),
      supabase.from("content_submissions").select("*", { count: "exact", head: true }),
      supabase.from("content_submissions").select("*", { count: "exact", head: true }).eq("status", "submitted"),
      supabase
        .from("daily_practice_stats")
        .select("day, total_attempts")
        .gte("day", sevenDaysAgo),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("created_at", `${today}T00:00:00Z`),
      supabase
        .from("checkin_records")
        .select("*", { count: "exact", head: true })
        .gte("date", today),
    ]);

    // 拼 7 天数组
    const sevenDays: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const found = (sevenDaysRows ?? []).find(
        (r: { day: string }) => r.day === d
      );
      sevenDays.push(found?.total_attempts ?? 0);
    }

    // 最近活动
    const { data: recentComments } = await supabase
      .from("comments_with_author")
      .select("id, content, display_name, created_at, status")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5);

    const recent: RecentItem[] = (recentComments ?? []).map((c) => ({
      id: c.id,
      type: "留言",
      content: c.content.slice(0, 60) + (c.content.length > 60 ? "…" : ""),
      user: c.display_name || "匿名",
      at: new Date(c.created_at).toLocaleString("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return {
      stats: {
        totalViews: visitRow?.total_views ?? 0,
        uniqueVisitors: visitRow?.unique_visitors ?? 0,
        comments: comments ?? 0,
        commentsToday: commentsToday ?? 0,
        questions: questions ?? 0,
        questionsPending: questionsPending ?? 0,
        resources: resources ?? 0,
        checkins: checkins ?? 0,
        checkinsToday: checkinsToday ?? 0,
        submissions: submissions ?? 0,
        submissionsPending: submissionsPending ?? 0,
        sevenDays,
      },
      recent,
    };
  } catch {
    return fallback;
  }
}

function StatCard({
  Icon,
  label,
  value,
  hint,
  tint,
}: {
  Icon: typeof Eye;
  label: string;
  value: string;
  hint?: string;
  tint: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${tint}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        {hint && (
          <span className="font-mono text-[10px] text-muted">{hint}</span>
        )}
      </div>
      <p className="mt-3 font-serif text-2xl font-semibold tabular-nums text-text">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}

function QuickLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Rss;
}) {
  return (
    <Link
      href={href}
      className="motion-press flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-secondary transition-colors hover:border-primary hover:text-primary"
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      <span>{label}</span>
      <ArrowUpRight className="ml-auto h-3 w-3 opacity-50" strokeWidth={2} />
    </Link>
  );
}

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const { stats, recent } = await loadStats();

  return (
    <div>
      <header className="border-b border-border pb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          Admin · overview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">站点总览</h1>
        <p className="mt-2 text-sm text-muted">实时聚合统计 + 最近活动</p>
      </header>

      {/* 核心数字 */}
      <section className="mt-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            Icon={Eye}
            label="累计访问人次"
            value={stats.totalViews.toLocaleString("zh-CN")}
            tint="bg-primary-light text-primary"
          />
          <StatCard
            Icon={Users}
            label="独立访客"
            value={stats.uniqueVisitors.toLocaleString("zh-CN")}
            tint="bg-secondary-light text-secondary"
          />
          <StatCard
            Icon={MessageSquare}
            label="已通过留言"
            value={stats.comments.toLocaleString("zh-CN")}
            hint={`今日 +${stats.commentsToday}`}
            tint="bg-accent-light text-accent"
          />
          <StatCard
            Icon={HelpCircle}
            label="匿名提问"
            value={stats.questions.toLocaleString("zh-CN")}
            hint={stats.questionsPending > 0 ? `${stats.questionsPending} 待回` : "无待回"}
            tint="bg-primary-light text-primary"
          />
          <StatCard
            Icon={Files}
            label="资源文件"
            value={stats.resources.toLocaleString("zh-CN")}
            tint="bg-secondary-light text-secondary"
          />
          <StatCard
            Icon={CalendarCheck}
            label="打卡总次数"
            value={stats.checkins.toLocaleString("zh-CN")}
            hint={`今日 ${stats.checkinsToday}`}
            tint="bg-accent-light text-accent"
          />
          <StatCard
            Icon={Rss}
            label="待审投稿"
            value={stats.submissions.toLocaleString("zh-CN")}
            hint={stats.submissionsPending > 0 ? `${stats.submissionsPending} 待处理` : "已处理"}
            tint="bg-primary-light text-primary"
          />
          <StatCard
            Icon={Sparkles}
            label="本周练习题"
            value={stats.sevenDays.reduce((a, b) => a + b, 0).toString()}
            hint="7 天累计"
            tint="bg-bg-alt text-muted"
          />
        </div>
      </section>

      {/* 7 天趋势 */}
      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium text-text">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} />
            近 7 天刷题量
          </h2>
          <span className="font-mono text-[11px] text-muted">
            总计 {stats.sevenDays.reduce((a, b) => a + b, 0)} 题
          </span>
        </div>
        <Sparkline
          data={stats.sevenDays}
          width={720}
          height={64}
          className="mt-4 w-full text-primary"
          ariaLabel="近 7 天刷题量"
        />
        <HandDrawnDivider
          width={120}
          height={8}
          className="mx-auto mt-4 text-muted"
        />
      </section>

      {/* 快捷管理入口 */}
      <section className="mt-8">
        <h2 className="mb-3 text-[11px] uppercase tracking-widest text-muted">
          快捷管理
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <QuickLink href="/admin/faq" label="FAQ 管理" Icon={HelpCircle} />
          <QuickLink href="/admin/questions" label="提问管理" Icon={HelpCircle} />
          <QuickLink href="/admin/submissions" label="投稿审核" Icon={Files} />
          <QuickLink href="/admin/projects" label="项目管理" Icon={Files} />
        </div>
      </section>

      {/* 最近活动 */}
      <section className="mt-8">
        <h2 className="mb-3 text-[11px] uppercase tracking-widest text-muted">
          最近留言
        </h2>
        {recent.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-bg-alt p-8 text-center text-sm text-muted">
            暂无留言
          </div>
        ) : (
          <ul className="space-y-1.5">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 rounded-md border border-border bg-surface px-3 py-2.5"
              >
                <span className="shrink-0 rounded bg-accent-light px-1.5 py-0.5 font-mono text-[10px] text-accent">
                  {r.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text">{r.content}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted">
                    {r.user} · {r.at}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}