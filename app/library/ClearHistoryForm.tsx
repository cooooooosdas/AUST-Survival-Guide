"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { clearReadingHistory } from "./actions";
import type { ClearHistoryState } from "./actions";

const INITIAL_STATE: ClearHistoryState = { status: "idle", message: "" };

function ClearButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="motion-press text-sm text-muted transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "清除中…" : "清除记录"}
    </button>
  );
}

export default function ClearHistoryForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(clearReadingHistory, INITIAL_STATE);

  useEffect(() => {
    if (state.status !== "success") return;
    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index);
      if (key?.startsWith("aust_viewed_")) sessionStorage.removeItem(key);
    }
    router.refresh();
  }, [router, state.status]);

  return (
    <div className="flex flex-col items-end gap-1">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm("确定清除全部阅读历史吗？已保存的稍后读内容不会受影响。")) {
            event.preventDefault();
          }
        }}
      >
        <ClearButton />
      </form>
      {state.message && (
        <span
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-xs text-red-600" : "text-xs text-secondary"}
        >
          {state.message}
        </span>
      )}
    </div>
  );
}
