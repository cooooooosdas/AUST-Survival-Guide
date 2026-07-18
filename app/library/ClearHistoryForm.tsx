"use client";

import { useFormStatus } from "react-dom";
import { clearReadingHistory } from "./actions";

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
  return (
    <form
      action={clearReadingHistory}
      onSubmit={(event) => {
        if (!window.confirm("确定清除全部阅读历史吗？已保存的稍后读内容不会受影响。")) {
          event.preventDefault();
        }
      }}
    >
      <ClearButton />
    </form>
  );
}
