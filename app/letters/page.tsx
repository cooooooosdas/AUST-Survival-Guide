import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LETTERS } from "@/lib/letters";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = { title: "学长来信" };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function LettersIndexPage() {
  const letters = [...LETTERS].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20 md:py-24">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">写给还在摸索的你</p>
        <h1 className="mt-4 text-5xl md:text-6xl font-serif font-bold text-text tracking-tight">
          学长来信
        </h1>
        <div className="mt-4 mb-6 h-[2px] w-12 bg-text" />
        <p className="max-w-2xl text-text-secondary text-lg leading-8">
          挑几个我和你这个时候真的想问明白的问题，慢慢写。不定期更新——你可以直接在每封信下面留言。
        </p>
      </header>

      <ul className="mt-12 space-y-5 sm:mt-16 sm:space-y-6">
        {letters.map((letter, i) => (
          <ScrollReveal key={letter.slug} delay={60 + i * 80}>
            <li>
              <Link
                href={`/letters/${letter.slug}`}
                className="group card card-hover flex flex-col gap-4 p-7 sm:p-9"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <time dateTime={letter.date}>{formatDate(letter.date)}</time>
                  <span className="text-border">·</span>
                  <span>约 {letter.readingTime ?? 5} 分钟</span>
                  <span className="text-border">·</span>
                  <span>{letter.author}</span>
                </div>
                <h2 className="text-balance text-2xl sm:text-3xl font-serif font-semibold leading-snug text-text transition-colors group-hover:text-primary">
                  {letter.title}
                </h2>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  {letter.excerpt}
                </p>
                {letter.tags && letter.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {letter.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-amber-200 bg-accent-light px-2.5 py-0.5 text-xs text-accent font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <span className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary opacity-100 transition-opacity sm:mt-2 sm:min-h-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  读这封
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </span>
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>

      {/* 个人印记 —— 克制的小标记 */}
      <div className="mt-16 flex items-center justify-center gap-2 text-[11px] text-muted">
        <span className="font-mono uppercase tracking-[0.2em]">by coolin</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="font-mono">共 {letters.length} 封 · 长期更新</span>
      </div>
    </div>
  );
}
