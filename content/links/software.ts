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
        title: "Dev C++",
        url: "https://sourceforge.net/projects/orwelldevcpp/",
        description: "打竞赛的同学常用，轻量，C/C++ 入门经典",
        tag: "竞赛",
        icon: "https://sourceforge.net/favicon.ico",
      },
      {
        title: "Visual Studio",
        url: "https://visualstudio.microsoft.com/zh-hans/",
        description: "C/C++ 主力 IDE，工程化项目必备",
        tag: "C++",
        icon: "https://visualstudio.microsoft.com/favicon.ico",
      },
      {
        title: "IntelliJ IDEA",
        url: "https://www.jetbrains.com/idea/",
        description: "写 Java 的事实标准，社区版免费",
        tag: "Java",
      },
      {
        title: "PyCharm",
        url: "https://www.jetbrains.com/pycharm/",
        description: "写 Python 主力 IDE，社区版免费",
        tag: "Python",
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
    id: "system-utilities",
    title: "Windows 实用工具",
    items: [
      {
        title: "7-Zip",
        url: "https://www.7-zip.org/",
        description: "免费开源压缩工具，安装包小，格式支持全",
        tags: ["免费", "开源", "必装"],
      },
      {
        title: "Everything",
        url: "https://www.voidtools.com/zh-cn/",
        description: "秒搜 Windows 本地文件，比系统搜索省时间",
        tag: "推荐",
      },
      {
        title: "Microsoft PowerToys",
        url: "https://learn.microsoft.com/zh-cn/windows/powertoys/",
        description: "微软官方效率工具箱：窗口分区、批量重命名、取色等",
        tags: ["免费", "开源"],
      },
      {
        title: "Snipaste",
        url: "https://zh.snipaste.com/",
        description: "截图、贴图、标注一体，写报告和改图很顺手",
        tag: "推荐",
      },
      {
        title: "LocalSend",
        url: "https://localsend.org/zh-CN",
        description: "同一局域网内跨平台传文件，不用登录账号",
        tags: ["免费", "开源"],
      },
      {
        title: "QuickLook",
        url: "https://github.com/QL-Win/QuickLook",
        description: "在资源管理器按空格快速预览图片、PDF 和文档",
        tags: ["免费", "开源"],
      },
      {
        title: "Geek Uninstaller",
        url: "https://geekuninstaller.com/",
        description: "轻量卸载工具，可清理软件卸载后的残留项",
        tag: "免费",
      },
    ],
  },
  {
    id: "media",
    title: "录屏 / 音视频",
    items: [
      {
        title: "OBS Studio",
        url: "https://obsproject.com/zh-cn/download",
        description: "录屏、直播、课程演示都能用，插件生态成熟",
        tags: ["推荐", "开源", "免费"],
      },
      {
        title: "VLC media player",
        url: "https://www.videolan.org/vlc/",
        description: "跨平台播放器，常见音视频格式基本都能直接打开",
        tags: ["免费", "开源"],
      },
      {
        title: "HandBrake",
        url: "https://handbrake.fr/",
        description: "视频压缩和转码工具，提交作业前压体积很好用",
        tags: ["免费", "开源"],
      },
      {
        title: "LosslessCut",
        url: "https://github.com/mifi/lossless-cut",
        description: "不重新编码就能快速裁剪、合并视频片段",
        tags: ["免费", "开源"],
      },
      {
        title: "Audacity",
        url: "https://www.audacityteam.org/",
        description: "免费音频录制与剪辑，处理采访和配音够用",
        tags: ["免费", "开源"],
      },
      {
        title: "FFmpeg",
        url: "https://ffmpeg.org/download.html",
        description: "音视频处理底层工具，批量转码、抽帧和压缩必备",
        tag: "开源",
      },
      {
        title: "ShareX",
        url: "https://getsharex.com/",
        description: "高级截图、滚动截屏、GIF 录制和自动化工作流",
        tags: ["免费", "开源"],
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
      {
        title: "GIMP",
        url: "https://www.gimp.org/",
        description: "开源图像编辑器，适合修图、抠图和简单海报",
        tags: ["免费", "开源"],
      },
      {
        title: "Inkscape",
        url: "https://inkscape.org/",
        description: "免费矢量绘图工具，画图标和论文示意图很方便",
        tags: ["免费", "开源"],
      },
    ],
  },
  {
    id: "office-reading",
    title: "文档 / PDF / 阅读",
    items: [
      {
        title: "LibreOffice",
        url: "https://zh-cn.libreoffice.org/",
        description: "免费开源办公套件，可离线处理文档、表格和演示",
        tags: ["免费", "开源"],
      },
      {
        title: "PDFgear",
        url: "https://www.pdfgear.com/zh/",
        description: "PDF 阅读、批注、转换与基础编辑一体",
        tag: "免费",
      },
      {
        title: "Sumatra PDF",
        url: "https://www.sumatrapdfreader.org/free-pdf-reader",
        description: "启动很快的轻量阅读器，支持 PDF、EPUB、MOBI",
        tags: ["免费", "开源"],
      },
      {
        title: "calibre",
        url: "https://calibre-ebook.com/zh_CN",
        description: "电子书管理与格式转换，适合整理课外阅读资料",
        tags: ["免费", "开源"],
      },
    ],
  },
  {
    id: "remote-security",
    title: "远程协作 / 安全",
    items: [
      {
        title: "RustDesk",
        url: "https://rustdesk.com/zh/",
        description: "开源远程桌面，跨平台协助排查电脑问题",
        tag: "开源",
      },
      {
        title: "Bitwarden",
        url: "https://bitwarden.com/",
        description: "跨平台密码管理器，避免多个账号共用一个密码",
        tags: ["推荐", "开源"],
      },
      {
        title: "KeePassXC",
        url: "https://keepassxc.org/",
        description: "完全本地的密码库，适合更看重离线存储的同学",
        tags: ["免费", "开源", "本地"],
      },
      {
        title: "VirusTotal",
        url: "https://www.virustotal.com/gui/home/upload",
        description: "可疑文件或链接先做多引擎检测，不代替本机防护",
        tag: "在线",
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
  {
    id: "must-watch",
    title: "计算机必修课",
    items: [
      {
        title: "计算机教育中缺失的一课",
        url: "https://missing.csail.mit.edu/",
        description: "MIT 计算机系课程，讲授命令行、Git、Vim、调试等硬核技能",
        tag: "必看",
      },
      {
        title: "提问的智慧",
        url: "https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way",
        description: "GitHub 开源项目，教你如何正确提问，避免被踢出群聊",
        tag: "必读",
      },
    ],
  },
];
