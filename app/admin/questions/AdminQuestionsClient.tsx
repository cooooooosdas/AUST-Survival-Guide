"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Question = {
  id: number;
  content: string;
  category: string;
  status: string;
  reply: string | null;
  replied_at: string | null;
  is_public: boolean;
  created_at: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  general: "综合",
  "high-math": "高数问题",
  "course-select": "选课疑问",
  software: "软件安装",
  "ai-tools": "AI 工具使用",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待回复",
  answered: "已回复",
  public: "已公开",
  rejected: "已驳回",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  answered: "bg-blue-100 text-blue-700",
  public: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminQuestionsClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [replying, setReplying] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [filter]);

  async function loadQuestions() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      const res = await fetch(`/api/questions?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setQuestions(json.questions ?? []);
      }
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(id: number) {
    const reply = replyTexts[id]?.trim();
    if (!reply) return;
    setReplying(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, status: "answered" }),
      });
      if (res.ok) {
        setReplyTexts((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        loadQuestions();
      }
    } catch {
      // ignore
    } finally {
      setReplying(null);
    }
  }

  async function handlePublish(id: number, isPublic: boolean) {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: isPublic, status: isPublic ? "public" : "answered" }),
      });
      if (res.ok) loadQuestions();
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("确定删除这条提问？")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      if (res.ok) loadQuestions();
    } catch {
      // ignore
    }
  }

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["pending", "answered", "public", "rejected"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={[
              "rounded-full border px-3 py-1 text-xs transition-colors",
              filter === s
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {STATUS_LABEL[s] ?? s}
          </button>
        ))}
      </div>

      {/* 提问列表 */}
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">加载中…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-muted">该分类下暂无提问。</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-border bg-bg-alt p-5 transition-colors hover:border-primary/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[11px] ${STATUS_CLASS[q.status] ?? "bg-gray-100"}`}
                      >
                        {STATUS_LABEL[q.status] ?? q.status}
                      </span>
                      <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
                        {CATEGORY_LABEL[q.category] ?? "综合"}
                      </span>
                      {q.is_public && (
                        <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[11px] text-green-700">
                          已公开
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-text whitespace-pre-wrap">{q.content}</p>
                    {q.reply && (
                      <div className="mt-3 rounded-md border border-border bg-bg p-3">
                        <p className="text-xs text-muted mb-1">回复：</p>
                        <p className="text-sm text-text whitespace-pre-wrap">{q.reply}</p>
                      </div>
                    )}
                    <time className="mt-2 block text-[11px] text-muted">
                      {new Date(q.created_at).toLocaleString("zh-CN")}
                    </time>
                  </div>
                </div>

                {/* 操作 */}
                {q.status !== "public" && (
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    {!q.reply && (
                      <div>
                        <textarea
                          value={replyTexts[q.id] ?? ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="输入回复内容…"
                          maxLength={2000}
                          rows={3}
                          className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReply(q.id)}
                            disabled={replying === q.id || !replyTexts[q.id]?.trim()}
                            className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {replying === q.id ? "提交中…" : "回复"}
                          </button>
                        </div>
                      </div>
                    )}
                    {q.reply && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handlePublish(q.id, true)}
                          className="rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs text-green-700 hover:bg-green-100"
                        >
                          公开到 FAQ
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePublish(q.id, false)}
                          className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary"
                        >
                          仅回复不公开
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100"
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
