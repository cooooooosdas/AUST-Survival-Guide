import { redirect } from "next/navigation";
import SubmissionReviewForm from "./SubmissionReviewForm";
import { createClient } from "@/lib/supabase/server";
import { requireAdminPage } from "@/lib/admin-guard";
import type { ContentSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "投稿审核" };

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN");

export default async function AdminSubmissionsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/admin/submissions");
  }
  await requireAdminPage();

  const supabase = await createClient();
  const { data } = await supabase
    .from("content_submissions")
    .select("id, user_id, title, excerpt, category, tags, body, status, reviewer_note, submitted_at, updated_at")
    .order("submitted_at", { ascending: false })
    .limit(100);
  const submissions = (data ?? []) as ContentSubmission[];

  return (
    <div>
      <header className="border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Editorial desk</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">投稿审核</h1>
        <p className="mt-3 text-sm text-muted">共 {submissions.length} 篇稿件，按提交时间倒序。</p>
      </header>

      {submissions.length > 0 ? (
        <div className="mt-8 space-y-6">
          {submissions.map((submission) => {
            return (
              <article key={submission.id} className="rounded-md border border-border bg-surface p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>#{submission.id}</span>
                  <span>{submission.category}</span>
                  <span>{submission.status}</span>
                  <time dateTime={submission.submitted_at}>{DATE_FORMATTER.format(new Date(submission.submitted_at))}</time>
                </div>
                <h2 className="mt-3 text-pretty font-serif text-2xl font-semibold text-text">{submission.title}</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{submission.excerpt}</p>
                {submission.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {submission.tags.map((tag) => <span key={tag} className="rounded border border-border px-2 py-0.5 text-xs text-muted">{tag}</span>)}
                  </div>
                )}
                <details className="mt-5 border-y border-border py-4">
                  <summary className="cursor-pointer text-sm font-medium text-primary">查看正文</summary>
                  <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-text-secondary">{submission.body}</div>
                </details>

                <SubmissionReviewForm
                  submissionId={submission.id}
                  status={submission.status}
                  reviewerNote={submission.reviewer_note}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 border-y border-dashed border-border py-12 text-center text-sm text-muted">暂无待审核稿件。</div>
      )}
    </div>
  );
}
