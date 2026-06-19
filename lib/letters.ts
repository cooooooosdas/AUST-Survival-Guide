import type { ComponentType } from "react";

export type LetterMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  tags?: string[];
};

export type LetterModule = {
  default: ComponentType;
  metadata?: Partial<LetterMeta>;
};

type LetterEntry = LetterMeta & {
  load: () => Promise<LetterModule>;
};

// 按时间倒序排列；新增信件时直接在最上方加一项 + 在 content/letters/ 下放对应 mdx
export const LETTERS: LetterEntry[] = [
  {
    slug: "first-week",
    title: "开学第一周，先把这几件事处理掉",
    excerpt:
      "校园卡、教务系统、迎新群、宿舍水电——一份给新生的第一周生存清单。",
    date: "2026-08-30",
    author: "学长 K",
    tags: ["新生", "实用"],
    load: () => import("@/content/letters/first-week.mdx"),
  },
  {
    slug: "ai-as-tutor",
    title: "把 AI 当家教用：写给不会用 ChatGPT 的同学",
    excerpt: "如何让 AI 帮你预习、答疑、改报告——以及它绝对不能替你做的事。",
    date: "2026-09-15",
    author: "学长 K",
    tags: ["AI", "学习方法"],
    load: () => import("@/content/letters/ai-as-tutor.mdx"),
  },
];

export const LETTER_MAP = Object.fromEntries(
  LETTERS.map((l) => [l.slug, l])
) as Record<string, LetterEntry>;

export function getLetter(slug: string): LetterEntry | undefined {
  return LETTER_MAP[slug];
}

export function readingTimeMinutes(text: string) {
  // 中文按字符数估算，约 400 字/分钟；英文按词数 200/min
  const cn = (text.match(/[一-龥]/g) ?? []).length;
  const en = (text.match(/[a-zA-Z]+/g) ?? []).length;
  return Math.max(1, Math.round(cn / 400 + en / 200));
}
