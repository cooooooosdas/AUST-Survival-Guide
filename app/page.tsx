import Sparkline from "@/components/Sparkline";
import HeroIllustration from "@/components/HeroIllustration";
import Link from "next/link";
import { SECTIONS, type Section } from "@/lib/sections";
import {
  Wrench,
  Server,
  BookOpen,
  AppWindow,
  Sparkles,
  FolderDown,
  CalendarCheck,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Quote,
  Eye,
  Users,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import Leaderboard from "@/components/Leaderboard";
import CommentBoard from "@/components/CommentBoard";
import EditorialShelf from "@/components/EditorialShelf";
import { createClient } from "@/lib/supabase/server";
import { normalizeComments } from "@/lib/comments";
import type { Comment } from "@/lib/types";

async function loadHomeComments() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
  try {
    const supabase = await createClient();
    const [{ data: comments, error: commentsError }, { data: { user } }] = await Promise.all([
      supabase.from("comments_with_author").select("*").eq("target_type", "global").eq("target_id", "main").order("created_at", { ascending: false }).limit(200),
      supabase.auth.getUser(),
    ]);
    if (commentsError) {
      console.error("Failed to load home comments:", commentsError);
      return { comments: [] as Comment[], userId: null as string | null, ready: false };
    }
    return {
      comments: normalizeComments(comments as Partial<Comment>[]),
      userId: user?.id ?? null,
      ready: true,
    };
  } catch (e) {
    console.error("Failed to load home comments:", e);
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
}

type HomeStat = {
  label: string;
  value: string;
};

const FALLBACK_HOME_STATS: HomeStat[] = [
  { label: "访问人次", value: "统计中" },
  { label: "访问人数", value: "统计中" },
  { label: "维护状态", value: "长期" },
];

function formatStatCount(value: number): string {
  if (value <= 0) return "统计中";
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return value.toLocaleString("zh-CN");
}

async function loadHomeStats(): Promise<{
  stats: HomeStat[];
  sparklineData: number[];
  weeklyChange: number | null;
}> {
  const fallback = {
    stats: FALLBACK_HOME_STATS,
    sparklineData: [] as number[],
    weeklyChange: null as number | null,
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: viewRow, error }, { data: recentViews }] = await Promise.all([
      supabase
        .from("site_visit_stats")
        .select("total_views, unique_visitors")
        .maybeSingle(),
      supabase
        .from("content_views")
        .select("created_at")
        .gte("created_at", since)
        .limit(2000),
    ]);

    if (error) {
      console.error("Failed to load home stats:", error);
      return fallback;
    }

    // 按天聚合近 14 天访问量（index 0 = 13 天前, index 13 = 今天）
    const series = Array(14).fill(0) as number[];
    for (const v of recentViews ?? []) {
      const d = new Date(v.created_at);
      const daysAgo = Math.floor(
        (Date.now() - d.getTime()) / 86400000
      );
      if (daysAgo >= 0 && daysAgo < 14) {
        series[13 - daysAgo] = (series[13 - daysAgo] ?? 0) + 1;
      }
    }

    // 本周 vs 上周变化率
    const thisWeek = series.slice(7).reduce((a, b) => a + b, 0);
    const lastWeek = series.slice(0, 7).reduce((a, b) => a + b, 0);
    const weeklyChange =
      lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;

    return {
      stats: [
        {
          label: "访问人次",
          value: formatStatCount(Number(viewRow?.total_views ?? 0)),
        },
        {
          label: "访问人数",
          value: formatStatCount(Number(viewRow?.unique_visitors ?? 0)),
        },
        { label: "维护状态", value: "长期" },
      ],
      sparklineData: series,
      weeklyChange,
    };
  } catch (e) {
    console.error("Failed to load home stats:", e);
    return fallback;
  }
}

const SECTION_ICONS: Record<string, typeof Wrench> = {
  tools: Wrench,
  microservices: Server,
  learn: BookOpen,
  software: AppWindow,
  ai: Sparkles,
  resources: FolderDown,
  checkin: CalendarCheck,
  letters: Mail,
};

const ACCENT_BAR_CLASS: Record<Section["accent"], string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-accent",
};

const ACCENT_TEXT_CLASS: Record<Section["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-accent",
};

const ACCENT_BG_CLASS: Record<Section["accent"], string> = {
  primary: "bg-primary-light",
  secondary: "bg-secondary-light",
  tertiary: "bg-accent-light",
};

const SECTION_Y = "py-14 md:py-20";

const QUICK_LINKS: {
  href: string;
  label: string;
  Icon: typeof Wrench;
}[] = [
  { href: "/tools", label: "找常用工具", Icon: Wrench },
  { href: "/microservices", label: "进学校系统", Icon: Server },
  { href: "/letters", label: "读学长来信", Icon: Mail },
];

export default async function HomePage() {
  const [{ comments, userId, ready }, homeResult] = await Promise.all([
    loadHomeComments(),
    loadHomeStats(),
  ]);
  const { stats: homeStats, sparklineData, weeklyChange } = homeResult;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="guide-hero relative -mx-4 border-b border-border px-4 py-14 sm:-mx-6 sm:px-6 md:py-20 lg:py-24">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="hero-copy-enter">
            {/* mobile 简化版：手绘风的 chip 标识 */}
            <div className="mb-5 flex items-center gap-3 sm:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
                <BookOpen className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-xs leading-relaxed text-text-secondary">
                安理大新生的<span className="font-medium text-text">第一本</span>桌面指南
              </p>
            </div>

            {/* 桌面版：手绘 Hero 装饰 —— 信纸 / 钢笔 / 邮戳 / 树叶 */}
            <div className="mb-6 hidden sm:block">
              <HeroIllustration className="h-28 w-auto text-text-secondary" />
            </div>

            {/* 顶部一行小标识 —— 印刷感印章 */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary shadow-xs">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">AUST Survival Guide</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="hidden text-muted sm:inline">
                给即将到来的你
              </span>
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.14] text-text md:text-6xl lg:text-7xl">
              安理大新生的第一本桌面指南
            </h1>

            {/* 单色分隔线，替代原三色渐变 */}
            <div className="mt-6 mb-7 h-[2px] w-24 bg-text" />

            <div className="max-w-2xl space-y-4 text-base leading-[1.9] text-text-secondary md:text-lg">
              <p>
                去年九月我也对学校、专业和大学生活都没什么把握。这里把常用系统、学习资料、软件工具和踩坑经验整理成一张清楚的索引。
              </p>
              <p>
                不保证替你解决所有问题，但希望你打开它时，能少走几步弯路。
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {QUICK_LINKS.map((link, index) => {
                const Icon = link.Icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "motion-press inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      index === 0
                        ? "border-primary bg-primary text-white shadow-sm hover:bg-primary-hover"
                        : "border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desk note 卡片 —— 重塑视觉 */}
          <div className="hero-note-enter relative hidden lg:block">
            <div className="index-card relative z-10 overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 border-b border-border bg-primary-light/60 px-5 py-3.5">
                <Compass className="h-4 w-4 text-primary" strokeWidth={2} />
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Desk note
                </p>
                <span className="ml-auto rounded-md bg-surface px-2 py-0.5 text-[11px] font-mono text-muted">
                  2026
                </span>
              </div>

              <div className="px-5 py-5">
                <p className="font-serif text-xl font-semibold text-text">
                  开学前先看这张
                </p>

                <div className="mt-4 space-y-2.5">
                  {homeStats.map((item, idx) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-dashed border-border pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="flex items-center gap-2 text-sm text-text-secondary">
                        {idx === 0 ? (
                          <Eye className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
                        ) : idx === 1 ? (
                          <Users className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                        )}
                        {item.label}
                      </span>
                      <span className="font-serif text-base font-semibold tabular-nums text-text">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 14 天访问趋势 —— 真实 content_views 聚合 */}
                <div className="mt-5 rounded-lg border border-border bg-bg/60 px-3 py-2.5">
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span className="font-mono">近 14 天</span>
                    {weeklyChange === null ? (
                      <span className="font-mono text-muted">暂无数据</span>
                    ) : (
                      <span
                        className={
                          weeklyChange >= 0
                            ? "font-mono text-primary"
                            : "font-mono text-secondary"
                        }
                      >
                        {weeklyChange >= 0 ? "↑" : "↓"} {Math.abs(weeklyChange)}%
                      </span>
                    )}
                  </div>
                  {sparklineData.length > 0 && sparklineData.some((v) => v > 0) ? (
                    <Sparkline
                      className="mt-1 w-full"
                      width={228}
                      height={36}
                      data={sparklineData}
                    />
                  ) : (
                    <p className="mt-1 font-mono text-[11px] text-muted">
                      暂无访问数据
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-lg border-l-2 border-primary bg-bg-alt px-3 py-2.5 text-sm leading-relaxed text-text-secondary">
                  <Quote className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                  <span>
                    从「学校微服务」和「工具箱」开始，通常最快能找到你现在需要的入口。
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EditorialShelf />

      <section className={SECTION_Y}>
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                Index
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-text md:text-3xl">
                按你要做的事进入
              </h2>
            </div>
            <span className="text-sm text-muted">内容会继续补齐和校正</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => {
            const Icon = SECTION_ICONS[s.slug] ?? Compass;
            const barClass = ACCENT_BAR_CLASS[s.accent];
            const textClass = ACCENT_TEXT_CLASS[s.accent];
            const bgClass = ACCENT_BG_CLASS[s.accent];
            return (
              <ScrollReveal key={s.slug} delay={60 + i * 50} className="h-full">
                <Link
                  href={s.href}
                  className="card-interactive group relative flex h-full min-h-40 flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-5"
                >
                  {/* 顶部色条 */}
                  <span
                    className={`absolute inset-x-0 top-0 h-0.5 ${barClass} transition-all duration-200 group-hover:h-1`}
                  />

                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgClass} ${textClass}`}
                    >
                      <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="text-base font-semibold text-text transition-colors group-hover:text-primary">
                    {s.title}
                  </div>

                  <div className="text-sm leading-relaxed text-text-secondary">
                    {s.description}
                  </div>

                  <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
                    进入
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className={SECTION_Y}>
        <ScrollReveal>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-semibold text-text md:text-3xl">
              留言区
            </h2>
            <span className="text-sm text-muted">想说点什么都可以</span>
          </div>
          <p className="mb-8 text-sm text-muted">
            吐槽、提问、分享经验。请保持基本礼貌，过激内容会被删掉。
          </p>
        </ScrollReveal>

        <ScrollReveal>
          {ready ? (
            <CommentBoard
              initial={comments}
              targetType="global"
              targetId="main"
              currentUserId={userId}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-bg-alt p-10 text-center">
              <p className="text-sm font-medium text-text">留言区正在准备中</p>
              <p className="mt-2 text-xs text-muted">
                等 Supabase 配置好后，这里就会开放留言功能。
              </p>
            </div>
          )}
        </ScrollReveal>
      </section>

      <section className="pb-12">
        <div className="rounded-2xl border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted">
          <span className="mr-2 font-mono text-accent">—</span>
          本站为站长个人项目，与安徽理工大学（AUST）及任何学院、部门无隶属或合作关系。
          所有内容仅代表个人观点，不代表学校官方立场，仅供参考。
          <Link
            href="/disclaimer"
            className="ml-1 text-primary underline-offset-4 hover:underline"
          >
            查看完整免责声明
          </Link>
        </div>
      </section>
    </div>
  );
}