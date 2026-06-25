import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/software";
import { groups as thirtySoftware } from "@/content/links/30aitool";

export const metadata = { title: "软件资源" };

export default function SoftwarePage() {
  const thirtyGroups = thirtySoftware.filter((g) => g.id.startsWith("30-soft"));
  return (
    <LinkBoard
      title="软件资源"
      intro="计算机学生常用软件下载与简介。优先正版、学生免费、跨平台。"
      groups={[...groups, ...thirtyGroups]}
      sectionSlug="software"
    />
  );
}
