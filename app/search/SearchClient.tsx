"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Result = {
  id: string;
  type: "letter" | "link" | "section";
  title: string;
  text: string;
  tags: string[];
  href: string;
  section?: string;
  groupTitle?: string;
  typeLabel: string;
  typeClass: string;
};

type HotSearch = { query: string; count: number };

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const terms = escaped.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;

  const pattern = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="rounded bg-accent/30 px-0.5 text-primary">{part}</mark>
    ) : (
      part
    )
  );
}

export default function SearchClient({ initialQ }: { initialQ: string }) {
  const [q, setQ] = useState(initialQ);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [hot, setHot] = useState<HotSearch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 加载热门搜索
    fetch("/api/search")
      .then((r) => r.json())
      .then((json) => setHot(json.hot ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQ) {
      doSearch(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "搜索失败");
      }
      const json = await res.json();
      setResults(json.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜索失败");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    doSearch(trimmed);
    // 更新 URL 但不跳转
    const url = new URL(window.location.href);
    url.searchParams.set("q", trimmed);
    window.history.replaceState({}, "", url.toString());
  }

  const hotSearches = useMemo(() => hot.filter((h) => h.query !== initialQ), [hot, initialQ]);

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：高数、C语言、教务处、AI工具…"
          autoFocus
          className="flex-1 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "搜索中…" : "搜索"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {/* 热门搜索 */}
      {hotSearches.length > 0 && !initialQ && (
        <div className="mt-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">热门搜索</p>
          <div className="flex flex-wrap gap-2">
            {hotSearches.slice(0, 10).map((h) => (
              <button
                key={h.query}
                type="button"
                onClick={() => {
                  setQ(h.query);
                  doSearch(h.query);
                  const url = new URL(window.location.href);
                  url.searchParams.set("q", h.query);
                  window.history.replaceState({}, "", url.toString());
                }}
                className="rounded-full border border-border bg-bg-alt px-3 py-1 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
              >
                {h.query}
                <span className="ml-1 text-[10px] text-muted/70">({h.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 结果 */}
      {results.length > 0 && (
        <div className="mt-8">
          <p className="text-xs text-muted mb-4">
            共 {results.length} 个结果
            {initialQ ? <> · 「{initialQ}」</> : null}
          </p>
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={r.id}>
                <Link
                  href={r.href}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-bg-alt p-4 transition-colors hover:border-primary/30 hover:bg-bg"
                >
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ${r.typeClass}`}>
                    {r.typeLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary group-hover:underline">
                      {highlightText(r.title, initialQ)}
                    </p>
                    {r.text && (
                      <p className="mt-1 text-xs text-muted line-clamp-2">
                        {highlightText(r.text, initialQ)}
                      </p>
                    )}
                    {r.groupTitle && (
                      <p className="mt-1 text-[10px] text-muted/70">{r.groupTitle}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !initialQ && results.length === 0 && (
        <p className="mt-6 text-sm text-muted">输入关键词开始搜索</p>
      )}
      {!loading && initialQ && results.length === 0 && (
        <p className="mt-6 text-sm text-muted">没有找到相关内容，换个关键词试试。</p>
      )}
    </div>
  );
}
