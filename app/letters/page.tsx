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
        <p className="text-sm uppercase tracking-[0.2em] text-accent">letters</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-primary">
          学长来信
        </h1>
        <p className="mt-4 max-w-prose text-muted">
          挑几个我和你这个时候真的想问明白的问题，慢慢写。不定期更新——你可以直接在每封信下面留言。
        </p>
      </header>

      <ul className="mt-12 space-y-6">
        {letters.map((letter, i) => (
          <ScrollReveal key={letter.slug} delay={60 + i * 80}>
            <li>
              <Link
                href={`/letters/${letter.slug}`}
                className="group block rounded-lg border border-border bg-bg px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-12px_rgba(30,58,95,0.25)]"
              >
                <div className="flex items-baseline justify-between gap-4 text-xs text-muted">
                  <time>{formatDate(letter.date)}</time>
                  <span>{letter.author}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-primary transition-colors group-hover:text-primary-hover">
                  {letter.title}
                </h2>
                <p className="mt-2 text-sm text-text/80 leading-relaxed">
                  {letter.excerpt}
                </p>
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
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  读这封 →
                </span>
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
