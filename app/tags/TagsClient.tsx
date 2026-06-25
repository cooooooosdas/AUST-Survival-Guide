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
    // Update the tag entry with items
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
              "rounded-full border px-3 py-1 text-sm transition-colors",
              selectedTag === tag.name
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            #{tag.name}
            <span className="ml-1 text-xs text-muted">({tag.count})</span>
          </button>
        ))}
      </div>

      {/* Selected tag items */}
      {selected && selected.items && selected.items.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary mb-4">
            标签 &ldquo;{selected.name}&rdquo; 相关的内容 ({selected.items.length})
          </h2>
          <div className="space-y-3">
            {selected.items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-border bg-bg-alt p-4 transition-colors hover:border-primary/20"
              >
                <span className="shrink-0 rounded-md bg-primary-light px-1.5 py-0.5 text-[11px] text-primary">
                  {item.type}
                </span>
                <span className="text-sm text-text">{item.title}</span>
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
