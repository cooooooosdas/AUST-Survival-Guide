import Link from "next/link";
import { SECTIONS } from "@/lib/sections";
import HeroDecoration from "@/components/HeroDecoration";
import ScrollReveal from "@/components/ScrollReveal";
import SidebarInfoPanel from "@/components/SidebarInfoPanel";
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
      return { comments: [] as Comment[], userId: null as string | null, ready: false };
    }
    return {
      comments: normalizeComments(comments as Partial<Comment>[]),
      userId: user?.id ?? null,
      ready: true,
    };
  } catch {
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
}

const BENTO_SPAN: Record<string, "sm:col-span-2" | ""> = {
  tools: "sm:col-span-2",
  microservices: "sm:col-span-2",
  ai: "sm:col-span-2",
};

export default async function HomePage() {
  const { comments, userId, ready } = await loadHomeComments();

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* ========== 信件开场 ========== */}
      <section className="relative border-b border-border py-16 md:py-24 overflow-hidden">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_320px]">
          <div style={{ animation: "fade-up 0.9s var(--ease-out-soft) forwards" }}>
            <p className="mb-5 text-xs tracking-[0.2em] text-accent uppercase font-medium">
              A Letter to the Next One
            </p>

            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.2] text-text tracking-tight">
              致即将到来的你
            </h1>
            <div className="mt-4 mb-8 h-[2px] w-16 bg-gradient-to-r from-amber-400 to-transparent" />

            <div className="space-y-5 text-base md:text-lg leading-[1.8] text-text-secondary">
              <p>
                去年九月我也是个对一切都懵的新生，对学校、对专业、对大学生活都没有把握。
              </p>
              <p>
                这里写下我希望那时有人告诉我的事——常用的工具、踩过的坑、走得通的路。
                不算多，但能让你少花一点摸索的时间。
              </p>
              <p>你可以从下面任意一个板块进去，随便翻。</p>
            </div>
            <p className="mt-10 text-sm text-muted">
              —— coolin · 长期维护
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center" style={{ animation: "fade-in 1.2s ease-out 0.2s both" }}>
            <HeroDecoration />
          </div>
        </div>
      </section>

      {/* ========== 站点信息面板 ========== */}
      <section className="py-8 md:py-10">
        <ScrollReveal>
          <SidebarInfoPanel />
        </ScrollReveal>
      </section>

      {/* ========== 热门推荐 ========== */}
      <Leaderboard />

      {/* ========== 入口卡片（Bento Grid） ========== */}
      <section className="py-12 md:py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xl font-serif font-semibold text-text">板块入口</h2>
            <span className="text-sm text-muted">慢慢补充中</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map((s, i) => {
            const span = BENTO_SPAN[s.slug] ?? "";
            return (
              <ScrollReveal key={s.slug} delay={60 + i * 50}>
                <Link
                  href={s.href}
                  className={`group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-border-hover hover:shadow-md active:translate-y-0 active:scale-[0.985] ${span}`}
                >
                  <span className="absolute top-4 right-4 text-xs font-mono text-stone-300 group-hover:text-amber-400 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="text-base font-medium text-text group-hover:text-primary transition-colors pr-6">
                    {s.title}
                  </div>

                  <div className="text-sm leading-relaxed text-muted">
                    {s.description}
                  </div>

                  <span className="mt-auto pt-3 text-xs text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center gap-1">
                    进入
                    <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ========== 留言区 ========== */}
      <section className="py-12 md:py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xl font-serif font-semibold text-text">留言区</h2>
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
            <div className="rounded-xl border border-dashed border-border bg-bg-alt p-10 text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm font-medium text-text">留言区正在准备中</p>
              <p className="mt-2 text-xs text-muted">
                等 Supabase 配置好后，这里就会开放留言功能。
              </p>
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* ========== 免责提示 ========== */}
      <section className="pb-10">
        <div className="rounded-xl border border-border bg-surface px-5 py-4 text-xs text-muted leading-relaxed">
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
