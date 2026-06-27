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
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-accent-light px-0.5 text-accent">{part}</mark>
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
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialQRef = useRef(initialQ);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((json) => setHot(json.hot ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQ) {
      doSearch(initialQ);
    }
  }, []);

  async function doSearch(query: string) {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "搜索失败");
      }
      const json = await res.json();
      setResults(json.results ?? []);
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "搜索失败");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!q.trim() || q === initialQRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(q.trim()), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    doSearch(trimmed);
    const url = new URL(window.location.href);
    url.searchParams.set("q", trimmed);
    window.history.replaceState({}, "", url.toString());
  }

  const hotSearches = useMemo(() => hot.filter((h) => h.query !== initialQ), [hot, initialQ]);

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：高数、C语言、教务处、AI工具…"
          aria-label="搜索"
          autoFocus
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "搜索中…" : "搜索"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {/* 热门搜索 */}
      {hotSearches.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-muted uppercase tracking-widest mb-3 font-medium">
            {results.length === 0 && initialQ ? "试试这些热门搜索" : "热门搜索"}
          </p>
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
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:border-primary hover:text-primary active:scale-95"
              >
                {h.query}
                <span className="ml-1.5 text-[10px] text-muted/60">{h.count}</span>
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
                  className="group card card-hover p-5 flex items-start gap-3"
                >
                  <span className={`shrink-0 rounded-lg px-2 py-1 text-[11px] leading-4 font-medium ${r.typeClass}`}>
                    {r.typeLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
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
