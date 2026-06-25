import { Suspense } from "react";
import ChangelogClient from "./ChangelogClient";

export const metadata = { title: "站点动态" };

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">站点动态</h1>
      <p className="mt-2 text-sm text-muted">
        记录平台的更新和维护动态。
      </p>
      <Suspense fallback={<div className="mt-6 text-sm text-muted">加载中…</div>}>
        <ChangelogClient />
      </Suspense>
    </div>
  );
}
