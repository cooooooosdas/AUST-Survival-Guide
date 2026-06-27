"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { postComment, replyToComment, deleteComment } from "@/app/comments/actions";
import { moderateComment, pinComment } from "@/app/comments/actions";
import Avatar from "@/components/Avatar";
import type { Comment, CommentStatus } from "@/lib/types";
import { COMMENT_TAGS } from "@/lib/types";

type Props = {
  initial: Comment[];
  targetType: string;
  targetId: string;
  currentUserId: string | null;
};

const COMMENT_TAGS_LIST: readonly string[] = COMMENT_TAGS;
const STATUS_OPTIONS: { value: CommentStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "approved", label: "已通过" },
  { value: "pending", label: "待审核" },
  { value: "rejected", label: "已驳回" },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

type TreeNode = Comment & { children: TreeNode[] };

function buildTree(comments: Comment[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, children: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // 排序：pinned 在前，然后按时间倒序
  const sortFn = (a: TreeNode, b: TreeNode) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  };
  roots.sort(sortFn);
  for (const node of map.values()) {
    node.children.sort(sortFn);
  }

  return roots;
}

function isAdmin(userId: string | null): boolean {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
  return adminId ? userId === adminId : false;
}

export default function CommentBoard({
  initial,
  targetType,
  targetId,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState(false);

  const tree = useMemo(
    () => buildTree(comments.filter((c) => statusFilter === "all" || c.status === statusFilter)),
    [comments, statusFilter]
  );

  const showModeration = currentUserId && isAdmin(currentUserId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return;
    setSubmitting(true);
    const res = await postComment({
      content: trimmed,
      target_type: targetType as any,
      target_id: targetId,
      parent_id: null,
      tags: selectedTags,
    });
    if (!res.ok) {
      setError(res.error ?? "发送失败");
      setSubmitting(false);
      return;
    }
    setContent("");
    setSelectedTags([]);
    setSubmitting(false);
    // 乐观更新
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user_id: currentUserId ?? "",
        target_type: targetType as any,
        target_id: targetId,
        content: trimmed,
        created_at: new Date().toISOString(),
        display_name: "我",
        avatar_url: null,
        parent_id: null,
        status: "approved",
        tags: selectedTags,
        pinned: false,
        pinned_at: null,
      },
    ]);
  }

  async function handleReply(parentId: number) {
    setError(null);
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    setReplying(true);
    const res = await replyToComment({
      content: trimmed,
      target_type: targetType as any,
      target_id: targetId,
      parent_id: parentId,
    });
    if (!res.ok) {
      setError(res.error ?? "回复失败");
      setReplying(false);
      return;
    }
    setReplyTo(null);
    setReplyContent("");
    setReplying(false);
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user_id: currentUserId ?? "",
        target_type: targetType as any,
        target_id: targetId,
        content: trimmed,
        created_at: new Date().toISOString(),
        display_name: "我",
        avatar_url: null,
        parent_id: parentId,
        status: "approved",
        tags: [],
        pinned: false,
        pinned_at: null,
      },
    ]);
  }

  async function handleDelete(id: number) {
    if (!confirm("确定删除这条留言？")) return;
    const res = await deleteComment(id);
    if (!res.ok) {
      setError(res.error ?? "删除失败");
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleModerate(id: number, status: "approved" | "rejected") {
    const res = await moderateComment({ id, status });
    if (!res.ok) {
      setError(res.error ?? "操作失败");
      return;
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  async function handlePin(id: number, pinned: boolean) {
    const res = await pinComment(id, pinned);
    if (!res.ok) {
      setError(res.error ?? "操作失败");
      return;
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, pinned } : c)));
  }

  function renderNode(node: TreeNode, depth = 0) {
    const isMine = currentUserId && node.user_id === currentUserId;
    const canModerate = showModeration && node.status !== "approved";

    return (
      <li key={node.id} className={depth > 0 ? "ml-8 mt-3" : "mt-4"}>
        <div
          className={[
            "card p-4 transition-colors",
            node.pinned
              ? "border-amber-200 bg-accent-light"
              : "hover:border-border-hover",
            node.status === "rejected" ? "opacity-50" : "",
          ].join(" ")}
        >
          {/* 置顶标识 */}
          {node.pinned && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent-ghost px-2 py-0.5 text-[11px] text-accent font-medium">
              ★ 置顶
            </span>
          )}
          {/* 状态标识 */}
          {node.status === "pending" && (
            <span className="mb-2 ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] text-yellow-700">
              待审核
            </span>
          )}
          {node.status === "rejected" && (
            <span className="mb-2 ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-600">
              已驳回
            </span>
          )}

          <div className="flex items-start gap-3">
            <Avatar src={node.avatar_url} name={node.display_name} size={32} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span className="truncate font-medium text-text">
                  {node.display_name || "匿名同学"}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <time>{formatTime(node.created_at)}</time>
                  {isMine && node.id > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(node.id)}
                      className="text-muted hover:text-red-600"
                    >
                      删除
                    </button>
                  )}
                  {!isMine && currentUserId && node.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(replyTo === node.id ? null : node.id)}
                      className="text-muted hover:text-primary"
                    >
                      回复
                    </button>
                  )}
                  {canModerate && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleModerate(node.id, "approved")}
                        className="text-green-600 hover:underline"
                      >
                        通过
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate(node.id, "rejected")}
                        className="text-red-600 hover:underline"
                      >
                        驳回
                      </button>
                    </>
                  )}
                  {showModeration && (
                    <button
                      type="button"
                      onClick={() => handlePin(node.id, !node.pinned)}
                      className={node.pinned ? "text-accent" : "text-muted hover:text-accent"}
                    >
                      {node.pinned ? "取消置顶" : "置顶"}
                    </button>
                  )}
                </span>
              </div>

              {/* 标签 */}
              {node.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {node.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-primary-light px-1.5 py-0.5 text-[10px] text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-2 whitespace-pre-wrap text-sm text-text">{node.content}</p>

              {/* 回复框 */}
              {replyTo === node.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(node.id);
                  }}
                  className="mt-3"
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`回复 ${node.display_name || "这条留言"}…`}
                    aria-label={`回复 ${node.display_name || "这条留言"}`}
                    maxLength={2000}
                    rows={3}
                    className="w-full resize-y rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => { setReplyTo(null); setReplyContent(""); }}
                      className="rounded-md border border-border px-3 py-1 text-xs text-muted hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={replying || !replyContent.trim()}
                      className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {replying ? "发送中…" : "回复"}
                    </button>
                  </div>
                </form>
              )}

              {/* 子评论 */}
              {node.children.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {node.children.map((child) => renderNode(child, depth + 1))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="space-y-6">
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 标签选择 */}
          <div className="flex flex-wrap gap-2">
            {COMMENT_TAGS_LIST.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      active ? prev.filter((t) => t !== tag) : [...prev, tag]
                    )
                  }
                  className={[
                    "rounded-lg border px-2.5 py-1.5 text-xs transition-all duration-200",
                    active
                      ? "border-primary bg-primary-light text-primary font-medium"
                      : "border-border text-muted hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  {tag}
                </button>
              );
            })}
          </div>

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
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{content.length}/2000</span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "发送中…" : "发送"}
            </button>
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-bg-alt px-4 py-6 text-center text-sm text-muted">
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

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted">筛选：</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={[
              "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              statusFilter === opt.value
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 留言树 */}
      <ul>
        {tree.length === 0 && (
          <li className="rounded-md border border-dashed border-border bg-bg-alt px-4 py-10 text-center text-sm text-muted">
            还没有人留言，来当第一个？
          </li>
        )}
        {tree.map((node) => renderNode(node))}
      </ul>
    </div>
  );
}
