import Link from "next/link";
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">letters</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-text tracking-tight">
          学长来信
        </h1>
        <div className="mt-4 mb-6 h-[2px] w-12 bg-gradient-to-r from-amber-400 to-transparent" />
        <p className="max-w-prose text-muted text-[15px] leading-relaxed">
          挑几个我和你这个时候真的想问明白的问题，慢慢写。不定期更新——你可以直接在每封信下面留言。
        </p>
      </header>

      <ul className="mt-12 space-y-4">
        {letters.map((letter, i) => (
          <ScrollReveal key={letter.slug} delay={60 + i * 80}>
            <li>
              <Link
                href={`/letters/${letter.slug}`}
                className="group card card-hover p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <time dateTime={letter.date}>{formatDate(letter.date)}</time>
                  <span className="text-border">·</span>
                  <span>约 {letter.readingTime ?? 5} 分钟</span>
                  <span className="text-border">·</span>
                  <span>{letter.author}</span>
                </div>
                <h2 className="text-xl font-serif font-semibold text-text group-hover:text-primary transition-colors">
                  {letter.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
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
                <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  读这封
                  <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="8" x2="13" y2="8" />
                    <polyline points="9 4 13 8 9 12" />
                  </svg>
                </span>
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
