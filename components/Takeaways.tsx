"use client";

import type { ReactNode } from "react";

export type TakeawaysProps = {
  title?: string;
  children: ReactNode;
};

export default function Takeaways({ title = "要点", children }: TakeawaysProps) {
  return (
    <div
      className={[
        "my-8 rounded-xl border border-border bg-surface backdrop-blur-md",
        "backdrop-saturate-150 px-5 py-4 shadow-sm",
      ].join(" ")}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-hover">
        {title}
      </p>
      <ul className="mt-0 list-disc space-y-2 pl-5 marker:text-accent">
        {children}
      </ul>
    </div>
  );
}
