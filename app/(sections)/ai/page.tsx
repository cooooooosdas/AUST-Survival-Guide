import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/ai";
import { groups as thirtyAI } from "@/content/links/30aitool";

export const metadata = { title: "AI 专区" };

export default function AIPage() {
  const thirtyGroup = thirtyAI.filter((g) => g.id === "30-ai-tools");
  return (
    <LinkBoard
      title="AI 专区"
      intro="AI 工具和使用方法。分对话型、编码型、绘图型几大类，会附短文记录心得。"
      groups={[...groups, ...thirtyGroup]}
    />
  );
}
