"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import Avatar from "@/components/Avatar";

type Props = {
  user: {
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
};

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <Link
          href="/login"
          className="motion-press whitespace-nowrap text-muted transition-colors hover:text-primary"
        >
          登录
        </Link>
        <Link
          href="/signup"
          className="motion-press whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-hover"
        >
          注册
        </Link>
      </div>
    );
  }

  const name = user.displayName || user.email?.split("@")[0] || "同学";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="motion-press flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-muted transition-colors hover:bg-bg-alt hover:text-primary"
      >
        <Avatar src={user.avatarUrl} name={user.displayName ?? undefined} email={user.email ?? undefined} size={28} />
        <span className="hidden sm:inline">{name}</span>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="menu-pop absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-bg shadow-lg">
          <div className="py-1">
            <Link href="/library" className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
              阅读中心
            </Link>
            <Link href="/profile" className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              个人设置
            </Link>
            <Link href="/contribute" className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>
              投稿中心
            </Link>
            <Link href="/changelog" className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              站点动态
            </Link>
            <div className="my-1 border-t border-border" />
            <form action={signOut}>
              <button type="submit" className="motion-press flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                退出登录
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
