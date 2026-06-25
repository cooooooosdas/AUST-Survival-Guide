import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/learn";
import { groups as thirtyAll } from "@/content/links/30aitool";

export const metadata = { title: "学习资源" };

export default function LearnPage() {
  const extra = thirtyAll.filter(
    (g) => g.id.startsWith("30-res") || g.id.startsWith("30-know") || g.id.startsWith("30-pc")
  );
  return (
    <LinkBoard
      title="学习资源"
      intro="B 站精选课程 + 教学文档 + 30aitool 精选资源。优先收录我自己看完觉得值得推荐的。"
      groups={[...groups, ...extra]}
      sectionSlug="learn"
    />
  );
}
