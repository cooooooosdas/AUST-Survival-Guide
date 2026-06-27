"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { value: "general", label: "综合" },
  { value: "high-math", label: "高数问题" },
  { value: "course-select", label: "选课疑问" },
  { value: "software", label: "软件安装" },
  { value: "ai-tools", label: "AI 工具使用" },
];

export default function AskPage() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) {
      setError("请输入你的问题");
      return;
    }
    if (trimmed.length > 2000) {
      setError("问题太长（≤ 2000 字）");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, category }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "提交失败");
      }
      setSuccess(true);
      setContent("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">匿名提问</h1>
      <p className="mt-2 text-sm text-muted">
        有问题不敢问？匿名提出来，管理员会回复你。被采纳的好问题会被公开到 FAQ 页面。
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text">
            问题分类
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-text">
            你的问题 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="比如：高数上怎么复习？选课系统一直进不去怎么办？"
            maxLength={2000}
            rows={6}
            className="mt-1 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-muted">{content.length}/2000</p>
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {success && (
          <p role="status" className="text-sm text-green-700">
            提问成功！管理员看到后会回复你。优质问题会被公开到 FAQ。
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "提交中…" : "匿名提问"}
        </button>
      </form>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-serif font-semibold text-text">常见问题</h2>
        <p className="mt-1 text-sm text-muted">
          先看看 FAQ 里有没有你要的答案：
        </p>
        <Link
          href="/faq"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:underline"
        >
          浏览常见问题 →
        </Link>
      </div>
    </div>
  );
}
