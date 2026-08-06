import type { ComponentType } from "react";

export type LetterMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  tags?: string[];
  readingTime?: number;
  images?: string[]; // 左右两侧展示的相关图片 URL
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
    images: [
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/29d9732ee7eeba7204675c9e39cdd1253df72f25.jpg",
      "https://i1.hdslb.com/bfs/archive/8fe60db77ea37ced2a4f1ac542a33d994c624f69.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
      "https://i0.hdslb.com/bfs/archive/0a627e834a301be2c5a84c2dee886fd451f42198.jpg",
      "https://i1.hdslb.com/bfs/archive/2d65d00f0fef7b931cabf07327cfc59d902ad3b2.jpg",
      "https://i1.hdslb.com/bfs/archive/0d6fd32fd63e95eed716fc7f9f8937c5fa55ae31.jpg",
    ],
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
    images: [
      "https://i2.hdslb.com/bfs/archive/e2c6b39f432f29cd522e256a5be1ed7fe942f28c.jpg",
      "https://i1.hdslb.com/bfs/archive/c584713b40b7cab01fbf451e693941711aace8ab.jpg",
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/29d9732ee7eeba7204675c9e39cdd1253df72f25.jpg",
      "https://i1.hdslb.com/bfs/archive/8fe60db77ea37ced2a4f1ac542a33d994c624f69.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
    ],
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
    images: [
      "https://i0.hdslb.com/bfs/archive/55677f41c9c4d4adc117a6c9c9ab4f2342d6c960.jpg",
      "https://i2.hdslb.com/bfs/archive/e2c6b39f432f29cd522e256a5be1ed7fe942f28c.jpg",
      "https://i2.hdslb.com/bfs/archive/1c73ac703a4e50fa67a57428acb65cf64d954914.jpg",
      "https://i2.hdslb.com/bfs/archive/85fb795d283449e0324bf4f1c24129b9d1e8455f.jpg",
      "https://i2.hdslb.com/bfs/archive/520e7e0fe849ff29a3ad949c276a0d55f59fd286.jpg",
      "https://i1.hdslb.com/bfs/archive/2c21b222e88036d70dbd4d84449d28a4907417fe.jpg",
      "https://i0.hdslb.com/bfs/archive/9907095d2f0e4cb966fc213a22496612eae16dc0.jpg",
      "https://i2.hdslb.com/bfs/archive/a889e45d2b1c9824abf7b46e24be6a19dfcbca95.jpg",
    ],
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
    images: [
      "https://i2.hdslb.com/bfs/archive/53284ddec8de767d5ed94a7a80a10a7b2801b301.jpg",
      "https://i0.hdslb.com/bfs/archive/e71267db967742ce766aebee38bc3eaa809d5919.jpg",
      "https://i1.hdslb.com/bfs/archive/c3c5d0e917e04e66cf2854da49f66a80400f2fed.jpg",
      "https://i2.hdslb.com/bfs/archive/9a3036982b34c6bf180ff315a25e6f7645c3921d.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
      "https://i1.hdslb.com/bfs/archive/7ca92d5dbad71aa96b4df80b4553afbf74536c7e.jpg",
      "https://i1.hdslb.com/bfs/archive/db6b1d6f94d6d0fd8dd002e62604b177f5135e11.jpg",
      "https://i2.hdslb.com/bfs/archive/5b019db70802a57ed1a9005c78f36232b247e791.jpg",
    ],
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
    images: [
      "https://i1.hdslb.com/bfs/archive/9e94c95dc5e3f6dab1f698e441d371c0909e1aab.jpg",
      "https://i1.hdslb.com/bfs/archive/0bf3bc28849ba1317a195a94bc287bcc7d229235.jpg",
      "https://i0.hdslb.com/bfs/archive/ad90dc221e0d28a67d52daa7b861448948cb89d7.jpg",
      "https://i2.hdslb.com/bfs/archive/56c0fd0f261fbf56e3e2fd4ee128b3804d930fec.jpg",
      "https://i0.hdslb.com/bfs/archive/1dbb26c1fa17eabb4970c4537cd57d2a91545392.jpg",
      "https://i0.hdslb.com/bfs/archive/b282b83c8caa00dae91ab39cc057af63aff9f8c9.jpg",
      "https://i2.hdslb.com/bfs/archive/3d1394c3edb1e570b882c06c923b84b12adfc75f.jpg",
      "https://i2.hdslb.com/bfs/archive/8a48949fd46c67d7a7712d133167b00e2f811dc6.jpg",
    ],
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
    images: [
      "https://i1.hdslb.com/bfs/archive/014a6df15c9ee372584663713cd833d940f6c8cd.jpg",
      "https://i2.hdslb.com/bfs/archive/cc8a1176ce2c797f2c2732059280af45f929851a.jpg",
      "https://i1.hdslb.com/bfs/archive/87407019c218dd7830fc549e019e1d9113f160b9.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i0.hdslb.com/bfs/archive/e204ab45d81d8e50c4a7a80aeba66fbe9ff72bc1.jpg",
      "https://i0.hdslb.com/bfs/archive/09c446aa274ae25a8f2e11e451ee01d110eca244.jpg",
      "https://i0.hdslb.com/bfs/archive/b6cf8ed0afbba9f270a6f94d8efa1f2c6868346d.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
    ],
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
    images: [
      "https://i2.hdslb.com/bfs/archive/e2c6b39f432f29cd522e256a5be1ed7fe942f28c.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
      "https://i0.hdslb.com/bfs/archive/0a627e834a301be2c5a84c2dee886fd451f42198.jpg",
      "https://i1.hdslb.com/bfs/archive/2d65d00f0fef7b931cabf07327cfc59d902ad3b2.jpg",
      "https://i1.hdslb.com/bfs/archive/0d6fd32fd63e95eed716fc7f9f8937c5fa55ae31.jpg",
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
    ],
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
    images: [
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
      "https://i2.hdslb.com/bfs/archive/e2c6b39f432f29cd522e256a5be1ed7fe942f28c.jpg",
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/29d9732ee7eeba7204675c9e39cdd1253df72f25.jpg",
      "https://i1.hdslb.com/bfs/archive/8fe60db77ea37ced2a4f1ac542a33d994c624f69.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
    ],
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
    images: [
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i0.hdslb.com/bfs/archive/0a627e834a301be2c5a84c2dee886fd451f42198.jpg",
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
      "https://i1.hdslb.com/bfs/archive/2d65d00f0fef7b931cabf07327cfc59d902ad3b2.jpg",
      "https://i1.hdslb.com/bfs/archive/0d6fd32fd63e95eed716fc7f9f8937c5fa55ae31.jpg",
    ],
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
    images: [
      "https://i2.hdslb.com/bfs/archive/e2c6b39f432f29cd522e256a5be1ed7fe942f28c.jpg",
      "https://i1.hdslb.com/bfs/archive/c584713b40b7cab01fbf451e693941711aace8ab.jpg",
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/29d9732ee7eeba7204675c9e39cdd1253df72f25.jpg",
      "https://i1.hdslb.com/bfs/archive/8fe60db77ea37ced2a4f1ac542a33d994c624f69.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
    ],
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
    images: [
      "https://i2.hdslb.com/bfs/archive/8a3f1be405cba3bea4159dcbf24e3f31c953700e.jpg",
      "https://i1.hdslb.com/bfs/archive/02da2a7f073189baf866021badd8ae97649ca256.jpg",
      "https://i0.hdslb.com/bfs/archive/b3176c0962b0278374b69112407444042222e9d3.jpg",
      "https://i1.hdslb.com/bfs/archive/510f01320906876545cec453f6c204011f9d3d4e.jpg",
      "https://i0.hdslb.com/bfs/archive/0a627e834a301be2c5a84c2dee886fd451f42198.jpg",
      "https://i1.hdslb.com/bfs/archive/2d65d00f0fef7b931cabf07327cfc59d902ad3b2.jpg",
      "https://i1.hdslb.com/bfs/archive/0d6fd32fd63e95eed716fc7f9f8937c5fa55ae31.jpg",
      "https://i0.hdslb.com/bfs/archive/27502af26166c569cb1246ed8b40d885873cfe57.jpg",
    ],
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
