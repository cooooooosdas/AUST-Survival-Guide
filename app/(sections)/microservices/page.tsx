import LinkBoard from "@/components/LinkBoard";
import { groups } from "@/content/links/microservices";

export const metadata = { title: "学校微服务" };

export default function MicroservicesPage() {
  return (
    <LinkBoard
      title="学校微服务"
      intro="教务、图书馆、一卡通等校内官方入口。各校区域名偶尔变动，发现链接挂了到留言区告诉我。"
      groups={groups}
    />
  );
}
