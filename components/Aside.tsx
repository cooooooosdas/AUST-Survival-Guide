"use client";

import type { ReactNode } from "react";

type Tone = "tip" | "warn" | "info";

/* 二次元风格 callout 配色：柔和过去色 + 左侧强调线 */
const toneStyles: Record<Tone, { outer: string; label: string; dot: string }> = {
  tip: {
    outer: "border-l-[3px] border-l-primary/60 bg-primary/5 backdrop-blur-sm",
    label: "text-primary",
    dot: "bg-primary",
  },
  warn: {
    outer: "border-l-[3px] border-l-secondary/70 bg-secondary/5 backdrop-blur-sm",
    label: "text-secondary",
    dot: "bg-secondary",
  },
  info: {
    outer: "border-l-[3px] border-l-accent/60 bg-accent/5 backdrop-blur-sm",
    label: "text-accent-hover",
    dot: "bg-accent",
  },
};

const toneLabel: Record<Tone, string> = {
  tip: "提示",
  warn: "注意",
  info: "背景",
};

export type AsideProps = {
  tone?: Tone;
  title?: string;
  children: ReactNode;
};

export default function Aside({ tone = "info", title, children }: AsideProps) {
  const s = toneStyles[tone];
  return (
    <aside
      className={[
        "my-8 rounded-xl px-5 py-4 text-sm leading-relaxed text-text",
        s.outer,
      ].join(" ")}
    >
      {title && (
        <p className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${s.label}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${s.dot}`} />
          {toneLabel[tone]}: {title}
        </p>
      )}
      <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
