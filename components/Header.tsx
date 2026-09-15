"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, Sun, Moon, Menu, X } from "lucide-react";
import { MAIN_SECTIONS } from "@/lib/sections";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/components/ThemeProvider";
import AustLogo from "@/components/AustLogo";

type HeaderUser = {
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
} | null;
const primaryLinks = [
  { href: "/", label: "首页" },
  { href: "/letters", label: "新生指南" },
  { href: "/learn", label: "学习资源" },
  { href: "/resources", label: "资源中心" },
];
const communityLinks = [
  { href: "/library", title: "阅读中心" },
  { href: "/board", title: "留言交流" },
  { href: "/contribute", title: "分享经验" },
  { href: "/tags", title: "标签索引" },
  { href: "/about", title: "关于本站" },
  { href: "/#start-guide", title: "使用引导" },
];

export default function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useTheme();
  const active = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAt(null);
        buttonRef.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenAt(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  return (
    <header
      className="site-header"
      ref={headerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpenAt(null);
      }}
    >
      <div className="site-header-inner">
        <Link
          href="/"
          className="aust-logo-link shrink-0"
          aria-label="安理指南首页"
        >
          <AustLogo />
        </Link>
        <nav className="primary-navigation" aria-label="主导航">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/search"
            className="header-icon"
            aria-label="搜索全站"
            title="搜索全站"
          >
            <Search size={19} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="header-icon"
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          >
            {theme === "dark" ? (
              <Sun size={19} aria-hidden />
            ) : (
              <Moon size={19} aria-hidden />
            )}
          </button>
          <div className="header-account">
            <UserMenu user={user} />
          </div>
          <button
            ref={buttonRef}
            type="button"
            className="header-menu-toggle"
            aria-expanded={open}
            aria-controls="site-navigation"
            aria-label={open ? "关闭导航" : "打开全部导航"}
            onClick={() => setOpenAt(open ? null : pathname)}
          >
            {open ? (
              <X size={20} aria-hidden />
            ) : (
              <Menu size={20} aria-hidden />
            )}
            <span>导航</span>
          </button>
        </div>
      </div>
      {open && (
        <div
          id="site-navigation"
          className="navigation-panel"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpenAt(null);
          }}
        >
          <div className="navigation-panel-inner">
            <nav aria-label="全部资源导航">
              <p className="eyebrow">学习与校园</p>
              <div className="navigation-grid">
                {MAIN_SECTIONS.map((section) => (
                  <Link
                    key={section.slug}
                    href={section.href}
                    aria-current={active(section.href) ? "page" : undefined}
                  >
                    <span>
                      <strong>{section.title}</strong>
                      <small>{section.description}</small>
                    </span>
                    <ArrowUpRight size={16} aria-hidden />
                  </Link>
                ))}
              </div>
            </nav>
            <nav aria-label="社区与帮助" className="community-navigation">
              <p className="eyebrow">同学之间</p>
              {communityLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.title}
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              ))}
              <div className="mobile-account">
                <UserMenu user={user} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
