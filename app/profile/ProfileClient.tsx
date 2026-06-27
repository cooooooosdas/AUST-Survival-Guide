"use client";

import { useRef, useState, useEffect } from "react";
import Avatar from "@/components/Avatar";
import { updateProfile } from "./actions";

type Props = {
  initialAvatarUrl: string | null;
  initialDisplayName: string;
  userEmail: string;
};

const PRESET_SEEDS = [
  "Felix", "Aneka", "Zack", "Luna", "Leo",
  "Mimi", "Rocky", "Shadow", "Snow", "Pudding",
];
const DICEBEAR_BASE = "https://api.dicebear.com/9.x/notionists/svg";

export default function ProfileClient({ initialAvatarUrl, initialDisplayName, userEmail }: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [seed, setSeed] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const dicebearUrl = (() => {
    const s = seed.trim();
    return s ? `${DICEBEAR_BASE}?seed=${encodeURIComponent(s)}` : null;
  })();

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateProfile({
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl,
      });
      setSaved(true);
      setLocalPreview(null);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  function pickPreset(s: string) {
    setAvatarUrl(`${DICEBEAR_BASE}?seed=${encodeURIComponent(s)}`);
    setSeed(s);
  }

  function useDicebear() {
    const s = seed.trim();
    if (!s) return;
    setAvatarUrl(`${DICEBEAR_BASE}?seed=${encodeURIComponent(s)}`);
  }

  const handleAvatarUrlChange = (v: string) => {
    setAvatarUrl(v || null);
    if (v) setSeed("");
  };

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // 类型/大小再校验一次（服务端也校验，双重保险）
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("仅支持 JPG / PNG / WebP / GIF");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(`文件 ${(file.size / 1024).toFixed(0)} KB，超过 2 MB 限制`);
      return;
    }

    // 本地即时预览
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    // 上传
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (avatarUrl) fd.append("old_url", avatarUrl);

      const res = await fetch("/api/avatar/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "上传失败");

      setAvatarUrl(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "上传失败");
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const displaySrc = localPreview ?? avatarUrl;

  return (
    <div className="space-y-8">
      {/* 当前头像预览 */}
      <div className="flex items-center gap-5">
        <Avatar
          src={displaySrc}
          name={displayName || undefined}
          email={userEmail}
          size={80}
        />
        <div>
          <p className="text-sm font-medium text-text">
            {displayName || userEmail?.split("@")[0] || "同学"}
          </p>
          <p className="text-xs text-muted">{userEmail}</p>
        </div>
      </div>

      {/* 本地上传 */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-text">本地上传</p>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer rounded-xl border border-dashed border-border bg-bg-alt px-4 py-3 text-sm text-muted transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]">
            {uploading ? "上传中…" : "选择文件"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
              disabled={uploading}
            />
          </label>
          {localPreview && !uploading && (
            <img
              src={localPreview}
              alt="上传预览"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </div>
        <p className="text-xs text-muted">
          支持 JPG / PNG / WebP / GIF，最大 2 MB。选完自动上传。
        </p>
      </section>

      {/* 头像地址 */}
      <section className="space-y-2">
        <label htmlFor="avatar-url" className="text-sm font-medium text-text">
          或粘贴头像链接
        </label>
        <input
          id="avatar-url"
          type="url"
          value={avatarUrl ?? ""}
          onChange={(e) => handleAvatarUrlChange(e.target.value)}
          placeholder="https://example.com/avatar.png"
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="text-xs text-muted">
          留空则显示彩色首字母头像。本地上传和粘贴链接二选一即可。
        </p>
      </section>

      {/* 快速生成 */}
      <section className="space-y-3">
        <label htmlFor="dicebear-seed" className="text-sm font-medium text-text">快速生成头像（DiceBear）</label>
        <div className="flex gap-2">
          <input
            id="dicebear-seed"
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), useDicebear())}
            placeholder="输入任意文字生成独特头像"
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={useDicebear}
            disabled={!seed.trim()}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            生成
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pickPreset(s)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:border-accent hover:text-accent active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        {dicebearUrl && (
          <div className="flex items-center gap-3">
            <img
              src={dicebearUrl}
              alt="预览"
              width={48}
              height={48}
              className="rounded-full"
            />
            <button
              type="button"
              onClick={() => setAvatarUrl(dicebearUrl)}
              className="text-sm text-primary transition-colors hover:text-primary-hover hover:underline"
            >
              使用此头像
            </button>
          </div>
        )}
      </section>

      {/* 昵称 */}
      <section className="space-y-2">
        <label htmlFor="display-name" className="text-sm font-medium text-text">
          昵称
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={32}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </section>

      {/* 错误 / 提交 */}
      {error && (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "保存中…" : saved ? "已保存 ✓" : "保存"}
        </button>
      </div>
    </div>
  );
}
