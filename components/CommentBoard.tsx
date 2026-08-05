"use client";

import { useMemo, useState, useCallback, memo } from "react";
import Link from "next/link";
import { postComment, replyToComment, deleteComment, moderateComment, pinComment } from "@/app/comments/actions";
import Avatar from "@/components/Avatar";
import type { Comment, CommentStatus, CommentTargetType } from "@/lib/types";
import { COMMENT_TAGS } from "@/lib/types";

type Props = {
  initial: Comment[];
  targetType: CommentTargetType;
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

// ============ 独立 CommentNode —— 用 memo 减少不必要的重渲染 ============

type CommentNodeProps = {
  node: TreeNode;
  depth: number;
  currentUserId: string | null;
  showModeration: boolean;
  onReply: (parentId: number, content: string) => Promise<void>;
  onDelete: (id: number) => void;
  onModerate: (id: number, status: "approved" | "rejected") => void;
  onPin: (id: number, pinned: boolean) => void;
  replyingId: number | null;
  setReplyingId: (id: number | null) => void;
  replyContent: string;
  setReplyContent: (s: string) => void;
  replying: boolean;
};

const CommentNode = memo(function CommentNode({
  node,
  depth,
  currentUserId,
  showModeration,
  onReply,
  onDelete,
  onModerate,
  onPin,
  replyingId,
  setReplyingId,
  replyContent,
  setReplyContent,
  replying,
}: CommentNodeProps) {
  const isMine = currentUserId !== null && node.user_id === currentUserId;
  const canModerate = showModeration && node.status !== "approved";
  const isReplying = replyingId === node.id;

  const handleSubmitReply = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onReply(node.id, replyContent);
    },
    [node.id, replyContent, onReply]
  );

  return (
    <li className={depth > 0 ? "ml-8 mt-3" : "mt-4"}>
      <div
        className={[
          "card p-4 transition-colors",
          node.pinned
            ? "border-amber-200 bg-accent-light"
            : "hover:border-border-hover",
          node.status === "rejected" ? "opacity-50" : "",
        ].join(" ")}
      >
        {node.pinned && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent-ghost px-2 py-0.5 text-[11px] font-medium text-accent">
            ★ 置顶
          </span>
        )}
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
          <Avatar
            src={node.avatar_url}
            name={node.display_name}
            size={32}
            className="mt-0.5 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span className="truncate font-medium text-text">
                {node.display_name || "匿名同学"}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <time>{formatTime(node.created_at)}</time>
                {isMine && node.id > 0 && (
                  <button
                    type="button"
                    onClick={() => onDelete(node.id)}
                    className="text-muted hover:text-red-600"
                  >
                    删除
                  </button>
                )}
                {!isMine && currentUserId && node.status === "approved" && (
                  <button
                    type="button"
                    onClick={() => setReplyingId(isReplying ? null : node.id)}
                    className="text-muted hover:text-primary"
                  >
                    回复
                  </button>
                )}
                {canModerate && (
                  <>
                    <button
                      type="button"
                      onClick={() => onModerate(node.id, "approved")}
                      className="text-green-600 hover:underline"
                    >
                      通过
                    </button>
                    <button
                      type="button"
                      onClick={() => onModerate(node.id, "rejected")}
                      className="text-red-600 hover:underline"
                    >
                      驳回
                    </button>
                  </>
                )}
                {showModeration && (
                  <button
                    type="button"
                    onClick={() => onPin(node.id, !node.pinned)}
                    className={
                      node.pinned ? "text-accent" : "text-muted hover:text-accent"
                    }
                  >
                    {node.pinned ? "取消置顶" : "置顶"}
                  </button>
                )}
              </span>
            </div>

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

            <p className="mt-2 whitespace-pre-wrap text-sm text-text">
              {node.content}
            </p>

            {isReplying && (
              <form onSubmit={handleSubmitReply} className="mt-3">
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
                    onClick={() => {
                      setReplyingId(null);
                      setReplyContent("");
                    }}
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

            {node.children.length > 0 && (
              <ul className="mt-3 space-y-3">
                {node.children.map((child) => (
                  <CommentNodeWrapper key={child.id} {...{ node: child, depth: depth + 1, currentUserId, showModeration, onReply, onDelete, onModerate, onPin, replyingId, setReplyingId, replyContent, setReplyContent, replying }} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
});
CommentNode.displayName = "CommentNode";

// 用 wrapper 解决递归组件 + memo 的类型问题
function CommentNodeWrapper(props: CommentNodeProps) {
  return <CommentNode {...props} />;
}

// ============ 主组件 ============

export default function CommentBoard({
  initial,
  targetType,
  targetId,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState(false);

  const tree = useMemo(
    () =>
      buildTree(
        comments.filter((c) => statusFilter === "all" || c.status === statusFilter)
      ),
    [comments, statusFilter]
  );

  const showModeration = currentUserId !== null && isAdmin(currentUserId);

  // ============ 稳定的回调，避免子组件重渲染 ============

  const handleReply = useCallback(
    async (parentId: number, text: string) => {
      setError(null);
      const trimmed = text.trim();
      if (!trimmed) return;
      setReplying(true);
      const res = await replyToComment({
        content: trimmed,
        target_type: targetType,
        target_id: targetId,
        parent_id: parentId,
      });
      if (!res.ok) {
        setError(res.error ?? "回复失败");
        setReplying(false);
        return;
      }
      setReplyingId(null);
      setReplyContent("");
      setReplying(false);
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          user_id: currentUserId ?? "",
          target_type: targetType,
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
    },
    [targetType, targetId, currentUserId]
  );

  const handleDelete = useCallback((id: number) => {
    if (!confirm("确定删除这条留言？")) return;
    void (async () => {
      const res = await deleteComment(id);
      if (!res.ok) {
        setError(res.error ?? "删除失败");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
    })();
  }, []);

  const handleModerate = useCallback(
    (id: number, status: "approved" | "rejected") => {
      void (async () => {
        const res = await moderateComment({ id, status });
        if (!res.ok) {
          setError(res.error ?? "操作失败");
          return;
        }
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      })();
    },
    []
  );

  const handlePin = useCallback((id: number, pinned: boolean) => {
    void (async () => {
      const res = await pinComment(id, pinned);
      if (!res.ok) {
        setError(res.error ?? "操作失败");
        return;
      }
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, pinned } : c))
      );
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return;
    setSubmitting(true);
    const res = await postComment({
      content: trimmed,
      target_type: targetType,
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
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user_id: currentUserId ?? "",
        target_type: targetType,
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

  // 递归渲染评论树
  const renderTree = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => (
      <CommentNodeWrapper
        key={node.id}
        node={node}
        depth={depth}
        currentUserId={currentUserId}
        showModeration={showModeration}
        onReply={handleReply}
        onDelete={handleDelete}
        onModerate={handleModerate}
        onPin={handlePin}
        replyingId={replyingId}
        setReplyingId={setReplyingId}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        replying={replying}
      />
    ));

  return (
    <div className="space-y-6">
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
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
                      ? "border-primary bg-primary-light font-medium text-primary"
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
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-bg-alt px-4 py-6 text-center text-sm text-muted">
          先{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            登录
          </Link>{" "}
          或{" "}
          <Link
            href="/signup"
            className="text-primary underline-offset-4 hover:underline"
          >
            注册
          </Link>{" "}
          才能留言。
        </div>
      )}

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

      <ul>
        {tree.length === 0 && (
          <li className="rounded-md border border-dashed border-border bg-bg-alt px-4 py-10 text-center text-sm text-muted">
            还没有人留言，来当第一个？
          </li>
        )}
        {renderTree(tree)}
      </ul>
    </div>
  );
}