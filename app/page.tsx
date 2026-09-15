import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Compass,
  BookOpen,
  AppWindow,
  Sparkles,
  Wrench,
  Server,
  FolderDown,
  CalendarCheck,
  Mail,
} from "lucide-react";
import campus from "@/public/images/editorial/aust-real/opening-ceremony-2024.webp";
import { MAIN_SECTIONS } from "@/lib/sections";
import StartGuide from "@/components/StartGuide";
import EditorialShelf from "@/components/EditorialShelf";
import CommentBoard from "@/components/CommentBoard";
import { createClient } from "@/lib/supabase/server";
import { normalizeComments } from "@/lib/comments";
import type { Comment } from "@/lib/types";

async function loadHomeComments() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      comments: [] as Comment[],
      userId: null as string | null,
      ready: false,
    };
  }
  try {
    const supabase = await createClient();
    const [
      { data: comments, error: commentsError },
      {
        data: { user },
      },
    ] = await Promise.all([
      supabase
        .from("comments_with_author")
        .select("*")
        .eq("target_type", "global")
        .eq("target_id", "main")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.auth.getUser(),
    ]);
    if (commentsError) {
      console.error("Failed to load home comments:", commentsError);
      return {
        comments: [] as Comment[],
        userId: null as string | null,
        ready: false,
      };
    }
    return {
      comments: normalizeComments(comments as Partial<Comment>[]),
      userId: user?.id ?? null,
      ready: true,
    };
  } catch (e) {
    console.error("Failed to load home comments:", e);
    return {
      comments: [] as Comment[],
      userId: null as string | null,
      ready: false,
    };
  }
}

type HomeStat = {
  label: string;
  value: string;
};

const FALLBACK_DATA = {
  stats: [
    { label: "访问人次", value: "统计中" },
    { label: "访问人数", value: "统计中" },
    { label: "维护状态", value: "长期" },
  ] as HomeStat[],
  sparklineData: [] as number[],
  weeklyChange: null as number | null,
};

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
  const fallback = FALLBACK_DATA;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: viewRow, error }, { data: recentViews }] = await Promise.all(
      [
        supabase
          .from("site_visit_stats")
          .select("total_views, unique_visitors")
          .maybeSingle(),
        supabase
          .from("content_views")
          .select("created_at")
          .gte("created_at", since)
          .limit(2000),
      ],
    );

    if (error) {
      console.error("Failed to load home stats:", error);
      return fallback;
    }

    // 按天聚合近 14 天访问量（index 0 = 13 天前, index 13 = 今天）
    const series = Array(14).fill(0) as number[];
    for (const v of recentViews ?? []) {
      const d = new Date(v.created_at);
      const daysAgo = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (daysAgo >= 0 && daysAgo < 14) {
        series[13 - daysAgo] = (series[13 - daysAgo] ?? 0) + 1;
      }
    }

    // 本周 vs 上周变化率
    const thisWeek = series.slice(7).reduce((a, b) => a + b, 0);
    const lastWeek = series.slice(0, 7).reduce((a, b) => a + b, 0);
    const weeklyChange =
      lastWeek > 0
        ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
        : null;

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

const icons: Record<string, typeof Compass> = {
  tools: Wrench,
  microservices: Server,
  learn: BookOpen,
  software: AppWindow,
  ai: Sparkles,
  resources: FolderDown,
  checkin: CalendarCheck,
  letters: Mail,
};

export default async function HomePage() {
  const [{ comments, userId, ready }, homeStats] = await Promise.all([
    loadHomeComments(),
    loadHomeStats(),
  ]);
  return (
    <div className="campus-home">
      <section className="campus-hero" aria-labelledby="home-title">
        <div className="campus-hero-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            写给每一个刚到安理的你
          </span>
          <h1 id="home-title">
            你好，新同学。
            <br />
            <span>大学生活，</span>
            <br />
            我们一起摸索。
          </h1>
          <p className="hero-description">
            从第一次走进校园，到找到自己的热爱。
            <br className="hidden sm:block" />
            这里有学长的经验、实用的资源，也有与你同行的人。
          </p>
          <div className="hero-actions">
            <Link href="#start-guide" className="ui-button ui-button-primary">
              找到我的起点
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/letters/freshman-handbook"
              className="ui-button ui-button-secondary"
            >
              读新生手册
              <BookOpen size={18} aria-hidden />
            </Link>
          </div>
          <form
            action="/search"
            method="get"
            className="home-search"
            role="search"
          >
            <Search size={19} aria-hidden />
            <label className="sr-only" htmlFor="home-search">
              搜索指南、课程和工具
            </label>
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder="搜一搜：选课、宿舍、编程工具…"
              required
            />
            <button type="submit" aria-label="搜索">
              <ArrowRight size={19} aria-hidden />
            </button>
          </form>
          <p className="hero-note">
            公开内容无需登录 · 同学自发整理 · 持续更新
          </p>
        </div>
        <div className="campus-hero-visual">
          <figure className="campus-cover">
            <Image
              src={campus}
              alt="安徽理工大学 2024 级新生齐聚开学典礼"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1200px) 45vw, 530px"
              preload
              className="object-cover"
            />
            <div className="campus-cover-caption">
              <span>我们的大学，从这里开始</span>
              <strong>相遇，在安理。</strong>
            </div>
          </figure>
          <div className="campus-caption">
            2024 开学典礼 ·{" "}
            <a
              href="https://news.aust.edu.cn/info/1011/41807.htm"
              target="_blank"
              rel="noreferrer"
            >
              图源：安徽理工大学新闻网 / 新媒体中心
            </a>
          </div>
          <Link href="/letters/aust-complete-guide" className="campus-feature">
            <span className="campus-feature-icon">
              <Compass size={24} aria-hidden />
            </span>
            <span>
              <small>校园生活指南</small>
              <strong>把陌生的校园，过成熟悉的日常。</strong>
            </span>
            <ArrowUpRight size={22} aria-hidden />
          </Link>
        </div>
      </section>

      <StartGuide />

      <section className="home-directory" aria-labelledby="directory-title">
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">随用随查</span>
            <h2 id="directory-title">大学生活的常用入口</h2>
          </div>
          <Link href="/search">
            搜索全部内容
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="home-directory-grid">
          {MAIN_SECTIONS.map((section) => {
            const Icon = icons[section.slug] ?? Compass;
            return (
              <Link
                key={section.slug}
                href={section.href}
                className="home-directory-card"
              >
                <span className="directory-card-icon">
                  <Icon size={22} aria-hidden />
                </span>
                <ArrowUpRight
                  className="directory-card-arrow"
                  size={18}
                  aria-hidden
                />
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <EditorialShelf />

      <section className="community-invite">
        <div>
          <span className="eyebrow">经验，在同学之间流动</span>
          <h2>你走过的路，也能成为别人的指南。</h2>
          <p>收藏一篇来信，记下一次学习，或分享一个你发现的好工具。</p>
        </div>
        <Link
          href={userId ? "/contribute" : "/signup"}
          className="ui-button ui-button-primary"
        >
          {userId ? "分享我的经验" : "加入同学之间"}
          <ArrowRight size={18} aria-hidden />
        </Link>
      </section>

      <section className="home-comments">
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">听听大家怎么说</span>
            <h2>留个言，打声招呼</h2>
          </div>
          <Link href="/board">
            进入留言区
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <CommentBoard
          initial={ready ? comments : []}
          targetType="global"
          targetId="main"
          currentUserId={userId}
          readOnlyMessage={
            ready
              ? undefined
              : "留言服务暂时不可用，请稍后再试。你仍可以浏览指南和资源。"
          }
        />
      </section>
      <div className="home-site-note">
        <p>
          本站由同学自发维护，与安徽理工大学及其院系无隶属关系。
          <Link href="/disclaimer">查看使用声明</Link>
        </p>
        <div>
          {homeStats.stats.map((stat) => (
            <span key={stat.label}>
              {stat.label} <strong>{stat.value}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
