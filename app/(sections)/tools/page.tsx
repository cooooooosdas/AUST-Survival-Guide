import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/tools";
import { groups as thirtyTools } from "@/content/links/30aitool";

export const metadata = { title: "工具箱" };

export default function ToolsPage() {
  const thirtyGroups = thirtyTools.filter((g) => g.id.startsWith("30-tools"));
  return (
    <LinkBoard
      title="工具箱"
      intro="学习生活里反复要用的网址，按用途分组。我自己一直在用的才放进来。"
      groups={[...groups, ...thirtyGroups]}
    />
  );
}
