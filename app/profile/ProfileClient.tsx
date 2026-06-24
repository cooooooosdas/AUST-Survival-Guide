"use client";

import { useState, useMemo } from "react";
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

  const dicebearUrl = useMemo(() => {
    const s = seed.trim();
    if (!s) return null;
    return `${DICEBEAR_BASE}?seed=${encodeURIComponent(s)}`;
  }, [seed]);

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

  return (
    <div className="space-y-8">
      {/* 当前头像 */}
      <div className="flex items-center gap-5">
        <Avatar
          src={avatarUrl}
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

      {/* 头像地址 */}
      <section className="space-y-2">
        <label htmlFor="avatar-url" className="text-sm font-medium text-text">
          头像地址
        </label>
        <input
          id="avatar-url"
          type="url"
          value={avatarUrl ?? ""}
          onChange={(e) => handleAvatarUrlChange(e.target.value)}
          placeholder="https://example.com/avatar.png"
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="text-xs text-muted">
          粘贴任意图片链接。留空则显示彩色首字母头像。
        </p>
      </section>

      {/* 快速生成 */}
      <section className="space-y-3">
        <p className="text-sm font-medium text-text">快速生成头像（DiceBear）</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), useDicebear())}
            placeholder="输入任意文字生成独特头像"
            className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={useDicebear}
            disabled={!seed.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
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
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
          disabled={saving}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "保存中…" : saved ? "已保存 ✓" : "保存"}
        </button>
      </div>
    </div>
  );
}
