"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { postComment, deleteComment } from "@/app/comments/actions";
import Avatar from "@/components/Avatar";
import type { Comment, CommentTargetType } from "@/lib/types";

type Props = {
  initial: Comment[];
  targetType: CommentTargetType;
  targetId: string;
  currentUserId: string | null;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export default function CommentBoard({
  initial,
  targetType,
  targetId,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const res = await postComment({
        content: trimmed,
        target_type: targetType,
        target_id: targetId,
      });
      if (!res.ok) {
        setError(res.error ?? "发送失败");
        return;
      }
      setContent("");
      // 简单地把自己的发言塞到最前，等下一次 revalidate 时会被真实数据覆盖
      setComments((prev) => [
        {
          id: -Date.now(),
          user_id: currentUserId ?? "",
          target_type: targetType,
          target_id: targetId,
          content: trimmed,
          created_at: new Date().toISOString(),
          display_name: "我",
          avatar_url: null,
        },
        ...prev,
      ]);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("确定删除这条留言？")) return;
    startTransition(async () => {
      const res = await deleteComment(id);
      if (!res.ok) {
        setError(res.error ?? "删除失败");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="space-y-8">
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="comment-input" className="sr-only">
            写下你的留言
          </label>
          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写点什么…（最多 2000 字）"
            maxLength={2000}
            rows={4}
            aria-describedby="comment-counter"
            className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex items-center justify-between">
            <span id="comment-counter" className="text-xs text-muted">
              {content.length}/2000
            </span>
            <button
              type="submit"
              disabled={pending || !content.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "发送中…" : "发送"}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-bg-alt px-4 py-6 text-center text-sm text-muted">
          先{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            登录
          </Link>{" "}
          或{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            注册
          </Link>{" "}
          才能留言。
        </div>
      )}

      <ul className="space-y-4">
        {comments.length === 0 && (
          <li className="rounded-md border border-dashed border-border bg-bg-alt px-4 py-10 text-center text-sm text-muted">
            还没有人留言，来当第一个？
          </li>
        )}
        {comments.map((c) => {
          const isMine = currentUserId && c.user_id === currentUserId;
          return (
            <li
              key={c.id}
              className="rounded-md border border-border bg-bg px-4 py-3 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={c.avatar_url}
                  name={c.display_name}
                  size={32}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted">
                    <span className="truncate font-medium text-text">
                      {c.display_name || "匿名同学"}
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <time>{formatTime(c.created_at)}</time>
                      {isMine && c.id > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          disabled={pending}
                          aria-label="删除这条留言"
                          className="text-muted hover:text-red-600 disabled:opacity-50"
                        >
                          删除
                        </button>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-text">
                    {c.content}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
