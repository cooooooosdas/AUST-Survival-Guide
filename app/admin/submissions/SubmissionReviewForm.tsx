"use client";

import { useActionState } from "react";
import ReviewButton from "./ReviewButton";
import {
  reviewSubmission,
  type ReviewActionState,
} from "./actions";
import type { SubmissionStatus } from "@/lib/types";

const INITIAL_STATE: ReviewActionState = { status: "idle", message: "" };

export default function SubmissionReviewForm({
  submissionId,
  status,
  reviewerNote,
}: {
  submissionId: number;
  status: SubmissionStatus;
  reviewerNote: string | null;
}) {
  const action = reviewSubmission.bind(null, submissionId);
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  return (
    <form
      action={formAction}
      className="mt-5 grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-end"
    >
      <div>
        <label htmlFor={`status-${submissionId}`} className="block text-xs font-medium text-text">
          状态
        </label>
        <select
          id={`status-${submissionId}`}
          name="status"
          defaultValue={status}
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="submitted">等待审核</option>
          <option value="reviewing">编辑处理中</option>
          <option value="accepted">采纳</option>
          <option value="rejected">退回修改</option>
        </select>
      </div>
      <div>
        <label htmlFor={`note-${submissionId}`} className="block text-xs font-medium text-text">
          编辑意见
        </label>
        <textarea
          id={`note-${submissionId}`}
          name="reviewer_note"
          defaultValue={reviewerNote ?? ""}
          maxLength={1000}
          rows={2}
          placeholder="说明采纳原因或需要修改的具体位置…"
          className="mt-2 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <ReviewButton />
      <p
        aria-live="polite"
        className={[
          "min-h-5 text-xs sm:col-span-3",
          state.status === "success" ? "text-green-700" : "text-red-600",
        ].join(" ")}
      >
        {state.message}
      </p>
    </form>
  );
}
