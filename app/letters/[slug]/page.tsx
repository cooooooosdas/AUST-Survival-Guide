import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LETTERS, getLetter, readingTimeMinutes } from "@/lib/letters";
import CommentBoard from "@/components/CommentBoard";
import LikeButton from "@/components/LikeButton";
import FavoriteButton from "@/components/FavoriteButton";
import ReadingProgress from "@/components/ReadingProgress";
import LetterToc from "@/components/LetterToc";
import ViewTracker from "@/components/ViewTracker";
import ShareButton from "@/components/ShareButton";
import { createClient } from "@/lib/supabase/server";
import { normalizeComments } from "@/lib/comments";
import type { Comment } from "@/lib/types";
import { siteUrl, SITE } from "@/lib/site";
import { slug as githubSlug } from "github-slugger";
import fs from "node:fs";
import path from "node:path";

export const dynamicParams = false;

export function generateStaticParams() {
  return LETTERS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const letter = getLetter(slug);
  if (!letter) return {};
  const path = `/letters/${slug}`;
  return {
    title: letter.title,
    description: letter.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: letter.title,
      description: letter.excerpt,
      publishedTime: letter.date,
      authors: [letter.author],
      tags: letter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: letter.title,
      description: letter.excerpt,
    },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function extractHeadings(text: string): { id: string; text: string; level: 2 | 3 }[] {
  const lines = text.split("\n");
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    const textRaw = m[2].replace(/[`*_#]+/g, "").trim();
    // 用 github-slugger 生成 id，跟 rehype-slug 完全一致，保证 TOC 点击跳转能命中
    const id = githubSlug(textRaw);
    if (textRaw && id) out.push({ id, text: textRaw, level });
  }
  return out;
}

function rawFileText(slug: string) {
  try {
    const p = path.join(process.cwd(), "content", "letters", `${slug}.mdx`);
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

async function loadCommentsAndUser(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
  try {
    const supabase = await createClient();
    const [{ data: comments, error: commentsError }, { data: { user } }] = await Promise.all([
      supabase
        .from("comments_with_author")
        .select("*")
        .eq("target_type", "letter")
        .eq("target_id", slug)
        .order("created_at", { ascending: false })
        .limit(200),
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

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const letter = getLetter(slug);
  if (!letter) notFound();

  const { default: Letter, metadata: letterMetadata } = await letter.load();
  const { comments, userId, ready } = await loadCommentsAndUser(slug);

  // 优先使用 MDX 元数据中预计算的 readingTime，避免每次渲染都读文件
  const rawText = rawFileText(slug);
  const minutes = letterMetadata?.readingTime ?? readingTimeMinutes(rawText);

  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: letter.title,
    description: letter.excerpt,
    datePublished: letter.date,
    dateModified: letter.date,
    author: { "@type": "Person", name: letter.author },
    publisher: { "@type": "Organization", name: SITE.shortName },
    mainEntityOfPage: `${base}/letters/${slug}`,
    keywords: letter.tags?.join(", "),
  };

  const headings = extractHeadings(rawText);

  // 加载点赞数据
  let likeCount = 0;
  let userLiked = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const [
        { count: lc },
        { data: myLike },
      ] = await Promise.all([
        supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("target_type", "letter")
          .eq("target_id", slug),
        userId
          ? supabase
              .from("likes")
              .select("id")
              .eq("target_type", "letter")
              .eq("target_id", slug)
              .eq("user_id", userId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      likeCount = lc ?? 0;
      userLiked = !!myLike?.id;
    } catch {
      // 点赞查询失败不影响页面
    }
  }

  return (
    <>
      <ReadingProgress />
      <LetterToc headings={headings} />
      <ViewTracker targetType="letter" targetId={slug} />
      <article className="mx-auto max-w-2xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/letters"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        ← 所有信件
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <time>{formatDate(letter.date)}</time>
          <span>{letter.author}</span>
          <span>· 约 {minutes} 分钟</span>
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-primary">
          {letter.title}
        </h1>
        {letter.tags && letter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {letter.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LikeButton
            targetType="letter"
            targetId={slug}
            initialLiked={userLiked}
            initialCount={likeCount}
          />
          <FavoriteButton
            targetType="letter"
            targetId={slug}
            initialFavorited={false}
          />
          <ShareButton
            targetType="letter"
            targetId={slug}
            title={letter.title}
            excerpt={letter.excerpt}
          />
        </div>
      </header>

      <div className="mt-8 glass-card p-6 md:p-10">
        <Letter />
      </div>

      <hr className="my-16 border-t border-border" />

      <section>
        <h2 className="text-xl font-semibold text-primary">读完想说点什么？</h2>
        <p className="mt-2 text-sm text-muted">
          这条留言只在这封信下面显示，作者会看到。
        </p>
        <div className="mt-8">
          {ready ? (
            <CommentBoard
              initial={comments}
              targetType="letter"
              targetId={slug}
              currentUserId={userId}
            />
          ) : (
            <div className="rounded-md border border-dashed border-border bg-bg-alt p-6 text-center text-sm text-muted">
              留言功能等 Supabase 配好就上线。
            </div>
          )}
        </div>
      </section>
    </article>
    </>
  );
}
