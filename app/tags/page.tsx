import Link from "next/link";
import { Suspense } from "react";
import TagsClient from "./TagsClient";

export const metadata = { title: "标签云" };

export default function TagsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">标签云</h1>
      <p className="mt-2 text-sm text-muted">
        按标签浏览全站内容。点击标签查看相关文章和链接。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <TagsClient />
      </Suspense>
    </div>
  );
}
