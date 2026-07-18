"use client";

import { useActionState } from "react";
import { submitContent, type SubmissionActionState } from "./actions";

const INITIAL_STATE: SubmissionActionState = {
  status: "idle",
  message: "",
  submissionId: null,
};

export default function ContributionForm() {
  const [state, formAction, pending] = useActionState(submitContent, INITIAL_STATE);

  return (
    <form
      key={state.submissionId ?? "new-submission"}
      action={formAction}
      className="space-y-6"
    >
      <div>
        <label htmlFor="submission-title" className="block text-sm font-medium text-text">标题</label>
        <input
          id="submission-title"
          name="title"
          type="text"
          minLength={4}
          maxLength={100}
          required
          autoComplete="off"
          placeholder="例如：第一次选课前，我希望有人告诉我的 6 件事…"
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="submission-excerpt" className="block text-sm font-medium text-text">摘要</label>
        <textarea
          id="submission-excerpt"
          name="excerpt"
          minLength={20}
          maxLength={240}
          rows={3}
          required
          placeholder="用两三句话说明这篇内容能帮同学解决什么问题…"
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="submission-category" className="block text-sm font-medium text-text">栏目</label>
          <select
            id="submission-category"
            name="category"
            defaultValue="experience"
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="campus">校园生活</option>
            <option value="study">学习方法</option>
            <option value="tools">工具与资源</option>
            <option value="experience">经验分享</option>
            <option value="project">项目展示</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div>
          <label htmlFor="submission-tags" className="block text-sm font-medium text-text">标签</label>
          <input
            id="submission-tags"
            name="tags"
            type="text"
            maxLength={100}
            autoComplete="off"
            placeholder="新生，选课，学习方法…"
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-muted">逗号分隔，最多保留 5 个。</p>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="submission-body" className="block text-sm font-medium text-text">正文</label>
          <span className="text-xs text-muted">支持 Markdown · 200–20000 字</span>
        </div>
        <textarea
          id="submission-body"
          name="body"
          minLength={200}
          maxLength={20000}
          rows={18}
          required
          spellCheck="true"
          placeholder="从真实经历开始写。小标题、列表和链接都可以使用 Markdown…"
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm leading-7 text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-bg-alt px-4 py-3 text-sm leading-6 text-text-secondary">
        <input
          type="checkbox"
          name="originality"
          value="confirmed"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <span>我确认内容为原创或已获得发布授权，并同意编辑为排版、事实核验和隐私保护进行必要修改。</span>
      </label>

      <div aria-live="polite" className="min-h-6">
        {state.message && (
          <p className={state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"}>
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="motion-press inline-flex min-w-28 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "提交中…" : "提交审核"}
      </button>
    </form>
  );
}
