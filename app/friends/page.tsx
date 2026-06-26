import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "友链交换",
  description: "与同校学长博客、技术学习站点交换友情链接",
};

type FriendLink = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  avatar_url: string | null;
  submitted_at: string;
};

async function getFriendLinks(): Promise<FriendLink[]> {
  const base = siteUrl();
  try {
    const res = await fetch(`${base}/api/friend-links`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function getFaviconUrl(url: string): string {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return "";
  }
}

export default function FriendsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Friends</p>
        <h1 className="mt-3 text-3xl font-semibold text-primary">友链交换</h1>
        <p className="mt-3 text-muted leading-relaxed">
          欢迎与本站交换友情链接。要求：内容健康、与大学生/技术学习相关、网站可正常访问。
        </p>
      </div>

      {/* 友链列表 */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-text mb-4">已收录的友链</h2>
        <Suspense fallback={<p className="text-sm text-muted">加载中…</p>}>
          <FriendLinksList />
        </Suspense>
      </section>

      {/* 申请表单 */}
      <section className="rounded-xl border border-border bg-surface p-6 md:p-8">
        <h2 className="text-lg font-medium text-text mb-2">申请友链</h2>
        <p className="text-sm text-muted mb-5">
          填写信息后提交，站长审核通过后会展示在这里。请先在本站添加好友链再提交。
        </p>
        <SubmitForm />
      </section>
    </div>
  );
}

async function FriendLinksList() {
  const links = await getFriendLinks();

  if (links.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        暂无友链，期待你的加入。
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 rounded-xl border border-border bg-bg-alt p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
        >
          <img
            src={getFaviconUrl(link.url)}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text group-hover:text-primary transition-colors truncate">
              {link.name}
            </p>
            {link.description && (
              <p className="mt-1 text-xs text-muted line-clamp-2">{link.description}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

function SubmitForm() {
  return (
    <form action="/api/friend-links" method="POST" className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
          网站名称 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          placeholder="你的网站名称"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-text mb-1">
          网站链接 <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          id="url"
          name="url"
          required
          maxLength={500}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
          网站描述
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={300}
          rows={2}
          placeholder="简单介绍一下你的网站"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
      >
        提交申请
      </button>
    </form>
  );
}
