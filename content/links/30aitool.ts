import type { LinkGroup } from "@/lib/types";

export const groups: LinkGroup[] = [
  // ===== 工具类（源自 30aitool.com/tools）=====
  {
    id: "30-tools-media",
    title: "媒体处理",
    items: [
      { title: "视频转音频", url: "https://www.freeconvert.com/zh/convert/video-to-mp3", description: "MP4 视频一键转 MP3 格式，免费在线处理", tag: "免费", tags: ["媒体","在线"] },
      { title: "视频压缩", url: "https://tools.rotato.app/compress", description: "视频压缩减小体积，画质损失极小", tag: "免费", tags: ["媒体","在线"] },
      { title: "视频格式转换", url: "https://vidbee.org/zh/tools/convert-mp4-to-mp3", description: "MP4/AVI/MOV 等视频格式互相转换", tag: "免费", tags: ["媒体","在线"] },
      { title: "口播自动剪辑", url: "https://autocut.video/", description: "自动识别口播停顿，一键智能粗剪视频", tag: "免费", tags: ["剪辑","在线"] },
      { title: "视频字幕生成", url: "https://www.videocaptioner.cn/guide/getting-started", description: "批量生成字幕，支持多语言视频翻译", tag: "开源", tags: ["字幕","本地"] },
      { title: "直播录制", url: "https://pro.fideo.site/cn#download", description: "支持多平台直播自动录制，傻瓜操作", tag: "开源", tags: ["直播","本地"] },
      { title: "GIF 动图录制", url: "https://dongci.kawo.com/", description: "屏幕录制一键转 GIF，体积小清晰", tag: "免费", tags: ["GIF","在线"] },
      { title: "电脑录屏", url: "https://obsproject.com/", description: "开源最强录屏软件，功能全面易上手", tag: "开源", tags: ["录屏","本地"] },
      { title: "视频提取文案", url: "https://tingwu.aliyun.com/home", description: "音视频转文字，AI 自动总结大纲", tag: "免费", tags: ["文案","AI"] },
      { title: "网站视频下载", url: "https://aixdownloader.com/zh", description: "浏览器插件识别并下载网页视频音频", tag: "免费", tags: ["下载","浏览器"] },
      { title: "音频编辑", url: "https://cdkm.com/cn/cut-audio", description: "在线音频剪辑、拼接、合成一站式处理", tag: "免费", tags: ["音频","在线"] },
      { title: "在线伴奏提取", url: "https://vocalremover.org/next/zh/", description: "提取歌曲纯伴奏或人声，免费在线", tag: "免费", tags: ["音频","在线"] },
      { title: "在线扫描文档", url: "https://lookscanned.io/scan", description: "手机拍照模拟扫描件效果，免费在线", tag: "免费", tags: ["扫描","在线"] },
    ],
  },
  {
    id: "30-tools-image",
    title: "图片处理",
    items: [
      { title: "去照片水印", url: "https://www.apeaksoft.com/watermark-remover/editor/", description: "AI 智能去除图片水印和多余元素", tag: "AI", tags: ["图片","在线"] },
      { title: "抠图免费网站", url: "https://zh.bgsub.com/webapp/", description: "自动去除图片背景，通用性强免费", tag: "免费", tags: ["抠图","在线"] },
      { title: "图片拼图", url: "https://picweave.toolooz.com/editor", description: "图片拼接排版，电影台词海报一键出", tag: "免费", tags: ["拼图","在线"] },
      { title: "图片编辑（在线 PS）", url: "https://www.doubao.com/chat/create-image", description: "在线修图加水印，豆包 AI 智能做图", tag: "免费", tags: ["修图","AI"] },
      { title: "图片风格化", url: "https://magiconch.com/vaporwave/?from=home", description: "蒸汽波像素风赛博风等风格滤镜在线", tag: "免费", tags: ["滤镜","在线"] },
      { title: "图片格式转换", url: "https://moonvy.com/apps/PxEvapo/", description: "JPG/PNG/WebP 等图片格式互相转换", tag: "免费", tags: ["格式","在线"] },
      { title: "图片压缩", url: "https://tinypng.com/", description: "批量压缩 PNG/JPG，体积大幅减小", tag: "免费", tags: ["压缩","在线"] },
      { title: "证件照制作", url: "https://tool.browser.qq.com/id_photo.html", description: "各尺寸证件照一键生成，考公签证", tag: "免费", tags: ["证件照","在线"] },
      { title: "图片转 Excel", url: "https://web.baimiaoapp.com/image-to-excel", description: "图片文字提取，PDF 转 Excel 表格", tag: "免费", tags: ["OCR","在线"] },
      { title: "图片转 Excel（通用）", url: "https://convertio.co/zh/", description: "PDF/图片等文档格式万能转换", tag: "免费", tags: ["转换","在线"] },
      { title: "模拟手写样式", url: "https://www.autohanding.com/", description: "把打字文字转成逼真手写效果，在线免费", tag: "免费", tags: ["手写","在线"] },
      { title: "模糊修复", url: "https://bigjpg.com/", description: "放大分辨率修复模糊图片，AI 增强", tag: "免费", tags: ["修复","在线"] },
    ],
  },
  {
    id: "30-tools-doc",
    title: "文档 / 写作 / 图表",
    items: [
      { title: "Markdown 卡片", url: "https://md2card.com/zh", description: "Markdown 转图文卡片，知识分享", tag: "免费", tags: ["Markdown","在线"] },
      { title: "Markdown 编辑工具", url: "https://markdown.lovejade.cn/", description: "在线 Markdown 编辑器，实时预览", tag: "免费", tags: ["Markdown","在线"] },
      { title: "在线文档编辑", url: "https://www.kdocs.cn/welcome", description: "金山文档，在线 Office 替代品", tag: "免费", tags: ["文档","在线"] },
      { title: "图表制作", url: "https://chartcube.alipay.com/", description: "支持 Excel 导入，快速出图", tag: "免费", tags: ["图表","在线"] },
      { title: "文件格式转换", url: "https://www.pdfpai.com/", description: "PDF Word Excel 等文档格式互相转换", tag: "免费", tags: ["转换","在线"] },
      { title: "文字海报", url: "https://lab.magiconch.com/eva-title/", description: "EVA 等多风格文字卡片在线生成", tag: "免费", tags: ["海报","在线"] },
      { title: "思维导图", url: "https://wanglin2.github.io/mind-map-docs/", description: "开源免费思维导图，网页端本地端均支持", tag: "开源", tags: ["思维导图","在线"] },
      { title: "白板产品", url: "https://app.diagrams.net/?src=about", description: "无限画布白板开源工具，支持多人协作", tag: "开源", tags: ["白板","在线"] },
    ],
  },
  {
    id: "30-tools-other",
    title: "其他工具",
    items: [
      { title: "文件传输", url: "https://www.airportal.cn/", description: "AirPortal 不限速传文件到任意设备", tag: "免费", tags: ["传输","在线"] },
      { title: "视频下载插件 AIX", url: "https://aixdownloader.com/zh", description: "浏览器插件嗅探下载网页视频音频", tag: "免费", tags: ["下载","浏览器"] },
    ],
  },
  // ===== 软件区（源自 30aitool.com/ruanjianqu）=====
  {
    id: "30-soft-dev",
    title: "开发工具",
    items: [
      { title: "Quick Look", url: "https://github.com/QL-Win/QuickLook", description: "按空格键预览任意文件，macOS 风格", tag: "开源", tags: ["效率","本地"] },
      { title: "Quicker", url: "https://getquicker.net/", description: "快捷面板效率神器，自定义动作秒启动", tag: "免费", tags: ["效率","本地"] },
      { title: "手机投屏工具 QtScrcpy", url: "https://github.com/barry-ran/QtScrcpy", description: "安卓投屏到电脑，开源免费低延迟", tag: "开源", tags: ["投屏","本地"] },
      { title: "远程桌面 UU 远程", url: "https://uuyc.163.com/", description: "网易出品免费远程控制，流畅低延迟", tag: "免费", tags: ["远程","本地"] },
      { title: "快捷搜索 Listary", url: "https://www.listary.com/", description: "全局文件搜索工具，秒找任意文件", tag: "免费", tags: ["搜索","本地"] },
      { title: "快捷搜索 Everything", url: "https://www.voidtools.com/", description: "极速文件名搜索，本地文件秒出结果", tag: "免费", tags: ["搜索","本地"] },
      { title: "截图软件 PixPin", url: "https://pixpin.cn/", description: "长截图+GIF录制+悬浮截图三合一", tag: "免费", tags: ["截图","本地"] },
      { title: "截图软件 Snipaste", url: "https://docs.snipaste.com/", description: "贴图+截图工具，办公效率翻倍", tag: "免费", tags: ["截图","本地"] },
    ],
  },
  {
    id: "30-soft-system",
    title: "系统维护",
    items: [
      { title: "卸载工具 HiBit Uninstaller", url: "https://www.hibitsoft.ir/", description: "彻底卸载软件并清理注册表残留项", tag: "免费", tags: ["卸载","本地"] },
      { title: "卸载工具 IObit Uninstaller", url: "https://www.iobit.com/", description: "批量卸载软件，强制删除顽固残留", tag: "免费", tags: ["卸载","本地"] },
      { title: "C盘清理 火绒安全", url: "https://www.huorong.cn/", description: "弹窗拦截+启动项管理+垃圾清理三合一", tag: "免费", tags: ["清理","本地"] },
      { title: "格式转换 File Converter", url: "https://file-converter.io/", description: "右键菜单一键格式转换，支持 1000+ 格式", tag: "免费", tags: ["转换","本地"] },
      { title: "视频压缩小丸工具箱", url: "https://wwmi.lanzouo.com/b00ocpxsmb", description: "本地视频压缩工具，画质损失极小", tag: "免费", tags: ["压缩","本地"] },
      { title: "播放器 PotPlayer", url: "https://potplayer.tv/", description: "全能本地播放器，支持所有音视频格式", tag: "免费", tags: ["播放器","本地"] },
      { title: "电脑播放器 mpv", url: "https://mpv.io/", description: "开源极简播放器，快捷键丰富可定制", tag: "开源", tags: ["播放器","本地"] },
      { title: "下载工具 NDM", url: "https://www.neatdownloadmanager.com/", description: "免费多线程下载器，替代 IDM 首选", tag: "免费", tags: ["下载","本地"] },
      { title: "压缩软件 Bandizip", url: "https://www.bandisoft.com/", description: "界面清爽压缩解压工具，支持全格式", tag: "免费", tags: ["压缩","本地"] },
      { title: "压缩软件 7-Zip", url: "https://www.7-zip.org/", description: "开源免费压缩解压软件，经典必备工具", tag: "开源", tags: ["压缩","本地"] },
    ],
  },
  {
    id: "30-soft-game",
    title: "游戏相关",
    items: [
      { title: "Steam++（ Watt Toolkit）", url: "https://steampp.net/", description: "Steam 加速+游戏工具箱，开源免费", tag: "开源", tags: ["游戏","加速"] },
      { title: "图吧工具箱", url: "https://www.tbtool.cn/", description: "硬件检测烤机驱动管理，装机必备", tag: "免费", tags: ["硬件","检测"] },
      { title: "游戏进程冻结器", url: "https://github.com/superDMS/HsFreezer-Hidden-in-the-snow-", description: "游戏多开不卡，后台冻结非活跃进程", tag: "开源", tags: ["游戏","效率"] },
    ],
  },
  // ===== 资源（源自 30aitool.com/ziyuan）=====
  {
    id: "30-res-img",
    title: "图片 / 设计素材",
    items: [
      { title: "免版权图库 Pixabay", url: "https://pixabay.com/", description: "免费高清图片素材库，可商用无版权", tag: "免费", tags: ["图片","商用"] },
      { title: "免扣图 PNG", url: "https://miankoutupian.com/", description: "透明背景 PNG 素材，免费下载使用", tag: "免费", tags: ["PNG","设计"] },
      { title: "免费字体", url: "https://www.miao3.cn/", description: "可商用中文字体免费下载，商用无忧", tag: "免费", tags: ["字体","设计"] },
      { title: "图标素材", url: "https://yesicon.app/", description: "开源 SVG 图标库，可商用无限下载", tag: "开源", tags: ["图标","设计"] },
      { title: "Emoji 素材", url: "https://www.emojiall.com/", description: "全平台 Emoji 下载，自定义混合表情", tag: "免费", tags: ["Emoji","素材"] },
      { title: "插画素材 undraw", url: "https://undraw.co/", description: "开源插画素材，PPT 海报自媒体必备", tag: "开源", tags: ["插画","设计"] },
      { title: "样机生成 Shots.so", url: "https://shots.so/", description: "设备样机在线合成，免费生成展示图", tag: "免费", tags: ["样机","设计"] },
      { title: "背景图生成", url: "https://bg-painter.com/", description: "免费生成 PPT 背景图，自定义配色", tag: "免费", tags: ["背景","设计"] },
      { title: "壁纸站 Wallhaven", url: "https://wallhaven.cc/", description: "高清电脑手机壁纸站，分类齐全", tag: "免费", tags: ["壁纸","图片"] },
      { title: "老照片档案馆", url: "https://www.laozhaopian5.com/", description: "历史老照片在线浏览，回味过去", tag: "免费", tags: ["历史","图片"] },
    ],
  },
  {
    id: "30-res-media",
    title: "音视频素材",
    items: [
      { title: "音效素材 BBC Sound Effects", url: "https://sound-effects.bbcrewind.co.uk/", description: "BBC 免费音效库，可商用无版权", tag: "免费", tags: ["音效","素材"] },
      { title: "白噪音", url: "https://asoftmurmur.com/", description: "专注助眠白噪音，网页打开即用", tag: "免费", tags: ["白噪音","专注"] },
      { title: "播客 小宇宙", url: "https://ask.xiaoyuzhoufm.com/", description: "中文播客平台，摸鱼学习两不误好去处", tag: "免费", tags: ["播客","音频"] },
      { title: "视频素材 HeyCan", url: "https://www.heycan.com/", description: "混剪绿幕素材，可商用无版权限制", tag: "免费", tags: ["视频","素材"] },
    ],
  },
  {
    id: "30-res-learn",
    title: "学习 / 办公素材",
    items: [
      { title: "简历模板 Canva", url: "https://www.canva.cn/", description: "在线编辑简历模板，中文友好免费", tag: "免费", tags: ["简历","模板"] },
      { title: "PPT 模板", url: "https://justfreeslide.com/", description: "免费高级 PPT 模板，免登录直接下载", tag: "免费", tags: ["PPT","模板"] },
      { title: "电子书豆瓣", url: "https://book.douban.com/", description: "豆瓣读书找书评，发现阅读推荐好书", tag: "免费", tags: ["读书","社区"] },
      { title: "在线小游戏", url: "https://guozhivip.com/", description: "点开即玩小游戏，摸鱼放松必备神器", tag: "免费", tags: ["游戏","摸鱼"] },
    ],
  },
  // ===== AI 专区（源自 30aitool.com/aiqu）=====
  {
    id: "30-ai-tools",
    title: "AI 工具集",
    items: [
      { title: "AI 提示词合集", url: "https://www.aishort.top/", description: "精选 AI 提示词合集，复制即用", tag: "免费", tags: ["提示词","AI"] },
      { title: "AI 提示词排行榜", url: "https://promptup.net/scoreboard", description: "社区评分热门提示词，每日持续更新", tag: "免费", tags: ["提示词","AI"] },
      { title: "AI 语音输入", url: "https://metaso.cn/echo", description: "语音转文字输入法，识别准确率极高", tag: "免费", tags: ["语音","AI"] },
      { title: "DeepSeek+飞书工作流", url: "https://boardmix.cn/", description: "用飞书文档搭建 DeepSeek 工作流", tag: "推荐", tags: ["DeepSeek","效率"] },
      { title: "DeepSeek 知识库", url: "https://xxbum1999yx.feishu.cn/", description: "实用主义 DeepSeek 资源整合大全", tag: "推荐", tags: ["DeepSeek","资源"] },
    ],
  },
  // ===== 知识（源自 30aitool.com/zhishi）=====
  {
    id: "30-know-info",
    title: "优质信息源",
    items: [
      { title: "AI 每日信息源", url: "https://www.bestblogs.dev/", description: "精选 AI 优质内容每日更新，必看", tag: "免费", tags: ["AI","资讯"] },
      { title: "阮一峰的网络日志", url: "https://www.ruanyifeng.com/", description: "科技周刊每周五更新，互联网必读", tag: "免费", tags: ["博客","科技"] },
      { title: "优质博客推荐", url: "https://www.owenyoung.com/", description: "高质量独立博客合集，优质内容推荐", tag: "免费", tags: ["博客","阅读"] },
      { title: "英文文章中文预览", url: "https://www.reddit.com/", description: "Reddit 优质内容中文摘要，开阔视野", tag: "免费", tags: ["英文","社区"] },
      { title: "学习英语网站合集", url: "https://www.englearner.site/", description: "看剧学打字学背单词，英语学习合集", tag: "免费", tags: ["英语","学习"] },
      { title: "Markdown 语法", url: "https://markdown.com.cn/", description: "Markdown 语法参考手册，入门必备", tag: "免费", tags: ["Markdown","文档"] },
      { title: "订阅优质信息流", url: "https://follow.is/", description: "RSS 订阅管理工具，整合优质信息源", tag: "免费", tags: ["RSS","信息"] },
    ],
  },
  {
    id: "30-know-life",
    title: "生活实用指南",
    items: [
      { title: "实用指南手册", url: "https://cook.yunyoujun.cn/", description: "租房医保做饭等实用生活指南手册", tag: "免费", tags: ["生活","指南"] },
      { title: "创业失败案例库", url: "https://www.failory.com/", description: "全球创业失败案例分析，避坑必读", tag: "免费", tags: ["创业","案例"] },
      { title: "IT 桔子", url: "https://www.itjuzi.com/", description: "创投数据公司信息查询，了解行业", tag: "免费", tags: ["创投","数据"] },
      { title: "审美提升站", url: "https://www.nbfox.com/", description: "艺术设计平面审美素材站，提升审美", tag: "免费", tags: ["审美","设计"] },
    ],
  },
  // ===== 电脑课（源自 30aitool.com/ilovemycomputer）=====
  {
    id: "30-pc-lesson",
    title: "电脑课 · 系统维护",
    items: [
      { title: "【第一课】卸载软件科普", url: "https://www.hibitsoft.ir/", description: "流氓软件清理+正确卸载方法科普", tag: "教程", tags: ["卸载","系统"] },
      { title: "【第二课】浏览器插件&小技巧", url: "https://microsoftedge.microsoft.com/addons/", description: "Edge 插件推荐，浏览器效率翻倍", tag: "教程", tags: ["浏览器","效率"] },
      { title: "【第三课】软件下载教程", url: "https://www.neatdownloadmanager.com/", description: "安全下载软件方法+学生必装清单", tag: "教程", tags: ["下载","软件"] },
      { title: "【第四课】快捷软件&快捷键", url: "https://help.listary.com/", description: "效率软件推荐，快捷键思路提升效率", tag: "教程", tags: ["效率","快捷键"] },
      { title: "【第五课】如何找到高质量软件", url: "https://www.v2ex.com/", description: "V2EX 社区发现好软件，求推荐", tag: "教程", tags: ["发现","社区"] },
      { title: "【第六课】电脑知识基础补充", url: "", description: "电脑基础知识补充，优质科普案例", tag: "教程", tags: ["基础","科普"] },
      { title: "【第七课】AI 优质信息源", url: "https://waytoagi.feishu.cn/wiki/K1CYwt0VmiOMVmk4v3bc3lUWn4e", description: "小白如何学习 AI，优质信息源推荐", tag: "教程", tags: ["AI","学习"] },
    ],
  },
  {
    id: "30-pc-tips",
    title: "电脑实用技巧",
    items: [
      { title: "C盘清理指南", url: "https://www.huorong.cn/", description: "火绒安全+C盘瘦身完整清理指南", tag: "教程", tags: ["C盘","清理"] },
      { title: "C盘软件迁移", url: "https://github.com/", description: "把 C 盘软件迁移到其他盘教程", tag: "教程", tags: ["C盘","迁移"] },
      { title: "文件批量重命名", url: "", description: "文件批量重命名工具，省时省力高效", tag: "教程", tags: ["效率","文件"] },
      { title: "禁用应用联网", url: "https://github.com/", description: "管控应用联网行为，防后台偷跑流量", tag: "教程", tags: ["网络","管控"] },
      { title: "暂停 Windows 更新", url: "", description: "暂停 Windows 自动更新，避免打扰", tag: "教程", tags: ["系统","Windows"] },
      { title: "电脑问题修复", url: "https://www.huorong.cn/", description: "网络问题系统故障修复思路汇总大全", tag: "教程", tags: ["修复","系统"] },
    ],
  },
];
