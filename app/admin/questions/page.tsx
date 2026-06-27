import { Suspense } from "react";
import AdminQuestionsClient from "./AdminQuestionsClient";

export const metadata = { title: "匿名提问管理" };

export default async function AdminQuestionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">匿名提问管理</h1>
      <p className="mt-1 text-sm text-muted">
        回复匿名提问，有价值的可以公开到 FAQ。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <AdminQuestionsClient />
      </Suspense>
    </div>
  );
}
