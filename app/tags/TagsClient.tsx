"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tag as TagIcon, Hash, X, Sparkles } from "lucide-react";

type TagEntry = {
  name: string;
  count: number;
  items?: { title: string; href: string; type: string }[];
};

export default function TagsClient() {
  const [tags, setTags] = useState<TagEntry[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((json) => {
        setTags(json.tags ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function onTagClick(tagName: string) {
    setSelectedTag(tagName);
    const res = await fetch(`/api/tags?tag=${encodeURIComponent(tagName)}`);
    const json = await res.json();
    setTags((prev) =>
      prev.map((t) => (t.name === tagName ? { ...t, ...json } : t))
    );
  }

  // 按 count 计算字号（对数缩放）：count 1 → text-sm, count 最大 → text-3xl
  const cloud = useMemo(() => {
    if (tags.length === 0) return [];
    const max = Math.max(...tags.map((t) => t.count));
    const min = Math.min(...tags.map((t) => t.count));
    const range = Math.max(max - min, 1);
    return tags.map((t) => {
      const ratio = (t.count - min) / range; // 0..1
      // 对数缩放让视觉差异更平滑
      const scale = Math.pow(ratio, 0.7);
      return { ...t, scale };
    });
  }, [tags]);

  function fontClass(scale: number) {
    if (scale > 0.85) return "text-3xl font-semibold";
    if (scale > 0.7) return "text-2xl font-semibold";
    if (scale > 0.5) return "text-xl font-medium";
    if (scale > 0.3) return "text-base font-medium";
    return "text-sm";
  }

  if (loading) {
    return (
      <p className="mt-6 flex items-center gap-2 text-sm text-muted">
        <TagIcon className="h-3.5 w-3.5 animate-pulse" strokeWidth={2} />
        加载中…
      </p>
    );
  }

  if (tags.length === 0) {
    return (
      <p className="mt-6 rounded-md border border-dashed border-border bg-bg-alt p-8 text-center text-sm text-muted">
        暂无标签
      </p>
    );
  }

  const selected = selectedTag ? tags.find((t) => t.name === selectedTag) : null;

  return (
    <div>
      {/* Word Cloud —— 字号随 count 变化 */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted">
            <Sparkles className="h-3 w-3" strokeWidth={2} />
            按热门度排列 · {tags.length} 个标签
          </h2>
          {selectedTag && (
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="motion-press inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-text"
            >
              <X className="h-3 w-3" strokeWidth={2} />
              清除选择
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 py-4">
          {cloud.map((t) => {
            const active = selectedTag === t.name;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => onTagClick(t.name)}
                aria-pressed={active}
                className={[
                  "motion-press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-200",
                  fontClass(t.scale),
                  active
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-primary hover:bg-primary-light/30",
                ].join(" ")}
              >
                <Hash className="self-center text-[10px] text-muted/60" strokeWidth={2} />
                <span>{t.name}</span>
                <span className="font-mono text-[10px] text-muted/70">
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 选中标签的内容 */}
      {selected && selected.items && selected.items.length > 0 && (
        <section className="mt-10 border-t border-border pt-6">
          <header className="mb-4 flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-xl font-semibold text-text">
              #{selected.name}
            </h3>
            <span className="font-mono text-xs text-muted">
              {selected.items.length} 个内容
            </span>
          </header>
          <div className="space-y-2">
            {selected.items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group flex items-start gap-3 rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/30"
              >
                <span className="shrink-0 rounded bg-accent-light px-2 py-0.5 font-mono text-[10px] text-accent">
                  {item.type}
                </span>
                <span className="text-sm text-text transition-colors group-hover:text-primary">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {selected && (!selected.items || selected.items.length === 0) && (
        <p className="mt-8 rounded-md border border-dashed border-border bg-bg-alt p-6 text-center text-sm text-muted">
          标签 <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-text">#{selected?.name}</code> 下暂无内容
        </p>
      )}
    </div>
  );
}