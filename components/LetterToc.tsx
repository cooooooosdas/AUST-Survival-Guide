"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const h2s = useMemo(() => headings.filter((h) => h.level === 2), [headings]);

  useEffect(() => {
    if (h2s.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // 优先选最靠上的那个
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(top.target.id);
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 }
    );
    h2s.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [h2s]);

  if (headings.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="hidden lg:block"
    >
      <div className="fixed right-6 top-32 w-52 max-h-[calc(100vh-12rem)] overflow-y-auto rounded-xl border border-border bg-bg-alt p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-medium text-muted uppercase tracking-widest"
        >
          <span>目录</span>
          <span className="transition-transform duration-200" style={{
            transform: collapsed ? "rotate(-90deg)" : "rotate(0)",
          }}>▼</span>
        </button>

        {!collapsed && (
          <ul className="mt-2 space-y-1 border-t border-border pt-2">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              const indent = h.level === 3 ? "pl-3 text-xs" : "text-sm";
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(h.id);
                      if (!target) return;
                      const y = target.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }}
                    className={[
                      "block truncate rounded-md px-2 py-1 transition-colors",
                      indent,
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-muted hover:bg-bg hover:text-primary",
                    ].join(" ")}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
