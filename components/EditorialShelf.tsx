import Link from "next/link";
import { LETTERS } from "@/lib/letters";
import ScrollReveal from "@/components/ScrollReveal";
import Sparkline from "@/components/Sparkline";
import HandDrawnDivider from "@/components/HandDrawnDivider";

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
});

function formatDate(date: string) {
  return DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`));
}

export default function EditorialShelf() {
  const [lead, ...secondary] = LETTERS.slice(0, 3);
  if (!lead) return null;

  return (
    <section className="py-14 md:py-20" aria-labelledby="latest-letters-title">
      <ScrollReveal>
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              New issue
            </p>
            <h2
              id="latest-letters-title"
              className="mt-2 text-balance font-serif text-2xl font-semibold text-text md:text-3xl"
            >
              本期新刊
            </h2>
            <HandDrawnDivider
              width={64}
              height={10}
              className="mt-2 text-accent"
            />
          </div>
          <Link
            href="/letters"
            className="motion-press inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            查看全部来信
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <ScrollReveal className="min-w-0">
          <Link
            href={`/letters/${lead.slug}`}
            className="group block border-b border-border py-8 focus-visible:rounded-sm lg:border-b-0 lg:border-r lg:pr-10"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="font-medium text-primary">本期主稿</span>
              <time dateTime={lead.date}>{formatDate(lead.date)}</time>
              <span>约 {lead.readingTime ?? 5} 分钟</span>
            </div>
            <h3 className="mt-4 max-w-2xl text-pretty font-serif text-2xl font-semibold leading-snug text-text transition-colors group-hover:text-primary md:text-3xl">
              {lead.title}
            </h3>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-text-secondary md:text-base">
              {lead.excerpt}
            </p>

            {/* 阅读趋势 sparkline —— 和 Desk note 卡片视觉呼应 */}
            <div className="mt-5 max-w-md rounded-lg border border-dashed border-border bg-bg/60 px-4 py-2.5">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span className="font-mono">本周阅读</span>
                <span className="font-mono text-primary">↑ 24%</span>
              </div>
              <Sparkline
                className="mt-1 w-full"
                width={320}
                height={32}
                data={[28, 35, 31, 42, 48, 45, 58]}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {lead.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-surface/70 px-2 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                开始阅读 <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </ScrollReveal>

        <div className="divide-y divide-border lg:pl-10">
          {secondary.map((letter, index) => (
            <ScrollReveal key={letter.slug} delay={80 + index * 70}>
              <Link
                href={`/letters/${letter.slug}`}
                className="group block py-7 focus-visible:rounded-sm"
              >
                <div className="flex items-center justify-between gap-4 text-xs text-muted">
                  <time dateTime={letter.date}>{formatDate(letter.date)}</time>
                  <span>约 {letter.readingTime ?? 5} 分钟</span>
                </div>
                <h3 className="mt-3 text-pretty font-serif text-lg font-semibold leading-snug text-text transition-colors group-hover:text-primary">
                  {letter.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                  {letter.excerpt}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
