"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryLabel: string;
  source_type: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

type Category = { value: string; label: string };

type Props = {
  initialQ: string;
  initialCategory: string;
  categories: Category[];
};

const CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数问题",
  software: "软件安装",
  "ai-tools": "AI 工具使用",
  "course-select": "选课疑问",
};

const CATEGORY_LIST: Category[] = [
  { value: "high-math", label: "高数问题" },
  { value: "software", label: "软件安装" },
  { value: "ai-tools", label: "AI 工具使用" },
  { value: "course-select", label: "选课疑问" },
];

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const terms = escaped.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;
  const pattern = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-accent/30 px-0.5 text-primary">{part}</mark>
    ) : (
      part
    )
  );
}

export default function FaqClient({ initialQ, initialCategory, categories }: Props) {
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQ) {
      doSearch(initialQ, initialCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(query: string, cat: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (cat) params.set("category", cat);
      const res = await fetch(`/api/faq?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.items) {
          setItems(json.items);
          setLoading(false);
          return;
        }
      }
    } catch {
      // network error — fall back to empty state
    }
    setItems([]);
    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    doSearch(trimmed, category);
    const url = new URL(window.location.href);
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    window.history.replaceState({}, "", url.toString());
  }

  function onCategoryChange(cat: string) {
    setCategory(cat);
    doSearch(q, cat);
    const url = new URL(window.location.href);
    if (cat) url.searchParams.set("category", cat);
    else url.searchParams.delete("category");
    window.history.replaceState({}, "", url.toString());
  }

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const item of items) {
      const key = item.categoryLabel || "其他";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  return (
    <div>
      {/* 搜索 + 分类筛选 */}
      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索问题关键词…"
          aria-label="搜索问题"
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "搜索中…" : "搜索"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            className={[
              "rounded-full border px-3 py-1 text-xs transition-colors",
              (!category && !c.value) || category === c.value
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ 列表 */}
      <div className="mt-8">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-bg-alt p-10 text-center text-sm text-muted">
            还没有 FAQ 条目。站长尚未录入常见问题，可前往{" "}
            <Link href="/questions" className="text-primary underline-offset-4 hover:underline">
              匿名提问
            </Link>{" "}
            提交你的问题，或通过管理后台添加。
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([label, groupItems]) => (
              <section key={label}>
                <h2 className="text-lg font-serif font-semibold text-text mb-3">
                  <span className="border-l-2 border-accent pl-3">{label}</span>
                </h2>
                <div className="space-y-3">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className="card p-5 transition-colors hover:border-border-hover"
                    >
                      <h3 className="text-sm font-medium text-text">
                        {highlightText(item.question, initialQ)}
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-text leading-relaxed">
                        {highlightText(item.answer, initialQ)}
                      </p>
                      {item.source_type !== "manual" && (
                        <p className="mt-2 text-[10px] text-muted/70">
                          来源：{item.source_type === "comment" ? "留言区" : "匿名提问"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
