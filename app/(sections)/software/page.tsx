import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/software";

export const metadata = { title: "软件资源" };

export default function SoftwarePage() {
  return (
    <LinkBoard
      title="软件资源"
      intro="计算机学生常用软件下载与简介。优先正版、学生免费、跨平台。"
      groups={groups}
    />
  );
}
