import type { LetterMeta } from "@/lib/letters";
import { LETTERS } from "@/lib/letters";
import type { LinkGroup, LinkItem } from "@/lib/types";
import { MAIN_SECTIONS } from "@/lib/sections";
import { groups as toolsGroups } from "@/content/links/tools";
import { groups as microservicesGroups } from "@/content/links/microservices";
import { groups as learnGroups } from "@/content/links/learn";
import { groups as softwareGroups } from "@/content/links/software";
import { groups as aiGroups } from "@/content/links/ai";
import { groups as thirtyGroups } from "@/content/links/30aitool";

export type SearchItem = {
  id: string;
  type: "letter" | "link" | "section";
  title: string;
  text: string;
  tags: string[];
  href: string;
  section?: string;
  groupTitle?: string;
};

const allGroups: { section: string; groups: LinkGroup[] }[] = [
  { section: "tools", groups: toolsGroups },
  { section: "microservices", groups: microservicesGroups },
  { section: "learn", groups: learnGroups },
  { section: "software", groups: softwareGroups },
  { section: "ai", groups: aiGroups },
  { section: "ai", groups: thirtyGroups.filter((g) => g.id.startsWith("30-tools") || g.id.startsWith("30-ai")) },
  { section: "learn", groups: thirtyGroups.filter((g) => g.id.startsWith("30-res") || g.id.startsWith("30-know") || g.id.startsWith("30-pc")) },
  { section: "software", groups: thirtyGroups.filter((g) => g.id.startsWith("30-soft")) },
];

const letterIndex: SearchItem[] = LETTERS.map((l) => ({
  id: `letter-${l.slug}`,
  type: "letter",
  title: l.title,
  text: l.excerpt,
  tags: l.tags ?? [],
  href: `/letters/${l.slug}`,
  section: "letters",
}));

const linkIndex: SearchItem[] = [];
for (const { section, groups } of allGroups) {
  for (const group of groups) {
    for (const item of group.items) {
      linkIndex.push({
        id: `link-${section}-${group.id}-${item.title}`,
        type: "link",
        title: item.title,
        text: item.description ?? "",
        tags: item.tags ?? (item.tag ? [item.tag] : []),
        href: item.url || "#",
        section,
        groupTitle: group.title,
      });
    }
  }
}

const sectionIndex: SearchItem[] = MAIN_SECTIONS.map((s) => ({
  id: `section-${s.slug}`,
  type: "section",
  title: s.title,
  text: s.description,
  tags: [s.group === "main" ? "资源" : "其他"],
  href: s.href,
  section: s.slug,
}));

const FULL_INDEX = [...letterIndex, ...linkIndex, ...sectionIndex];

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-–—]+/g, " ").trim();
}

export function search(query: string): SearchItem[] {
  if (!query.trim()) return [];

  const q = normalize(query);
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = FULL_INDEX.map((item) => {
    const titleN = normalize(item.title);
    const textN = normalize(item.text);
    const tagsN = item.tags.map(normalize).join(" ");

    let score = 0;
    for (const term of terms) {
      if (titleN === term) score += 20;
      else if (titleN.includes(term)) score += 10;
      if (tagsN.includes(term)) score += 5;
      if (textN.includes(term)) score += 3;
      if (titleN.startsWith(term)) score += 3;
      if (textN.startsWith(term)) score += 1;
    }
    const matchedTerms = terms.filter((t) =>
      titleN.includes(t) || tagsN.includes(t) || textN.includes(t)
    );
    score += matchedTerms.length * 2;
    return { ...item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}

export const TYPE_LABEL: Record<SearchItem["type"], string> = {
  letter: "学长来信",
  link: "链接",
  section: "板块",
};

export const TYPE_CLASS: Record<SearchItem["type"], string> = {
  letter: "bg-accent-light text-[#3A8B72]",
  link: "bg-primary-light text-primary",
  section: "bg-secondary-light text-[#8B4560]",
};
