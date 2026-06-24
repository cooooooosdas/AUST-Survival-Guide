"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_SECTIONS } from "@/lib/sections";
import { useEffect, useRef, useState } from "react";

/**
 * 侧边工具箱菜单 - 二次元风格
 * 底部带滑动选中色块，平滑跟随当前激活项
 *
 * 注：外层 <aside> 由布局组件控制（sticky + overflow-auto），
 *     SidebarInfoPanel 与本组件平级放在同一容器内。
 */
export default function SectionSidebar() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // 计算滑动指示器位置
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

    // 在移动端横向布局时用 left/width，PC 端纵向用 top/height
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIndicatorStyle({
        position: "absolute",
        left: el.offsetLeft,
        top: 0,
        width: el.offsetWidth,
        height: "100%",
        borderRadius: "8px",
        background: "linear-gradient(135deg, rgba(123,140,222,0.18) 0%, rgba(255,158,181,0.12) 100%)",
        border: "1px solid rgba(123,140,222,0.3)",
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
        background: "linear-gradient(135deg, rgba(123,140,222,0.18) 0%, rgba(255,158,181,0.12) 100%)",
        border: "1px solid rgba(123,140,222,0.3)",
        transition: "top 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: "none",
        zIndex: 0,
      } as React.CSSProperties);
    }
  }, [activeIndex]);

  // 响应窗口尺寸变化重新计算
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

      {/* 导航容器 —— 滑动指示器挂载点 */}
      <div ref={listRef} className="relative flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {/* 滑动选中色块 */}
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
                  : "text-text hover:bg-primary-ghost hover:text-primary",
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
