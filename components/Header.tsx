"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Tag,
  Bookmark,
  MessageSquare,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { MAIN_SECTIONS, EXTRA_SECTIONS } from "@/lib/sections";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/components/ThemeProvider";
import AustLogo from "@/components/AustLogo";

type HeaderUser = {
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
} | null;

export default function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // 移动端菜单打开状态：记录打开时的 pathname，
  // 路由变化后自动失效（无需 useEffect 写 setState）。
  const [mobileOpenAt, setMobileOpenAt] = useState<string | null>(null);
  const isMobileOpen = mobileOpenAt !== null && mobileOpenAt === pathname;
  const toggleMobile = () => {
    if (isMobileOpen) setMobileOpenAt(null);
    else setMobileOpenAt(pathname);
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const linkClass = (active: boolean, muted = false) =>
    [
      "motion-press relative rounded-full px-2.5 py-1.5 transition-colors duration-200 whitespace-nowrap text-[13px]",
      muted ? "text-muted" : "text-text-secondary",
      active ? "bg-primary-light text-primary font-medium" : "hover:bg-primary-ghost hover:text-primary",
    ].join(" ");

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={[
        "sticky top-0 z-30 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-bg/86 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-bg/72 backdrop-blur-lg",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
        <Link
          href="/"
          className="aust-logo-link motion-press shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          <AustLogo />
        </Link>

        <nav
          aria-label="主导航"
          className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/58 px-2 py-1 text-[13px] shadow-sm lg:flex"
        >
          {MAIN_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              aria-current={isActive(s.href) ? "page" : undefined}
              className={linkClass(!!isActive(s.href))}
            >
              {s.title}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px shrink-0 bg-border" />
          {EXTRA_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              aria-current={isActive(s.href) ? "page" : undefined}
              className={linkClass(!!isActive(s.href), true)}
            >
              {s.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <div className="hidden md:flex items-center gap-0.5">
            <TagsLink />
            <SearchLink />
            <LibraryLink />
            <BoardLink />
            <ThemeToggle />
          </div>
          <span className="hidden md:block h-4 w-px bg-border mx-1" />
          <div className="hidden md:block">
            <UserMenu user={user} />
          </div>

          <button
            type="button"
            aria-label={isMobileOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            onClick={toggleMobile}
            className="motion-icon-button md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={[
          "md:hidden overflow-hidden border-t border-border bg-bg/95 backdrop-blur-lg transition-[max-height,opacity] duration-300 ease-out",
          isMobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="移动端导航" className="px-4 py-4">
          <p className="text-[11px] uppercase tracking-widest text-muted mb-2 font-medium">
            资源
          </p>
          <ul className="grid grid-cols-2 gap-1">
            {MAIN_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "motion-press block rounded-lg px-3 py-2.5 text-sm transition-[color,background-color,transform] duration-200",
                      active
                        ? "bg-primary text-white font-medium shadow-sm"
                        : "text-text-secondary hover:bg-primary-ghost hover:text-primary",
                    ].join(" ")}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 mb-2 text-[11px] uppercase tracking-widest text-muted font-medium">
            其他
          </p>
          <ul className="grid grid-cols-2 gap-1">
            {EXTRA_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "motion-press block rounded-lg px-3 py-2.5 text-sm transition-[color,background-color,transform] duration-200",
                      active
                        ? "bg-accent-light text-accent font-medium"
                        : "text-muted hover:bg-accent-ghost hover:text-accent",
                    ].join(" ")}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/library"
                className="motion-press block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors duration-200 hover:bg-primary-ghost hover:text-primary"
              >
                阅读中心
              </Link>
            </li>
            <li>
              <Link
                href="/contribute"
                className="motion-press block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors duration-200 hover:bg-primary-ghost hover:text-primary"
              >
                投稿中心
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="motion-press block rounded-lg px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-primary-ghost hover:text-primary"
              >
                搜索
              </Link>
            </li>
          </ul>

          <div className="mt-5 border-t border-border pt-4">
            <MobileThemeToggle />
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <UserMenu user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}

function LibraryLink() {
  return (
    <Link
      href="/library"
      className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label="阅读中心"
      title="阅读中心"
    >
      <Bookmark className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function SearchLink() {
  return (
    <Link
      href="/search"
      className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label="搜索"
      title="搜索"
    >
      <Search className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function TagsLink() {
  return (
    <Link
      href="/tags"
      className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label="标签云"
      title="标签云"
    >
      <Tag className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function BoardLink() {
  return (
    <Link
      href="/board"
      className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label="留言区"
      title="留言区"
    >
      <MessageSquare className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      title={isDark ? "切换到浅色模式" : "切换到深色模式"}
      className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {isDark ? (
        <Sun className="theme-icon-swap h-4 w-4" aria-hidden />
      ) : (
        <Moon className="theme-icon-swap h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

function MobileThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      className="motion-press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary transition-[color,background-color,transform] duration-200 hover:bg-primary-ghost hover:text-primary"
    >
      {isDark ? (
        <>
          <Sun className="h-5 w-5 shrink-0" aria-hidden />
          <span>切换到浅色模式</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 shrink-0" aria-hidden />
          <span>切换到深色模式</span>
        </>
      )}
    </button>
  );
}