import Link from "next/link";
import { Suspense } from "react";
import FaqClient from "./FaqClient";

export const metadata = { title: "常见问题 FAQ" };

const CATEGORIES = [
  { value: "", label: "全部" },
  { value: "high-math", label: "高数问题" },
  { value: "course-select", label: "选课疑问" },
  { value: "software", label: "软件安装" },
  { value: "ai-tools", label: "AI 工具使用" },
  { value: "general", label: "综合" },
];

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolved = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">常见问题</h1>
          <p className="mt-1 text-sm text-muted">
            从留言区和匿名提问中整理的高频问题解答。找不到答案？去{" "}
            <Link href="/board" className="text-primary underline-offset-4 hover:underline">
              留言区
            </Link>{" "}
            提问。
          </p>
        </div>
        <Link
          href="/questions"
          className="rounded-md border border-border bg-bg-alt px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
        >
          匿名提问 →
        </Link>
      </div>

      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <FaqClient initialQ={resolved.q ?? ""} initialCategory={resolved.category ?? ""} categories={CATEGORIES} />
      </Suspense>
    </div>
  );
}
