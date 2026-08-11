"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, List } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  headings: Heading[];
};

export default function LetterToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const h2s = useMemo(() => headings.filter((h) => h.level === 2), [headings]);
  const activeHeading = headings.find((heading) => heading.id === activeId);

  useEffect(() => {
    if (h2s.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(top.target.id);
      },
      { rootMargin: "-112px 0px -70% 0px", threshold: 0 }
    );
    h2s.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [h2s]);

  if (headings.length === 0) return null;

  function goToHeading(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = window.matchMedia("(max-width: 1535px)").matches ? 124 : 80;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setMobileOpen(false);
  }

  return (
    <>
      <div className="sticky top-16 z-20 border-y border-border bg-bg/95 px-4 py-2 shadow-xs backdrop-blur-lg 2xl:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-letter-toc"
          className="mx-auto flex min-h-11 w-full max-w-2xl items-center justify-between gap-3 rounded-lg px-2 text-sm text-text-secondary transition-colors active:bg-bg-alt"
        >
          <span className="flex min-w-0 items-center gap-2">
            <List className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
            <span className="shrink-0 font-medium text-text">文内目录</span>
            <span className="truncate text-xs text-muted">
              {activeHeading?.text ?? `共 ${h2s.length} 节`}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>

        {mobileOpen && (
          <nav
            id="mobile-letter-toc"
            aria-label="文章目录"
            className="mx-auto max-h-[56vh] w-full max-w-2xl overflow-y-auto border-t border-border pt-2"
          >
            <ul className="pb-2">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <li key={heading.id}>
                    <button
                      type="button"
                      onClick={() => goToHeading(heading.id)}
                      className={[
                        "flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-left leading-snug transition-colors",
                        heading.level === 3 ? "pl-7 text-xs" : "text-sm font-medium",
                        isActive
                          ? "bg-primary-light text-primary"
                          : "text-text-secondary active:bg-bg-alt",
                      ].join(" ")}
                    >
                      {heading.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      <div className="hidden 2xl:block">
        <div className="fixed right-6 top-32 max-h-[calc(100vh-12rem)] w-52 overflow-y-auto rounded-xl border border-border bg-bg-alt p-3 shadow-sm">
          <button
            type="button"
            onClick={() => setDesktopCollapsed((collapsed) => !collapsed)}
            aria-expanded={!desktopCollapsed}
            aria-controls="desktop-letter-toc"
            className="flex min-h-9 w-full items-center justify-between text-[11px] font-medium uppercase tracking-widest text-muted"
          >
            <span className="flex items-center gap-1.5">
              <List className="h-3 w-3" strokeWidth={2} />
              目录
            </span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${desktopCollapsed ? "-rotate-90" : ""}`}
              strokeWidth={2}
            />
          </button>

          {!desktopCollapsed && (
            <ul id="desktop-letter-toc" className="mt-2 space-y-0.5 border-t border-border pt-2">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <li key={heading.id}>
                    <button
                      type="button"
                      onClick={() => goToHeading(heading.id)}
                      className={[
                        "block min-h-8 w-full truncate rounded-md px-2 py-1.5 text-left transition-colors duration-150",
                        heading.level === 3 ? "pl-5 text-xs" : "text-sm",
                        isActive
                          ? "bg-primary-light font-medium text-primary"
                          : "text-text-secondary hover:bg-bg hover:text-primary",
                      ].join(" ")}
                    >
                      {heading.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
