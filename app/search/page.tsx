import { Suspense } from "react";
import Link from "next/link";
import SearchClient from "./SearchClient";

export const metadata = { title: "搜索" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolved = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">搜索</h1>
      <p className="mt-2 text-sm text-muted">
        搜学长来信、工具链接、板块内容。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <SearchClient initialQ={resolved.q ?? ""} />
      </Suspense>
    </div>
  );
}
