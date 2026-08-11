import { BookOpen, MapPin, Navigation } from "lucide-react";

/** 首页 Hero 的清晰校园路标，不使用会造成模糊的 SVG 噪点滤镜。 */
export default function HeroIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`hero-wayfinder relative flex w-full max-w-[360px] items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <div className="hero-wayfinder-card relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <MapPin className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-sm font-semibold text-text">
            AUST 新生路线
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted">
            报到 · 学习 · 生活
          </span>
        </span>
        <BookOpen className="ml-auto h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
      </div>

      <div className="relative h-16 w-24 shrink-0">
        <svg
          viewBox="0 0 96 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M4 48C24 48 24 17 48 17C67 17 70 38 89 28"
            stroke="var(--color-border-hover)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="round"
          />
          <circle cx="5" cy="48" r="3" fill="var(--color-primary)" />
          <circle cx="89" cy="28" r="3" fill="var(--color-accent)" />
        </svg>
        <span className="hero-wayfinder-plane absolute left-10 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm">
          <Navigation className="h-4 w-4 rotate-45" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
