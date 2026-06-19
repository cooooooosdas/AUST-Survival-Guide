"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_SECTIONS, EXTRA_SECTIONS } from "@/lib/sections";
import UserMenu from "@/components/UserMenu";

type HeaderUser = {
  email: string | null;
  displayName: string | null;
} | null;

export default function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        "sticky top-0 z-30 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-bg/85 backdrop-blur-md shadow-[0_2px_20px_-12px_rgba(30,58,95,0.25)]"
          : "border-transparent bg-bg/70 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          className="text-primary font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
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
          "md:hidden overflow-hidden border-t border-border bg-bg/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out",
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
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "text-text hover:bg-bg-alt hover:text-primary",
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
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent/30 text-primary"
                        : "text-muted hover:bg-bg-alt hover:text-primary",
                    ].join(" ")}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-border pt-4">
            <UserMenu user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}
