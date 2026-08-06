import type { ComponentType } from "react";

export type LetterMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  tags?: string[];
  readingTime?: number;
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
    slug: "aust-complete-guide",
    title: "安徽理工大学完全指南",
    excerpt:
      "从学校排名到专业选择，从分数线到转专业政策——高考填志愿必看的一份指南。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["高考志愿", "择校", "专业选择", "新生指南"],
    readingTime: 15,
    load: () => import("@/content/letters/aust-complete-guide.mdx"),
  },
  {
    slug: "freshman-handbook",
    title: "大一新生手册：开学报到与入学清单",
    excerpt:
      "报到流程、证件材料准备、行李策略——入学第一天要做的所有事。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "报到", "入学清单"],
    readingTime: 10,
    load: () => import("@/content/letters/freshman-handbook.mdx"),
  },
  {
    slug: "dormitory-guide",
    title: "宿舍攻略：选房抢宿与日常设施",
    excerpt:
      "四人间上床下桌，空调阳台。线上选房怎么抢？宿舍设施怎么用？这份攻略帮你搞定。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "宿舍", "选房", "设施"],
    readingTime: 8,
    load: () => import("@/content/letters/dormitory-guide.mdx"),
  },
  {
    slug: "military-training",
    title: "军训指南：训练节奏与装备避坑",
    excerpt:
      "两周军训怎么过？鞋垫、请假条、训练技巧——老生踩过的坑帮你避开。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "军训", "攻略"],
    readingTime: 7,
    load: () => import("@/content/letters/military-training.mdx"),
  },
  {
    slug: "food-map",
    title: "安理工美食地图：四大食堂与觅食攻略",
    excerpt:
      "仁苑、爱苑、义苑、平苑四大食堂怎么选？哪些窗口排队最长？这份美食攻略帮你省时间。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "食堂", "美食"],
    readingTime: 8,
    load: () => import("@/content/letters/food-map.mdx"),
  },
  {
    slug: "clubs-social",
    title: "社团与社交：百团大战与大一融入",
    excerpt:
      "百团大战怎么逛？校级和院级组织怎么选？怎么快速认识新朋友？这份指南帮你融入大学。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "社团", "社交", "学生会"],
    readingTime: 7,
    load: () => import("@/content/letters/clubs-social.mdx"),
  },
  {
    slug: "healthcare",
    title: "体测与就医：评分标准与医保报销",
    excerpt:
      "体测怎么拿高分？校医院能看什么？医保怎么报销？一篇帮你搞定。",
    date: "2026-08-06",
    author: "coolin",
    tags: ["新生", "体测", "就医", "医保"],
    readingTime: 6,
    load: () => import("@/content/letters/healthcare.mdx"),
  },
  {
    slug: "first-week",
    title: "开学第一周，先把这几件事处理好",
    excerpt:
      "从查到学号、缴完学费、抢到宿舍，到报到当天领卡、买生活用品、看懂第一张课表——按时间顺序帮你梳理完整流程。",
    date: "2026-06-23",
    author: "coolin",
    tags: ["新生", "实用"],
    readingTime: 10,
    load: () => import("@/content/letters/first-week.mdx"),
  },
  {
    slug: "college-truths",
    title: "大学四年，这些事你越早知道越好",
    excerpt:
      "从 200 多人群聊里整理出来的学业真相：综测怎么算、保研考研就业三条路怎么选、哪些证书有用哪些是坑。",
    date: "2026-06-18",
    author: "coolin",
    tags: ["学业", "保研", "考研", "就业", "竞赛"],
    readingTime: 9,
    load: () => import("@/content/letters/college-truths.mdx"),
  },
  {
    slug: "campus-survival",
    title: "贴吧学长说的那些事：安理入学生存指南",
    excerpt:
      "从安徽理工大学贴吧 2025 新生群的聊天记录里整理出来的入学生存指南：宿舍怎么选、军训怎么熬、转专业有什么坑、食堂哪家好吃——以及那些贴吧学长说过但你不敢全信的话。",
    date: "2026-06-12",
    author: "coolin",
    tags: ["新生", "生活", "宿舍", "军训", "转专业", "社团", "体测", "图书馆"],
    readingTime: 8,
    load: () => import("@/content/letters/campus-survival.mdx"),
  },
  {
    slug: "ai-as-tutor",
    title: "把 AI 当家教用：写给不会用 ChatGPT 的同学",
    excerpt: "如何让 AI 帮你预习、答疑、改报告——以及它绝对不能替你做的事。",
    date: "2026-06-07",
    author: "coolin",
    tags: ["AI", "学习方法"],
    readingTime: 6,
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
