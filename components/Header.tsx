"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_SECTIONS, EXTRA_SECTIONS } from "@/lib/sections";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/components/ThemeProvider";

type HeaderUser = {
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
} | null;

export default function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  // 路由变化时自动收起移动菜单
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // 打开抽屉时锁定 body 滚动
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = (active: boolean, muted = false) =>
    [
      "relative px-1 py-1 transition-colors duration-200",
      muted ? "text-muted" : "text-text",
      active ? "text-primary" : "hover:text-primary",
      "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-accent after:transition-transform after:duration-300 after:origin-left",
      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    ].join(" ");

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={[
        "sticky top-0 z-30 rounded-b-xl border transition-all duration-300",
        scrolled
          ? "border-border glass-strong shadow-glow"
          : "border-transparent glass",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-primary to-accent bg-clip-text font-semibold tracking-wide text-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
        >
          安理大生存指南
        </Link>

        <nav
          aria-label="主导航"
          className="hidden md:flex items-center gap-5 text-sm"
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
          <span className="h-4 w-px bg-border" />
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

        <Link
          href="/search"
          className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="搜索"
          title="搜索"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
        <Link
          href="/feed.xml"
          target="_blank"
          rel="alternate"
          className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="RSS 订阅"
          title="RSS 订阅"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
        </Link>
        <ThemeToggle />
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <UserMenu user={user} />
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-text transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      <div
        id="mobile-nav"
        className={[
          "md:hidden overflow-hidden border-t border-border glass-strong transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="移动端导航" className="px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">
            资源
          </p>
          <ul className="grid grid-cols-2 gap-1">
            {MAIN_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className={[
                      "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                      active
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-text hover:bg-primary/10 hover:text-primary",
                    ].join(" ")}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 mb-2 text-xs uppercase tracking-widest text-muted">
            其他
          </p>
          <ul className="grid grid-cols-2 gap-1">
            {EXTRA_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className={[
                      "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                      active
                        ? "bg-accent/30 text-primary shadow-sm shadow-accent/20"
                        : "text-muted hover:bg-accent/10 hover:text-primary",
                    ].join(" ")}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/search"
                className="block rounded-lg px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-accent/10 hover:text-primary"
              >
                搜索
              </Link>
            </li>
          </ul>

          {/* 移动端主题切换 */}
          <div className="mt-5 border-t border-border pt-4">
            <MobileThemeToggle />
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <UserMenu user={user} />
          </div>
        </nav>
      </div>
    </header>
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
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
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-text transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
    >
      {isDark ? (
        <>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>切换到浅色模式</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span>切换到深色模式</span>
        </>
      )}
    </button>
  );
}
