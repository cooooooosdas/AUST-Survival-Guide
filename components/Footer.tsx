import { SITE } from "@/lib/site";
import { MAIN_SECTIONS } from "@/lib/sections";
import Link from "next/link";
import FooterYear from "./FooterYear";

export default function Footer() {
  return (
    <footer className="relative mt-16">
      <div className="accent-bar opacity-60" />

      <div className="border-t border-border bg-surface/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-text font-medium">© <FooterYear /> {SITE.shortName}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              {SITE.description}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {SITE.github && (
                <a
                  href={SITE.github}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-ghost hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-widest text-muted font-medium">
              资源板块
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {MAIN_SECTIONS.map((s) => (
                <Link
                  key={s.slug}
                  href={s.href}
                  className="text-xs text-text-secondary transition-colors hover:text-primary"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-widest text-muted font-medium">
              更多
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/privacy" className="text-xs text-text-secondary transition-colors hover:text-primary">
                隐私政策
              </Link>
              <Link href="/disclaimer" className="text-xs text-text-secondary transition-colors hover:text-primary">
                免责声明
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-5">
          <p className="text-[11px] text-muted">
            个人博客 · 长期维护 · 由 coolin 构建
          </p>
        </div>
      </div>
    </footer>
  );
}
