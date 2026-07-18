import { notFound, redirect } from "next/navigation";
import ReviewButton from "./ReviewButton";
import { reviewSubmission } from "./actions";
import { createClient } from "@/lib/supabase/server";
import type { ContentSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "投稿审核" };

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN");

export default async function AdminSubmissionsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/admin/submissions");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/submissions");

  const { data: admin } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) notFound();

  const { data } = await supabase
    .from("content_submissions")
    .select("id, user_id, title, excerpt, category, tags, body, status, reviewer_note, submitted_at, updated_at")
    .order("submitted_at", { ascending: false })
    .limit(100);
  const submissions = (data ?? []) as ContentSubmission[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Editorial desk</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">投稿审核</h1>
        <p className="mt-3 text-sm text-muted">共 {submissions.length} 篇稿件，按提交时间倒序。</p>
      </header>

      {submissions.length > 0 ? (
        <div className="mt-8 space-y-6">
          {submissions.map((submission) => {
            const action = reviewSubmission.bind(null, submission.id);
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

                <form action={action} className="mt-5 grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-end">
                  <div>
                    <label htmlFor={`status-${submission.id}`} className="block text-xs font-medium text-text">状态</label>
                    <select
                      id={`status-${submission.id}`}
                      name="status"
                      defaultValue={submission.status}
                      className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="submitted">等待审核</option>
                      <option value="reviewing">编辑处理中</option>
                      <option value="accepted">采纳</option>
                      <option value="rejected">退回修改</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`note-${submission.id}`} className="block text-xs font-medium text-text">编辑意见</label>
                    <textarea
                      id={`note-${submission.id}`}
                      name="reviewer_note"
                      defaultValue={submission.reviewer_note ?? ""}
                      maxLength={1000}
                      rows={2}
                      placeholder="说明采纳原因或需要修改的具体位置…"
                      className="mt-2 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <ReviewButton />
                </form>
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
