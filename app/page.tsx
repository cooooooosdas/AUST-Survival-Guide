import Link from "next/link";
import { SECTIONS, type Section } from "@/lib/sections";
import HeroDecoration from "@/components/HeroDecoration";
import ScrollReveal from "@/components/ScrollReveal";
import Leaderboard from "@/components/Leaderboard";
import CommentBoard from "@/components/CommentBoard";
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

type ViewRow = {
  viewer_ip: string | null;
  viewer_id: string | null;
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

async function loadHomeStats(): Promise<HomeStat[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FALLBACK_HOME_STATS;
  }

  try {
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("content_views")
      .select("viewer_ip, viewer_id", { count: "exact" })
      .limit(5000);

    if (error) {
      console.error("Failed to load home stats:", error);
      return FALLBACK_HOME_STATS;
    }

    const uniqueVisitors = new Set<string>();
    for (const row of (data ?? []) as ViewRow[]) {
      if (row.viewer_id) {
        uniqueVisitors.add(`user:${row.viewer_id}`);
      } else if (row.viewer_ip) {
        uniqueVisitors.add(`ip:${row.viewer_ip}`);
      }
    }

    return [
      { label: "访问人次", value: formatStatCount(count ?? data?.length ?? 0) },
      { label: "访问人数", value: formatStatCount(uniqueVisitors.size) },
      { label: "维护状态", value: "长期" },
    ];
  } catch (e) {
    console.error("Failed to load home stats:", e);
    return FALLBACK_HOME_STATS;
  }
}

const BENTO_SPAN: Record<string, "sm:col-span-2" | ""> = {
  tools: "sm:col-span-2",
  microservices: "sm:col-span-2",
  ai: "sm:col-span-2",
};

const ACCENT_BAR_CLASS: Record<Section["accent"], string> = {
  primary: "accent-bar-primary",
  secondary: "accent-bar-secondary",
  tertiary: "accent-bar-tertiary",
};

const ACCENT_HOVER_CLASS: Record<Section["accent"], string> = {
  primary: "group-hover:text-primary",
  secondary: "group-hover:text-secondary",
  tertiary: "group-hover:text-tertiary",
};

const SECTION_Y = "py-14 md:py-20";

const QUICK_LINKS = [
  { href: "/tools", label: "找常用工具" },
  { href: "/microservices", label: "进学校系统" },
  { href: "/letters", label: "读学长来信" },
];

export default async function HomePage() {
  const [{ comments, userId, ready }, homeStats] = await Promise.all([
    loadHomeComments(),
    loadHomeStats(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="guide-hero relative -mx-4 border-b border-border px-4 py-14 sm:-mx-6 sm:px-6 md:py-20 lg:py-24">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div style={{ animation: "fade-up 0.9s var(--ease-out-soft) forwards" }}>
            <div className="campus-stamp mb-7 inline-flex items-center gap-3 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>AUST Survival Guide</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="hidden text-muted sm:inline">给即将到来的你</span>
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.14] text-text md:text-6xl lg:text-7xl">
              安理大新生的第一本桌面指南
            </h1>

            <div className="mt-6 mb-7 h-1 w-32 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-secondary),var(--color-tertiary))]" />

            <div className="max-w-2xl space-y-4 text-base leading-[1.9] text-text-secondary md:text-lg">
              <p>
                去年九月我也对学校、专业和大学生活都没什么把握。这里把常用系统、学习资料、软件工具和踩坑经验整理成一张清楚的索引。
              </p>
              <p>
                不保证替你解决所有问题，但希望你打开它时，能少走几步弯路。
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {QUICK_LINKS.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                    index === 0
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/15 hover:bg-primary-hover"
                      : "border-border bg-surface/80 text-text-secondary hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block" style={{ animation: "fade-in 1.2s ease-out 0.2s both" }}>
            <div className="index-card relative z-10 overflow-hidden rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Desk note</p>
                  <p className="mt-1 font-serif text-xl font-semibold text-text">开学前先看这张</p>
                </div>
                <span className="rounded-md bg-accent-light px-2 py-1 text-xs font-medium text-accent">
                  2026
                </span>
              </div>

              <div className="space-y-3">
                {homeStats.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-bg/70 px-4 py-3">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="font-serif text-lg font-semibold text-text">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-primary-light px-4 py-3 text-sm leading-relaxed text-primary">
                从“学校微服务”和“工具箱”开始，通常最快能找到你现在需要的入口。
              </div>
            </div>

            <div className="pointer-events-none absolute -right-12 -top-12 z-0 opacity-35">
              <HeroDecoration />
            </div>
          </div>
        </div>
      </section>

      <section className={SECTION_Y}>
        <Leaderboard />
      </section>

      <section className={SECTION_Y}>
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Index</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-text md:text-3xl">按你要做的事进入</h2>
            </div>
            <span className="text-sm text-muted">内容会继续补齐和校正</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => {
            const span = BENTO_SPAN[s.slug] ?? "";
            const barClass = ACCENT_BAR_CLASS[s.accent];
            const hoverTextClass = ACCENT_HOVER_CLASS[s.accent];
            return (
              <ScrollReveal key={s.slug} delay={60 + i * 50} className={span}>
                <Link
                  href={s.href}
                  className="index-card card-interactive group relative flex min-h-40 flex-col gap-3 overflow-hidden rounded-2xl p-5 transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-[0.985]"
                >
                  <span className={`absolute inset-x-0 top-0 h-1 ${barClass} opacity-80 transition-all duration-200 group-hover:h-1.5`} />

                  <span className="font-mono text-xs text-muted transition-colors duration-200 group-hover:text-text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className={`pr-6 text-lg font-semibold text-text transition-colors duration-200 ${hoverTextClass}`}>
                    {s.title}
                  </div>

                  <div className="max-w-sm text-sm leading-relaxed text-text-secondary">
                    {s.description}
                  </div>

                  <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-medium text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
                    进入
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="8" x2="13" y2="8" />
                      <polyline points="9 4 13 8 9 12" />
                    </svg>
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
            <h2 className="font-serif text-2xl font-semibold text-text md:text-3xl">留言区</h2>
            <span className="text-sm text-muted">想说点什么都可以</span>
          </div>
          <p className="mb-8 text-sm text-muted">
            吐槽、提问、分享经验。请保持基本礼貌，过激内容会被删掉。
          </p>
        </ScrollReveal>

        <ScrollReveal>
          {ready ? (
            <CommentBoard initial={comments} targetType="global" targetId="main" currentUserId={userId} />
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
        <div className="rounded-2xl border border-border bg-surface/85 px-5 py-4 text-xs leading-relaxed text-muted shadow-sm">
          <span className="mr-2 text-accent">—</span>
          本站为站长个人项目，与安徽理工大学（AUST）及任何学院、部门无隶属或合作关系。
          所有内容仅代表个人观点，不代表学校官方立场，仅供参考。
          <Link href="/disclaimer" className="ml-1 text-primary underline-offset-4 hover:underline">
            查看完整免责声明
          </Link>
        </div>
      </section>
    </div>
  );
}
