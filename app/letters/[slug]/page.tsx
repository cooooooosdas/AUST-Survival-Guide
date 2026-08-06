import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { LETTERS, getLetter, readingTimeMinutes } from "@/lib/letters";
import CommentBoard from "@/components/CommentBoard";
import LikeButton from "@/components/LikeButton";
import FavoriteButton from "@/components/FavoriteButton";
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

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(iso: string) {
  return DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
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
  const currentTags = new Set(letter.tags ?? []);
  const relatedLetters = LETTERS
    .filter((entry) => entry.slug !== slug)
    .map((entry) => ({
      entry,
      score: (entry.tags ?? []).reduce(
        (total, tag) => total + (currentTags.has(tag) ? 1 : 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
    .slice(0, 2)
    .map(({ entry }) => entry);

  // 点赞与收藏互相独立，并行读取，避免文章页产生额外等待链。
  let likeCount = 0;
  let userLiked = false;
  let userFavorited = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const [
        { count: lc },
        { data: myLike },
        { data: myFavorite },
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
        userId
          ? supabase
              .from("favorites")
              .select("id")
              .eq("target_type", "letter")
              .eq("target_id", slug)
              .eq("user_id", userId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      likeCount = lc ?? 0;
      userLiked = !!myLike?.id;
      userFavorited = !!myFavorite?.id;
    } catch {
      // 点赞查询失败不影响页面
    }
  }

  return (
    <>
      <LetterToc headings={headings} />
      <ViewTracker targetType="letter" targetId={slug} />
      <article className="mx-auto max-w-2xl px-6 py-16 md:max-w-3xl lg:max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/letters"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        所有信件
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <time dateTime={letter.date}>{formatDate(letter.date)}</time>
          <span>{letter.author}</span>
          <span>· 约 {minutes} 分钟</span>
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-serif font-bold leading-tight text-text tracking-tight">
          {letter.title}
        </h1>
        {letter.tags && letter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {letter.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-bg-alt px-2.5 py-0.5 text-xs text-text-secondary"
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
            currentUserId={userId}
            initialLiked={userLiked}
            initialCount={likeCount}
          />
          <FavoriteButton
            targetType="letter"
            targetId={slug}
            initialFavorited={userFavorited}
          />
          <ShareButton
            targetType="letter"
            targetId={slug}
            title={letter.title}
            excerpt={letter.excerpt}
          />
        </div>
      </header>

      <div className="mt-8 card p-6 md:p-10">
        <div className="prose">
          <Letter />
        </div>
      </div>

      {/* 相关图片展示 */}
      {letter.images && letter.images.length > 0 && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4" aria-label="相关图片">
          {letter.images.slice(0, 8).map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-bg-alt"
            >
              <Image
                src={src}
                alt={`相关图片 ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </a>
          ))}
        </section>
      )}

      <div className="my-16 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
        <div className="flex-1 h-px bg-border" />
      </div>

      {relatedLetters.length > 0 && (
        <section className="mb-16" aria-labelledby="related-letters-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Keep reading</p>
              <h2 id="related-letters-title" className="mt-1 font-serif text-2xl font-semibold text-text">继续阅读</h2>
            </div>
            <Link href="/letters" className="text-sm text-primary transition-colors hover:text-primary-hover">
              所有来信
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedLetters.map((related) => (
              <Link
                key={related.slug}
                href={`/letters/${related.slug}`}
                className="card card-interactive group flex min-h-48 flex-col p-5"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-muted">
                  <time dateTime={related.date}>{formatDate(related.date)}</time>
                  <span>约 {related.readingTime ?? 5} 分钟</span>
                </div>
                <h3 className="mt-3 text-pretty font-serif text-lg font-semibold leading-snug text-text transition-colors group-hover:text-primary">
                  {related.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">{related.excerpt}</p>
                <span className="mt-auto pt-4 text-sm font-medium text-primary">继续读 →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-serif font-semibold text-text mt-0">
          <MessageCircle className="h-5 w-5 text-primary" strokeWidth={2} />
          读完想说点什么？
        </h2>
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
