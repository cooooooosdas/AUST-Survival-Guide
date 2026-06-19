import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/learn";

export const metadata = { title: "学习资源" };

export default function LearnPage() {
  return (
    <LinkBoard
      title="学习资源"
      intro="B 站精选课程 + 教学文档。优先收录我自己看完觉得值得推荐的。"
      groups={groups}
    />
  );
}
