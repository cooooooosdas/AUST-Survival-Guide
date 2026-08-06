/**
 * 资源中心 — 常用网址数据
 * 首期只做这一类，后续会接入 Supabase `resources` 表做文件下载
 */

export type UsefulWebsite = {
  title: string;
  url: string;
  description: string;
  tag?: "推荐" | "国内" | "学习" | "社区" | "工具";
};

export const USEFUL_WEBSITES: UsefulWebsite[] = [
  {
    title: "GitHub",
    url: "https://github.com/",
    description: "全球最大代码托管平台；找开源项目、写个人作品、读源码",
    tag: "推荐",
  },
  {
    title: "Gitee（码云）",
    url: "https://gitee.com/",
    description: "国内代码托管，国内访问快，部分学校还有专属学生仓库",
    tag: "国内",
  },
  {
    title: "CSDN",
    url: "https://blog.csdn.net/",
    description: "国内老牌技术博客，问题搜索 / 课程笔记 / 求职面经多",
    tag: "推荐",
  },
  {
    title: "博客园",
    url: "https://www.cnblogs.com/",
    description: "老牌中文技术社区，氛围偏技术向，原创文章质量高",
    tag: "社区",
  },
  {
    title: "稀土掘金",
    url: "https://juejin.cn/",
    description: "字节系技术社区，前端 / 移动端内容多，UI 现代",
    tag: "社区",
  },
  {
    title: "SegmentFault 思否",
    url: "https://segmentfault.com/",
    description: "问答 + 专栏形式的技术社区，提问响应较快",
    tag: "社区",
  },
  {
    title: "牛客网",
    url: "https://www.nowcoder.com/",
    description: "校招笔试 / 面试题库，应届生找工作必备",
    tag: "学习",
  },
  {
    title: "中国大学 MOOC",
    url: "https://www.icourse163.org/",
    description: "国内大学精品公开课，覆盖计算机、数学、英语通识课",
    tag: "学习",
  },
  {
    title: "W3School",
    url: "https://www.w3school.com.cn/",
    description: "前端 / HTML / CSS / JS 入门速查，例子多",
    tag: "工具",
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/zh-CN/",
    description: "Web 平台权威文档，前端工程师必查",
    tag: "工具",
  },
];