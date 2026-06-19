import type { LinkGroup } from "@/lib/types";

export const groups: LinkGroup[] = [
  {
    id: "search",
    title: "搜索 / 翻译",
    items: [
      {
        title: "Google 学术",
        url: "https://scholar.google.com/",
        description: "查论文、找参考文献",
        tag: "需梯子",
      },
      {
        title: "Bing 国际版",
        url: "https://cn.bing.com/?mkt=en-US",
        description: "国内能直连，搜英文资料效果不错",
      },
      {
        title: "DeepL 翻译",
        url: "https://www.deepl.com/translator",
        description: "比谷歌翻译更顺的英文译中文",
        tag: "推荐",
      },
      {
        title: "沉浸式翻译",
        url: "https://immersivetranslate.com/",
        description: "浏览器扩展，看英文网页时双语对照",
        tag: "推荐",
      },
      {
        title: "有道词典在线",
        url: "https://www.youdao.com/",
        description: "查单词 / 短语",
      },
      {
        title: "Wikipedia 中文",
        url: "https://zh.wikipedia.org/",
        description: "速查名词概念",
        tag: "需梯子",
      },
    ],
  },
  {
    id: "doc-pdf",
    title: "文档 / PDF",
    items: [
      {
        title: "iLovePDF",
        url: "https://www.ilovepdf.com/zh-cn",
        description: "PDF 合并、压缩、转 Word，免登录",
      },
      {
        title: "Smallpdf",
        url: "https://smallpdf.com/cn",
        description: "PDF 在线工具集合",
      },
      {
        title: "在线 OCR（白描）",
        url: "https://web.baimiaoapp.com/",
        description: "图片 / 截图转可编辑文字",
        tag: "推荐",
      },
      {
        title: "讯飞听见",
        url: "https://www.iflyrec.com/",
        description: "录音转文字，开会 / 上课用",
      },
    ],
  },
  {
    id: "image-utility",
    title: "图床 / 实用",
    items: [
      {
        title: "tinypng 压缩",
        url: "https://tinypng.com/",
        description: "JPG/PNG 体积砍一半还看不出区别",
      },
      {
        title: "remove.bg 去背景",
        url: "https://www.remove.bg/zh",
        description: "证件照 / 抠图，免费够用",
      },
      {
        title: "草料二维码",
        url: "https://cli.im/",
        description: "生成二维码 / 解码",
      },
      {
        title: "在线番茄钟",
        url: "https://pomofocus.io/",
        description: "学不进去就开一个",
      },
      {
        title: "FastStone Capture（截图）",
        url: "https://www.faststone.org/",
        description: "Windows 上比微信截图强 10 倍",
      },
    ],
  },
  {
    id: "life",
    title: "生活",
    items: [
      {
        title: "12306",
        url: "https://www.12306.cn/",
        description: "回家买票",
        tag: "官方",
      },
      {
        title: "高德地图",
        url: "https://www.amap.com/",
        description: "公交路线 / 景点搜索",
      },
      {
        title: "中国天气网",
        url: "https://www.weather.com.cn/",
        description: "比手机自带准",
      },
      {
        title: "国家反诈中心",
        url: "https://www.gov.cn/govweb/fwxx/szwd/2022-03/16/content_5679350.htm",
        description: "新生务必装 APP；查收到的可疑链接",
        tag: "重要",
      },
    ],
  },
];
