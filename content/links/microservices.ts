import type { LinkGroup } from "@/lib/types";

// 校内入口的真实 URL 各校区会变。这里给的是「最常用的官方根」，
// 实际能不能跳进对应模块以你登录后看到的为准。如果链接不对，请到留言区反馈。
//
// icon 字段：优先使用安徽理工大学官网 favicon 作为校内服务图标，
// 外网数据库（知网、万方、Web of Science）保持原 favicon。
const AUST_ICON = "/images/aust-logo.png";

export const groups: LinkGroup[] = [
  {
    id: "official-portal",
    title: "学校官方入口",
    items: [
      {
        title: "安徽理工大学官网",
        url: "https://www.aust.edu.cn/",
        description: "学校主页",
        tag: "官方",
        icon: AUST_ICON,
      },
      {
        title: "教务处",
        url: "https://jwc.aust.edu.cn/",
        description: "教学通知 / 校历 / 教学日历",
        tag: "官方",
        icon: AUST_ICON,
      },
      {
        title: "图书馆",
        url: "https://lib.aust.edu.cn/",
        description: "查书 / 自习室预约 / 数据库入口",
        tag: "官方",
        icon: AUST_ICON,
      },
      {
        title: "学工处",
        url: "https://xgc.aust.edu.cn/",
        description: "奖助学金 / 学生事务",
        tag: "官方",
        icon: AUST_ICON,
      },
    ],
  },
  {
    id: "service-systems",
    title: "业务系统",
    items: [
      {
        title: "教务系统（强智 / Curriculum）",
        url: "https://jw.aust.edu.cn/",
        description: "选课 / 课表 / 成绩单",
        tag: "需校园网",
        icon: AUST_ICON,
      },
      {
        title: "智慧校园 / 一站式服务",
        url: "https://i.aust.edu.cn/",
        description: "登录后能看到大部分校内办事入口",
        tag: "需校园网",
        icon: AUST_ICON,
      },
      {
        title: "校园 VPN（远程访问）",
        url: "https://vpn.aust.edu.cn/",
        description: "在校外想访问校内系统先连 VPN",
        tag: "校外用",
        icon: AUST_ICON,
      },
      {
        title: "校园网账号自服务",
        url: "https://drcom.aust.edu.cn/",
        description: "查流量 / 改密码 / 缴费",
        icon: AUST_ICON,
      },
    ],
  },
  {
    id: "library-resources",
    title: "图书馆资源（需校内网或 VPN）",
    items: [
      {
        title: "中国知网（CNKI）",
        url: "https://www.cnki.net/",
        description: "中文论文检索；通过图书馆代理才能下载全文",
        tag: "需校园网",
      },
      {
        title: "万方数据",
        url: "https://www.wanfangdata.com.cn/",
        description: "中文学位论文 / 期刊",
        tag: "需校园网",
      },
      {
        title: "Web of Science",
        url: "https://www.webofscience.com/",
        description: "英文学术核心库",
        tag: "需校园网",
      },
    ],
  },
  {
    id: "campus-life",
    title: "校园生活",
    items: [
      {
        title: "宿舍报修 / 后勤",
        url: "https://hqzx.aust.edu.cn/",
        description: "灯坏、马桶堵、空调坏报这里",
        icon: AUST_ICON,
      },
    ],
  },
];
