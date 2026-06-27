"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TagEntry = {
  name: string;
  count: number;
  items: { title: string; href: string; type: string }[];
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

  if (loading) {
    return <p className="mt-6 text-sm text-muted">加载中…</p>;
  }

  if (tags.length === 0) {
    return <p className="mt-6 text-sm text-muted">暂无标签</p>;
  }

  const selected = selectedTag ? tags.find((t) => t.name === selectedTag) : null;

  return (
    <div>
      {/* Tag cloud */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.name}
            type="button"
            onClick={() => onTagClick(tag.name)}
            className={[
              "rounded-lg border px-3 py-1.5 text-sm transition-all duration-200",
              selectedTag === tag.name
                ? "border-primary bg-primary-light text-primary font-medium"
                : "border-border text-muted hover:border-primary hover:text-primary active:scale-95",
            ].join(" ")}
          >
            #{tag.name}
            <span className="ml-1.5 text-xs text-muted/60">({tag.count})</span>
          </button>
        ))}
      </div>

      {/* Selected tag items */}
      {selected && selected.items && selected.items.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-serif font-semibold text-text">
            标签 &ldquo;{selected.name}&rdquo; 相关的内容 ({selected.items.length})
          </h2>
          <div className="mt-4 space-y-3">
            {selected.items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group card card-hover p-4 flex items-start gap-3"
              >
                <span className="shrink-0 rounded-lg bg-accent-light px-2 py-1 text-[11px] text-accent font-medium">
                  {item.type}
                </span>
                <span className="text-sm text-text group-hover:text-primary transition-colors">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {selected && (!selected.items || selected.items.length === 0) && (
        <p className="mt-6 text-sm text-muted">该标签下暂无内容</p>
      )}
    </div>
  );
}
