import type { LinkGroup } from "@/lib/types";

export const groups: LinkGroup[] = [
  {
    id: "video-cs-basic",
    title: "B 站 · 计算机基础",
    items: [
      {
        title: "鸿蒙系统的 C 语言（黑马程序员）",
        url: "https://www.bilibili.com/video/BV1Sf4y1x7TT/",
        description: "C 语言入门，节奏稳，适合大一第一学期",
        tag: "推荐",
      },
      {
        title: "C 语言程序设计 · 翁恺",
        url: "https://www.bilibili.com/video/BV1KW411P7Et/",
        description: "浙大翁恺老师，公认的国内 C 入门精品",
        tag: "推荐",
      },
      {
        title: "数据结构与算法 · 青岛大学王卓",
        url: "https://www.bilibili.com/video/BV1nJ411V7bd/",
        description: "中文数据结构课首选，配套清晰",
      },
      {
        title: "操作系统（哈工大 李治军）",
        url: "https://www.bilibili.com/video/BV1d4411v7u7/",
        description: "和教科书贴得很紧，期末速通可用",
      },
      {
        title: "计算机网络微课堂（湖科大 教书匠）",
        url: "https://www.bilibili.com/video/BV1c4411d7jb/",
        description: "动画讲解，比看书直观",
        tag: "推荐",
      },
    ],
  },
  {
    id: "video-modern",
    title: "B 站 · 进阶 / 实战",
    items: [
      {
        title: "Linux 操作系统全套教程（韩顺平）",
        url: "https://www.bilibili.com/video/BV1Sv411r7vd/",
        description: "命令行不熟先看这个",
      },
      {
        title: "Java 入门（黑马程序员 · 全免费）",
        url: "https://www.bilibili.com/video/BV17F411T7Ao/",
      },
      {
        title: "Python 入门（小甲鱼）",
        url: "https://www.bilibili.com/video/BV1c4411e77t/",
        description: "网课鼻祖，幽默轻松",
      },
      {
        title: "前端开发（黑马 / pink 老师）",
        url: "https://www.bilibili.com/video/BV14J4114768/",
      },
      {
        title: "Git & GitHub（GeekHour）",
        url: "https://www.bilibili.com/video/BV1HM411377j/",
        description: "30 分钟版，新手必看",
        tag: "推荐",
      },
    ],
  },
  {
    id: "doc",
    title: "教学文档 / 自学站",
    items: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/zh-CN/",
        description: "前端 / Web 标准最权威的中文文档",
        tag: "官方",
      },
      {
        title: "菜鸟教程",
        url: "https://www.runoob.com/",
        description: "查 API / 语法的速食手册",
      },
      {
        title: "廖雪峰教程",
        url: "https://www.liaoxuefeng.com/",
        description: "Python / Java / Git，写得清楚",
      },
      {
        title: "Hello 算法（开源书）",
        url: "https://www.hello-algo.com/",
        description: "动画 + 多语言代码的算法书",
        tag: "推荐",
      },
      {
        title: "CS 自学指南",
        url: "https://csdiy.wiki/",
        description: "国外名校公开课中文导航",
        tag: "推荐",
      },
      {
        title: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/",
        description: "MIT 课程开源，CS 6.001/6.006/6.824 等",
      },
    ],
  },
  {
    id: "practice",
    title: "刷题 / 实战",
    items: [
      {
        title: "力扣 LeetCode（中国）",
        url: "https://leetcode.cn/",
        description: "找工作前刷 200 题打底",
        tag: "推荐",
      },
      {
        title: "牛客网",
        url: "https://www.nowcoder.com/",
        description: "校招笔试 / 面经；春秋招高频用",
      },
      {
        title: "freeCodeCamp 中文",
        url: "https://chinese.freecodecamp.org/learn/",
        description: "前端 / 全栈认证课程，免费",
      },
      {
        title: "Codewars",
        url: "https://www.codewars.com/",
        description: "进阶题量管够，多语言",
      },
    ],
  },
  {
    id: "english",
    title: "英语 · 不是单独一门课",
    items: [
      {
        title: "扇贝 · 阅读 / 听力",
        url: "https://www.shanbay.com/",
        description: "考研单词 / 四六级阅读",
      },
      {
        title: "可可英语",
        url: "https://www.kekenet.com/",
        description: "英文新闻 / VOA / BBC 配文本",
      },
    ],
  },
];
