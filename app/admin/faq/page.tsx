import { Suspense } from "react";
import AdminFaqClient from "./AdminFaqClient";

export const metadata = { title: "FAQ 管理" };

export default async function AdminFaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">FAQ 管理</h1>
      <p className="mt-1 text-sm text-muted">
        添加、编辑、删除 FAQ 条目。新增条目会自动出现在 /faq 页面。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <AdminFaqClient />
      </Suspense>
    </div>
  );
}
