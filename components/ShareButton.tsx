"use client";

import { useState } from "react";

type Props = {
  targetType: string;
  targetId: string;
  title: string;
  excerpt?: string;
  url?: string;
};

type Channel = "wechat" | "wechat_moments" | "copy_link";

const CHANNELS: { key: Channel; label: string; icon: string }[] = [
  { key: "wechat", label: "微信好友", icon: "💬" },
  { key: "wechat_moments", label: "朋友圈", icon: "⭕" },
  { key: "copy_link", label: "复制链接", icon: "🔗" },
];

export default function ShareButton({ targetType, targetId, title, excerpt, url }: Props) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  async function trackShare(channel: Channel) {
    try {
      await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, channel }),
      });
    } catch {
      // ignore
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      await trackShare("copy_link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      await trackShare("copy_link");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWechatShare(channel: Channel) {
    trackShare(channel);
    // WeChat share requires JS-SDK configuration
    // For now, show a helpful message
    alert(
      "微信分享需要在微信内置浏览器中打开。\n\n请点击右上角「···」→「分享到朋友圈」或「发送给朋友」。\n\n分享文案：\n" +
        `${title}\n${excerpt || ""}\n${shareUrl}`
    );
  }

  const shareText = `${title}\n${excerpt || ""}\n${shareUrl}`;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setShowMenu((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <span aria-hidden="true">📤</span>
        <span>分享</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full right-0 z-50 mb-2 w-48 rounded-xl border border-border bg-bg shadow-lg">
            {CHANNELS.map((ch) => (
              <button
                key={ch.key}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (ch.key === "copy_link") copyLink();
                  else handleWechatShare(ch.key);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text transition-colors hover:bg-bg-alt first:rounded-t-xl last:rounded-b-xl"
              >
                <span>{ch.icon}</span>
                <span>{copied && ch.key === "copy_link" ? "已复制 ✓" : ch.label}</span>
              </button>
            ))}
            <div className="border-t border-border px-4 py-2">
              <p className="text-[10px] text-muted break-all">{shareText}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
