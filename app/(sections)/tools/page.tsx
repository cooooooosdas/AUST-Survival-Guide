import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/tools";

export const metadata = { title: "工具箱" };

export default function ToolsPage() {
  return (
    <LinkBoard
      title="工具箱"
      intro="学习生活里反复要用的网址，按用途分组。我自己一直在用的才放进来。"
      groups={groups}
    />
  );
}
