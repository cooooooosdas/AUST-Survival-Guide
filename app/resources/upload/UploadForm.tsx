"use client";

import { useState } from "react";

type Props = {
  categories: { value: string; label: string }[];
};

export default function UploadForm({ categories }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("请选择文件");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("category", category);

      const res = await fetch("/api/resources", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "上传失败");
      }
      setSuccess(true);
      setTitle("");
      setDescription("");
      setCategory("other");
      setFile(null);
      setTimeout(() => {
        window.location.href = "/resources";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-text">选择文件</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={[
            "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
            dragOver
              ? "border-primary bg-primary-light"
              : "border-border bg-bg-alt hover:border-primary/50",
          ].join(" ")}
        >
          <input
            type="file"
            onChange={onFileChange}
            className="hidden"
            id="resource-file"
          />
          <label htmlFor="resource-file" className="cursor-pointer text-center">
            <p className="text-2xl">📎</p>
            <p className="mt-2 text-sm text-muted">
              {file ? file.name : "点击或拖拽文件到此处"}
            </p>
            {file && (
              <p className="mt-1 text-xs text-muted">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </label>
        </div>
        <p className="mt-1 text-xs text-muted">
          支持 PDF、Markdown、压缩包、软件安装包等，最大 100 MB。
        </p>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="例如：高数上 期末复习提纲"
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-text">
          描述
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="这个资源是什么、怎么用…"
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text">
          分类 <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {success && (
        <p role="status" className="text-sm text-green-700">
          上传成功！正在跳转到资源列表…
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "上传中…" : "上传"}
      </button>
    </form>
  );
}
