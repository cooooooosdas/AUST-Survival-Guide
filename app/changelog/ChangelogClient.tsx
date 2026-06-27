"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Changelog = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  general: "综合",
  "high-math": "高数笔记",
  software: "软件资源",
  letter: "学长来信",
  feature: "新功能",
};

export default function ChangelogClient() {
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/changelogs")
      .then((r) => r.json())
      .then((json) => {
        setChangelogs(json.changelogs ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  if (loading) {
    return <p className="mt-6 text-sm text-muted">加载中…</p>;
  }

  if (changelogs.length === 0) {
    return (
      <div className="mt-8 rounded-md border border-dashed border-border bg-bg-alt p-10 text-center text-sm text-muted">
        暂无更新记录。
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {changelogs.map((log) => (
        <article
          key={log.id}
          className="rounded-xl border border-border bg-bg-alt p-5 transition-colors hover:border-primary/20"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <time>{formatDate(log.created_at)}</time>
            <span className="rounded-md border border-border px-1.5 py-0.5">
              {CATEGORY_LABEL[log.category] ?? "综合"}
            </span>
          </div>
          <h2 className="mt-2 text-base font-serif font-medium text-text">{log.title}</h2>
          <p className="mt-2 text-sm text-text whitespace-pre-wrap leading-relaxed">
            {log.content}
          </p>
        </article>
      ))}
    </div>
  );
}
