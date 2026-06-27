"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAIN_SECTIONS, EXTRA_SECTIONS } from "@/lib/sections";

export default function SectionSidebar() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const idx = MAIN_SECTIONS.findIndex((s) => {
      if (pathname === s.href) return true;
      return pathname?.startsWith(s.href + "/") ?? false;
    });
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [pathname]);

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIndicatorStyle({
        position: "absolute",
        left: el.offsetLeft,
        top: 0,
        width: el.offsetWidth,
        height: "100%",
        borderRadius: "8px",
        background: "var(--color-primary-ghost)",
        border: "1px solid var(--color-border)",
        transition: "left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: "none",
        zIndex: 0,
      } as React.CSSProperties);
    } else {
      setIndicatorStyle({
        position: "absolute",
        left: 0,
        top: el.offsetTop,
        width: "100%",
        height: el.offsetHeight,
        borderRadius: "8px",
        background: "var(--color-primary-ghost)",
        border: "1px solid var(--color-border)",
        transition: "top 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: "none",
        zIndex: 0,
      } as React.CSSProperties);
    }
  }, [activeIndex]);

  useEffect(() => {
    const onResize = () => {
      const el = itemRefs.current[activeIndex];
      if (!el) return;
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIndicatorStyle((prev) => ({
          ...prev,
          left: el.offsetLeft,
          width: el.offsetWidth,
          top: 0,
          height: "100%",
        }));
      } else {
        setIndicatorStyle((prev) => ({
          ...prev,
          top: el.offsetTop,
          height: el.offsetHeight,
          left: 0,
          width: "100%",
        }));
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  return (
    <>
      {/* 板块标签 */}
      <div className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">
        资源板块
      </div>

      {/* 导航容器 */}
      <div className="relative flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        <div aria-hidden style={indicatorStyle} />

        {MAIN_SECTIONS.map((s, i) => {
          const active = pathname === s.href || pathname?.startsWith(s.href + "/");
          return (
            <Link
              key={s.slug}
              href={s.href}
              aria-current={active ? "page" : undefined}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={[
                "relative z-10 rounded-lg px-3 py-2 text-sm transition-colors duration-200 whitespace-nowrap",
                active
                  ? "text-primary font-medium"
                  : "text-text-secondary hover:bg-primary-ghost hover:text-primary",
              ].join(" ")}
            >
              {s.title}
            </Link>
          );
        })}
        {EXTRA_SECTIONS.filter((s) => s.slug === "tags" || s.slug === "changelog").map((s, i) => {
          const active = pathname === s.href || pathname?.startsWith(s.href + "/");
          return (
            <Link
              key={s.slug}
              href={s.href}
              aria-current={active ? "page" : undefined}
              className={[
                "relative z-10 rounded-lg px-3 py-2 text-sm transition-colors duration-200 whitespace-nowrap",
                active
                  ? "text-primary font-medium"
                  : "text-muted hover:bg-bg-alt hover:text-primary",
              ].join(" ")}
            >
              {s.title}
            </Link>
          );
        })}
      </div>
    </>
  );
}
