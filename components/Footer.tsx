import { SITE } from "@/lib/site";
import { MAIN_SECTIONS } from "@/lib/sections";
import Link from "next/link";
import { Mail, Rss, ShieldCheck, Sparkles } from "lucide-react";
import FooterYear from "./FooterYear";

export default function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="border-t border-border bg-surface/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-text font-medium">
                © <FooterYear /> {SITE.shortName}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {SITE.description}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {SITE.github && (
                <a
                  href={SITE.github}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-ghost hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795.735-4.035-1.305-.135-.345-.72-1.305-1.23-1.575-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                </a>
              )}
              <a
                href="/feed.xml"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-ghost hover:text-primary"
                aria-label="RSS 订阅"
                title="RSS 订阅"
              >
                <Rss className="h-4 w-4" />
              </a>
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
              <Link
                href="/library"
                className="text-xs text-text-secondary transition-colors hover:text-primary"
              >
                阅读中心
              </Link>
              <Link
                href="/contribute"
                className="text-xs text-text-secondary transition-colors hover:text-primary"
              >
                投稿中心
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-text-secondary transition-colors hover:text-primary"
              >
                隐私政策
              </Link>
              <Link
                href="/disclaimer"
                className="text-xs text-text-secondary transition-colors hover:text-primary"
              >
                免责声明
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              个人项目 · 长期维护 · 由 coolin 构建
            </span>
            <span className="font-mono opacity-70">
              coolin © AUST
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}