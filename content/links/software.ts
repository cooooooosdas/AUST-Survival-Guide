import type { LinkGroup } from "@/lib/types";

export const groups: LinkGroup[] = [
  {
    id: "ide",
    title: "编辑器 / IDE",
    items: [
      {
        title: "VS Code",
        url: "https://code.visualstudio.com/",
        description: "通用编辑器；学计算机的几乎都会装一个",
        tag: "推荐",
      },
      {
        title: "JetBrains 学生授权",
        url: "https://www.jetbrains.com/community/education/#students",
        description: "用学校邮箱免费拿 IDEA / PyCharm / CLion 全家桶",
        tag: "免费",
      },
      {
        title: "Cursor",
        url: "https://www.cursor.com/",
        description: "VS Code 套了一层 AI 的代码编辑器，写代码主力",
        tag: "推荐",
      },
      {
        title: "Trae（字节出品）",
        url: "https://www.trae.com.cn/",
        description: "国内可直连的 AI IDE，国内学生友好",
      },
    ],
  },
  {
    id: "runtime",
    title: "开发环境（运行时 / 工具链）",
    items: [
      {
        title: "Git",
        url: "https://git-scm.com/downloads",
        description: "版本控制，第一天就要会用",
        tag: "必装",
      },
      {
        title: "Node.js（LTS）",
        url: "https://nodejs.org/zh-cn",
        description: "前端 / 全栈基础",
      },
      {
        title: "Python",
        url: "https://www.python.org/downloads/",
        description: "原版安装包；搞数据 / AI 必备",
      },
      {
        title: "Anaconda / Miniconda",
        url: "https://www.anaconda.com/download",
        description: "Python 环境管理，做机器学习用",
      },
      {
        title: "JDK（Adoptium / Temurin）",
        url: "https://adoptium.net/",
        description: "免费的 Java 运行时，比 Oracle 干净",
      },
      {
        title: "Docker Desktop",
        url: "https://www.docker.com/products/docker-desktop/",
        description: "做后端 / 部署绕不开",
      },
    ],
  },
  {
    id: "terminal",
    title: "终端 / Shell",
    items: [
      {
        title: "Windows Terminal",
        url: "https://aka.ms/terminal",
        description: "Win10/11 必装，多 Tab + 美观",
        tag: "推荐",
      },
      {
        title: "WSL（Windows 子系统 Linux）",
        url: "https://learn.microsoft.com/zh-cn/windows/wsl/install",
        description: "Win 上跑真 Linux，命令行训练用",
        tag: "推荐",
      },
      {
        title: "MobaXterm",
        url: "https://mobaxterm.mobatek.net/",
        description: "SSH / SFTP 全能客户端",
      },
    ],
  },
  {
    id: "study-write",
    title: "学习 / 笔记 / 写作",
    items: [
      {
        title: "Notion",
        url: "https://www.notion.so/",
        description: "笔记 + 任务 + 知识库一体",
      },
      {
        title: "飞书",
        url: "https://www.feishu.cn/",
        description: "国内速度快，文档 / 多维表格强",
        tag: "推荐",
      },
      {
        title: "Obsidian",
        url: "https://obsidian.md/",
        description: "本地 Markdown 双链笔记，离线党首选",
      },
      {
        title: "Typora",
        url: "https://typora.io/",
        description: "Markdown 编辑器，写报告 / 博客顺手",
      },
      {
        title: "Zotero",
        url: "https://www.zotero.org/",
        description: "文献管理，写论文用得上",
      },
    ],
  },
  {
    id: "design",
    title: "设计 / 图像",
    items: [
      {
        title: "Figma",
        url: "https://www.figma.com/",
        description: "在线 UI 设计，做前端项目原型用",
        tag: "推荐",
      },
      {
        title: "即时设计",
        url: "https://js.design/",
        description: "国内 Figma 平替，速度快",
      },
      {
        title: "draw.io / diagrams.net",
        url: "https://app.diagrams.net/",
        description: "免费流程图，画 ER / 类图",
      },
      {
        title: "Excalidraw",
        url: "https://excalidraw.com/",
        description: "手绘风草图工具，写报告做插图很合适",
      },
    ],
  },
  {
    id: "db",
    title: "数据库",
    items: [
      {
        title: "DBeaver Community",
        url: "https://dbeaver.io/download/",
        description: "全数据库通用客户端，免费",
        tag: "推荐",
      },
      {
        title: "Navicat Premium Lite",
        url: "https://www.navicat.com.cn/products/navicat-premium-lite",
        description: "Navicat 官方免费版本",
        tag: "免费",
      },
      {
        title: "MongoDB Compass",
        url: "https://www.mongodb.com/products/tools/compass",
        description: "MongoDB 官方 GUI",
      },
    ],
  },
  {
    id: "student-pack",
    title: "学生免费 / 优惠",
    items: [
      {
        title: "GitHub Education / Student Pack",
        url: "https://education.github.com/pack",
        description: "用学校邮箱申请，几十款软件免费一年",
        tag: "推荐",
      },
      {
        title: "Microsoft Office for Education",
        url: "https://www.microsoft.com/zh-cn/education/products/office",
        description: "学校邮箱可领 Office 365",
      },
    ],
  },
];
