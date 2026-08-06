import Link from "next/link";
import { redirect } from "next/navigation";
import ContributionForm from "./ContributionForm";
import { createClient } from "@/lib/supabase/server";
import type { ContentSubmission, SubmissionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "投稿中心" };

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  submitted: { label: "等待审核", className: "bg-secondary-light text-secondary" },
  reviewing: { label: "编辑处理中", className: "bg-tertiary-light text-tertiary" },
  accepted: { label: "已采纳", className: "bg-primary-light text-primary" },
  rejected: { label: "需要修改", className: "bg-red-50 text-red-700" },
};

export default async function ContributePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/contribute");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/contribute");

  let submissions: ContentSubmission[] = [];
  let loadError: string | null = null;
  try {
    const { data, error } = await supabase
      .from("content_submissions")
      .select("id, user_id, title, excerpt, category, tags, body, status, reviewer_note, submitted_at, updated_at")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(20);
    if (error) {
      console.error("Failed to load submissions:", error);
      loadError = error.message;
    } else {
      submissions = (data ?? []) as ContentSubmission[];
    }
  } catch (e) {
    console.error("Submissions fetch exception:", e);
    loadError = e instanceof Error ? e.message : "未知错误";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Contribute</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-semibold text-text md:text-4xl">把你的经验留给下一届</h1>
        <p className="mt-4 text-pretty text-sm leading-7 text-text-secondary md:text-base">
          欢迎校园生活、学习方法、工具资源和项目复盘。编辑会核对隐私、时效与可操作性，再决定是否收录到站内栏目。
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="submission-form-title">
          <h2 id="submission-form-title" className="font-serif text-2xl font-semibold text-text">新投稿</h2>
          <p className="mt-2 text-sm text-muted">写清背景、过程和结果，比“应该怎么做”更有帮助。</p>
          <div className="mt-6 rounded-md border border-border bg-surface p-5 shadow-sm sm:p-7">
            <ContributionForm />
          </div>
        </section>

        <aside aria-labelledby="submission-history-title">
          <h2 id="submission-history-title" className="font-serif text-xl font-semibold text-text">我的稿件</h2>
          <p className="mt-2 text-sm leading-6 text-muted">审核意见和稿件状态会保留在这里。</p>

          {loadError ? (
            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              <p className="font-medium">暂时无法读取你的稿件历史</p>
              <p className="mt-1 text-[12px] text-amber-700">
                可能是数据库未初始化或网络问题。投稿功能仍可用，提交后会出现在此处。
              </p>
              {loadError && (
                <p className="mt-1 font-mono text-[11px] text-amber-700/70">
                  错误：{loadError}
                </p>
              )}
              <Link
                href="/board"
                className="mt-2 inline-block text-[12px] text-amber-900 underline-offset-2 hover:underline"
              >
                遇到问题？到留言区告诉 coolin →
              </Link>
            </div>
          ) : submissions.length > 0 ? (
            <ol className="mt-5 space-y-3">
              {submissions.map((submission) => {
                const status = STATUS_META[submission.status];
                return (
                  <li key={submission.id} className="rounded-md border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>
                      <time dateTime={submission.submitted_at} className="text-xs text-muted">
                        {DATE_FORMATTER.format(new Date(submission.submitted_at))}
                      </time>
                    </div>
                    <h3 className="mt-3 break-words text-sm font-semibold text-text">{submission.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{submission.excerpt}</p>
                    {submission.reviewer_note && (
                      <p className="mt-3 border-l-2 border-tertiary pl-3 text-xs leading-5 text-text-secondary">
                        编辑意见：{submission.reviewer_note}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-5 border-y border-dashed border-border py-8 text-center text-sm text-muted">
              还没有投稿记录。
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
