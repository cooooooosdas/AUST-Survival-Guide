"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  MessageSquare,
  Bookmark,
  BookOpen,
  Wrench,
  Sparkles,
  Command,
  X,
} from "lucide-react";
import { SECTIONS } from "@/lib/sections";

/**
 * 全局键盘快捷键
 * - "/" 聚焦站内搜索框
 * - "g h" / "g l" / "g m" / "g f" 二级跳页
 * - "?" 打开快捷键面板
 * - Esc 关闭面板
 */

const SECTION_HOTKEYS: Record<string, string> = {
  tools: "m",
  learn: "e",
  microservices: "i",
  software: "s",
  ai: "a",
  resources: "r",
  checkin: "k",
  letters: "l",
};

type Shortcut = {
  keys: string[];
  desc: string;
  Icon: typeof Search;
  action?: () => void;
};

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [gPending, setGPending] = useState(false);

  const focusSearch = useCallback(() => {
    // 站内搜索框（page.tsx 中 DesktopSearch 占位 / 移动端 Header）
    const candidates = [
      'input[placeholder*="搜索"]',
      'input[type="search"]',
      'input[aria-label*="搜索"]',
    ];
    for (const sel of candidates) {
      const el = document.querySelector<HTMLInputElement>(sel);
      if (el) {
        el.focus();
        el.select();
        return true;
      }
    }
    // 找不到则跳搜索页
    router.push("/search");
    return false;
  }, [router]);

  useEffect(() => {
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    function handler(e: KeyboardEvent) {
      // 不要在输入框里触发
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      // ? 显示快捷键面板
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }
      // Esc 关闭面板
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }

      // / 聚焦搜索
      if (e.key === "/") {
        e.preventDefault();
        focusSearch();
        return;
      }

      // "g" 前缀：进入二级模式
      if (e.key === "g" && !gPending) {
        setGPending(true);
        gTimer = setTimeout(() => setGPending(false), 900);
        return;
      }

      // 二级键（仅在 gPending 时生效）
      if (gPending) {
        setGPending(false);
        if (gTimer) clearTimeout(gTimer);
        switch (e.key) {
          case "h":
            router.push("/");
            return;
          case "l":
            router.push("/board");
            return;
          case "f":
            router.push("/library");
            return;
          case "b":
            router.push("/about");
            return;
          case "s":
            router.push("/search");
            return;
          case "k":
            router.push("/checkin");
            return;
          default: {
            // 板块快捷键
            const slug = Object.entries(SECTION_HOTKEYS).find(
              ([, key]) => key === e.key
            )?.[0];
            if (slug) {
              const section = SECTIONS.find((s) => s.slug === slug);
              if (section) router.push(section.href);
            }
          }
        }
      }
    }

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [focusSearch, router, gPending, showHelp]);

  if (!showHelp) return null;

  const mainShortcuts: Shortcut[] = [
    { keys: ["/"], desc: "聚焦搜索", Icon: Search, action: focusSearch },
    { keys: ["g", "h"], desc: "跳到首页", Icon: Home, action: () => router.push("/") },
    { keys: ["g", "l"], desc: "跳到留言区", Icon: MessageSquare, action: () => router.push("/board") },
    { keys: ["g", "f"], desc: "跳到阅读中心", Icon: Bookmark, action: () => router.push("/library") },
    { keys: ["g", "b"], desc: "跳到关于页", Icon: BookOpen, action: () => router.push("/about") },
    { keys: ["g", "k"], desc: "跳到打卡", Icon: Sparkles, action: () => router.push("/checkin") },
    { keys: ["?"], desc: "打开 / 关闭快捷键面板", Icon: Command },
    { keys: ["Esc"], desc: "关闭此面板", Icon: X },
  ];

  const sectionShortcuts: { slug: string; key: string; desc: string; Icon: typeof Wrench }[] =
    SECTIONS.map((s) => ({
      slug: s.slug,
      key: SECTION_HOTKEYS[s.slug] ?? "",
      desc: s.title,
      Icon: SECTION_HOTKEYS[s.slug] === "l" ? BookOpen : Wrench,
    }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="键盘快捷键"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-border bg-bg-alt px-5 py-3">
          <div className="flex items-center gap-2">
            <Command className="h-4 w-4 text-primary" strokeWidth={2} />
            <h2 className="font-serif text-base font-medium text-text">
              键盘快捷键
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="关闭"
            className="motion-press inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg hover:text-text"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* 主要快捷键 */}
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-muted">
              全局
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {mainShortcuts.map((s) => {
                const Icon = s.Icon;
                return (
                  <button
                    key={s.desc}
                    type="button"
                    onClick={s.action}
                    disabled={!s.action}
                    className="motion-press flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary-ghost disabled:cursor-default disabled:hover:border-border disabled:hover:bg-surface"
                  >
                    <span className="flex items-center gap-2 text-text-secondary">
                      <Icon className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
                      {s.desc}
                    </span>
                    <span className="flex items-center gap-0.5 font-mono text-[11px] text-muted">
                      {s.keys.map((k, i) => (
                        <span key={k} className="flex items-center gap-0.5">
                          <kbd className="rounded border border-border bg-bg-alt px-1.5 py-0.5 text-text">
                            {k}
                          </kbd>
                          {i < s.keys.length - 1 && (
                            <span className="text-muted">/</span>
                          )}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 板块快捷键 */}
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-muted">
              板块（g + 字母）
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {sectionShortcuts.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => router.push(SECTIONS.find((x) => x.slug === s.slug)?.href ?? "/")}
                  className="motion-press flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-left text-xs transition-colors hover:border-primary/40 hover:bg-primary-ghost"
                >
                  <span className="truncate text-text-secondary">{s.desc}</span>
                  <kbd className="shrink-0 rounded border border-border bg-bg-alt px-1.5 py-0.5 font-mono text-[10px] text-text">
                    {s.key}
                  </kbd>
                </button>
              ))}
            </div>
          </div>

          <p className="border-t border-border pt-3 font-mono text-[11px] text-muted">
            按 <kbd className="rounded border border-border bg-bg-alt px-1 py-0.5">?</kbd> 随时打开此面板
          </p>
        </div>
      </div>
    </div>
  );
}