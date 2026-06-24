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
    slug: "information-gap",
    title: "大学最大的差距不是天赋，是信息差",
    excerpt:
      "大一结束的时候回头看，高考分数差 30 分的两个人，在大学四年里可以拉开天壤之别的差距——差距不在智商，在你知不知道有这条路。",
    date: "2026-11-04",
    author: "学长 K",
    tags: ["学习方法", "信息差"],
    load: () => import("@/content/letters/information-gap.mdx"),
  },
  {
    slug: "start-building",
    title: "为什么大一就该开始动手做点东西",
    excerpt:
      "辅导员和家长只会告诉你好好听课，但那是大学里最不重要的一件事。大一就该开始写代码、做项目、参与开源——等你大四找工作，这才是简历上最有分量的东西。",
    date: "2026-10-12",
    author: "学长 K",
    tags: ["学习方法", "软工"],
    load: () => import("@/content/letters/start-building.mdx"),
  },
  {
    slug: "first-week",
    title: "开学第一周，先把这几件事处理好",
    excerpt:
      "从查到学号、缴完学费、抢到宿舍，到报到当天领卡、买生活用品、看懂第一张课表——按时间顺序帮你梳理完整流程。",
    date: "2026-08-25",
    author: "学长 K",
    tags: ["新生", "实用"],
    load: () => import("@/content/letters/first-week.mdx"),
  },
  {
    slug: "college-truths",
    title: "大学四年，这些事你越早知道越好",
    excerpt:
      "从 200 多人群聊里整理出来的学业真相：综测怎么算、保研考研就业三条路怎么选、哪些证书有用哪些是坑。",
    date: "2026-09-20",
    author: "学长 K",
    tags: ["学业", "保研", "考研", "就业", "竞赛"],
    load: () => import("@/content/letters/college-truths.mdx"),
  },
  {
    slug: "campus-survival",
    title: "贴吧学长说的那些事：安理入学生存指南",
    excerpt:
      "从安徽理工大学贴吧 2025 新生群的聊天记录里整理出来的入学生存指南：宿舍怎么选、军训怎么熬、转专业有什么坑、食堂哪家好吃——以及那些贴吧学长说过但你不敢全信的话。",
    date: "2026-09-05",
    author: "学长 K",
    tags: ["新生", "生活", "宿舍", "军训", "转专业", "社团", "体测", "图书馆"],
    load: () => import("@/content/letters/campus-survival.mdx"),
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
