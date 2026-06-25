export type LinkItem = {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  tag?: string;
  tags?: string[];
};

export type LinkGroup = {
  id: string;
  title: string;
  items: LinkItem[];
  icon?: string;
};

// 链接类型：校内内网 / AI 工具 / 外网
export type LinkKind = "intranet" | "ai" | "external";

export function inferLinkKind(
  url: string,
  tag: string | undefined,
  sectionSlug?: string
): LinkKind {
  if (sectionSlug === "ai" || tag === "AI") return "ai";

  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "external";
  }

  const isAustDomain = host.endsWith("aust.edu.cn");
  const isVpn = host.startsWith("vpn.");
  // VPN 是给校外用户访问校内系统用的，仍属"校内资源"
  if (isAustDomain || isVpn) return "intranet";
  if (tag === "需校园网" || tag === "校内") return "intranet";

  return "external";
}

export const LINK_KIND_META: Record<
  LinkKind,
  { label: string; short: string; className: string }
> = {
  intranet: {
    label: "校内内网",
    short: "内",
    className: "bg-[#FFE4E4] text-[#9B2C2C]",
  },
  ai: {
    label: "AI 工具",
    short: "AI",
    className: "bg-primary-light text-primary",
  },
  external: {
    label: "外网",
    short: "外",
    className: "bg-[#E0F2FE] text-[#075985]",
  },
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type CommentTargetType = "global" | "section" | "letter";

export type CommentStatus = "pending" | "approved" | "rejected";

export type Comment = {
  id: number;
  user_id: string;
  target_type: CommentTargetType;
  target_id: string;
  content: string;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
  parent_id: number | null;
  status: CommentStatus;
  tags: string[];
  pinned: boolean;
  pinned_at: string | null;
};

export type QuestionCategory = "general" | "high-math" | "course-select" | "software" | "ai-tools";
export type QuestionStatus = "pending" | "answered" | "public" | "rejected";

export type Question = {
  id: number;
  content: string;
  category: QuestionCategory;
  status: QuestionStatus;
  reply: string | null;
  replied_at: string | null;
  is_public: boolean;
  created_at: string;
};

export type FaqCategory = QuestionCategory;

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: FaqCategory;
  source_type: "manual" | "comment" | "question";
  source_id: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export const COMMENT_TAGS = ["高数问题", "选课疑问", "软件安装", "AI工具使用"] as const;
export type CommentTag = typeof COMMENT_TAGS[number];
