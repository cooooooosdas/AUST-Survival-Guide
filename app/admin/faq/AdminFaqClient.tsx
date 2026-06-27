"use client";

import { useEffect, useState } from "react";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const CATEGORY_LIST = [
  { value: "general", label: "综合" },
  { value: "high-math", label: "高数问题" },
  { value: "course-select", label: "选课疑问" },
  { value: "software", label: "软件安装" },
  { value: "ai-tools", label: "AI 工具使用" },
];

const EMPTY: FaqItem = {
  id: 0,
  question: "",
  answer: "",
  category: "general",
  sort_order: 0,
  is_published: true,
  created_at: "",
  updated_at: "",
};

export default function AdminFaqClient() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function loadItems() {
    try {
      const res = await fetch("/api/admin/faq");
      if (res.ok) {
        const json = await res.json();
        setItems(json.items ?? []);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data-fetch-on-mount is a standard pattern
    loadItems();
  }, []);

  function startCreate() {
    setEditing({ ...EMPTY, id: 0 });
    setCreating(true);
    setError(null);
  }

  function startEdit(item: FaqItem) {
    setEditing({ ...item });
    setCreating(false);
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setCreating(false);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!editing) return;
    const q = editing.question.trim();
    const a = editing.answer.trim();
    if (!q || !a) {
      setError("问题和答案不能为空");
      return;
    }
    setSaving(true);
    try {
      const url = creating ? "/api/admin/faq" : "/api/admin/faq";
      const method = "POST";
      const body = creating
        ? {
            question: q,
            answer: a,
            category: editing.category,
            sort_order: editing.sort_order,
            is_published: editing.is_published,
          }
        : { ...editing, question: q, answer: a };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "保存失败");
        setSaving(false);
        return;
      }

      const json = await res.json();
      if (creating) {
        setItems((prev) => [json.item, ...prev]);
      } else {
        setItems((prev) => prev.map((i) => (i.id === json.item.id ? json.item : i)));
      }
      cancelEdit();
    } catch {
      setError("网络错误");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("确定删除这条 FAQ？")) return;
    const res = await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  function updateField(field: keyof FaqItem, value: string | number | boolean) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">共 {items.length} 条</p>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          新建 FAQ
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {/* 编辑表单 */}
      {editing && (
        <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-border bg-bg-alt p-5">
          <p className="text-sm font-medium text-primary">{creating ? "新建 FAQ" : "编辑 FAQ"}</p>
          <div>
            <label htmlFor="faq-q" className="mb-1 block text-xs text-muted">
              问题
            </label>
            <input
              id="faq-q"
              value={editing.question}
              onChange={(e) => updateField("question", e.target.value)}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="用户会问的问题"
            />
          </div>
          <div>
            <label htmlFor="faq-a" className="mb-1 block text-xs text-muted">
              答案
            </label>
            <textarea
              id="faq-a"
              value={editing.answer}
              onChange={(e) => updateField("answer", e.target.value)}
              rows={6}
              className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="详细回答，支持换行"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="faq-cat" className="mb-1 block text-xs text-muted">
                分类
              </label>
              <select
                id="faq-cat"
                value={editing.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="faq-sort" className="mb-1 block text-xs text-muted">
                排序权重
              </label>
              <input
                id="faq-sort"
                type="number"
                value={editing.sort_order}
                onChange={(e) => updateField("sort_order", Number(e.target.value))}
                className="w-24 rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => updateField("is_published", e.target.checked)}
                  className="rounded border-border accent-primary"
                />
                已发布
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "保存中…" : "保存"}
            </button>
          </div>
        </form>
      )}

      {/* 列表 */}
      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-bg-alt px-4 py-10 text-center text-sm text-muted">
          还没有 FAQ 条目，点击上方「新建 FAQ」添加。
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border border-border bg-bg-alt p-4 ${
                item.is_published ? "" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-primary">
                      {CATEGORY_LIST.find((c) => c.value === item.category)?.label ?? item.category}
                    </span>
                    <span>排序 {item.sort_order}</span>
                    {!item.is_published && <span className="text-yellow-600">未发布</span>}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-primary">{item.question}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-text/80">{item.answer}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-xs text-muted hover:text-primary"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-muted hover:text-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
