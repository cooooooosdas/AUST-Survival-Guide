import type { LinkGroup } from "@/lib/types";

export const groups: LinkGroup[] = [
  {
    id: "chat-cn",
    title: "对话 · 国内可直连",
    items: [
      {
        title: "DeepSeek",
        url: "https://chat.deepseek.com/",
        description: "免费、能打、长上下文；做作业首选",
        tag: "推荐",
      },
      {
        title: "豆包（字节）",
        url: "https://www.doubao.com/",
        description: "中文回复自然，APP 端也好用",
      },
      {
        title: "Kimi（月之暗面）",
        url: "https://kimi.moonshot.cn/",
        description: "处理长文档 / 论文阅读拿手",
        tag: "推荐",
      },
      {
        title: "通义千问",
        url: "https://tongyi.aliyun.com/",
        description: "阿里出品，免费、稳定",
      },
      {
        title: "智谱清言（GLM）",
        url: "https://chatglm.cn/",
        description: "清华系大模型",
      },
      {
        title: "文心一言",
        url: "https://yiyan.baidu.com/",
        description: "百度大模型",
      },
    ],
  },
  {
    id: "chat-overseas",
    title: "对话 · 海外（需梯子）",
    items: [
      {
        title: "ChatGPT",
        url: "https://chat.openai.com/",
        description: "OpenAI 官方；GPT-4 / GPT-5 体感最稳",
        tag: "需梯子",
      },
      {
        title: "Claude",
        url: "https://claude.ai/",
        description: "Anthropic 官方；写代码 / 长篇推理强",
        tag: "需梯子",
      },
      {
        title: "Gemini",
        url: "https://gemini.google.com/",
        description: "Google AI；多模态强",
        tag: "需梯子",
      },
      {
        title: "Perplexity",
        url: "https://www.perplexity.ai/",
        description: "AI 搜索，给出引用来源",
        tag: "需梯子",
      },
    ],
  },
  {
    id: "code",
    title: "AI 编程助手",
    items: [
      {
        title: "Cursor",
        url: "https://www.cursor.com/",
        description: "AI 编辑器，新生写课设最快上手",
        tag: "推荐",
      },
      {
        title: "GitHub Copilot",
        url: "https://github.com/features/copilot",
        description: "学生通过 Education Pack 可免费",
        tag: "学生免费",
      },
      {
        title: "Claude Code",
        url: "https://www.anthropic.com/claude-code",
        description: "终端里的 AI 协作 CLI",
      },
      {
        title: "Trae（字节）",
        url: "https://www.trae.com.cn/",
        description: "国内可直连的 AI 编辑器",
      },
      {
        title: "Cline",
        url: "https://github.com/cline/cline",
        description: "VS Code 里的开源 AI 编程插件",
      },
    ],
  },
  {
    id: "image",
    title: "AI 图像 / 视频",
    items: [
      {
        title: "即梦 AI（字节）",
        url: "https://jimeng.jianying.com/",
        description: "国内文生图 / 视频，免费额度多",
        tag: "推荐",
      },
      {
        title: "Midjourney",
        url: "https://www.midjourney.com/",
        description: "海外文生图老牌",
        tag: "需梯子",
      },
      {
        title: "Hugging Face Spaces",
        url: "https://huggingface.co/spaces",
        description: "成千上万个免费 AI demo 直接玩",
      },
    ],
  },
  {
    id: "study",
    title: "AI 学习 / 写作",
    items: [
      {
        title: "Perplexity",
        url: "https://www.perplexity.ai/",
        description: "查资料 + 给来源，比纯 ChatGPT 靠谱",
        tag: "推荐",
      },
      {
        title: "NotebookLM",
        url: "https://notebooklm.google.com/",
        description: "丢一堆 PDF 进去做你的私人辅导",
        tag: "推荐",
      },
      {
        title: "秘塔搜索",
        url: "https://metaso.cn/",
        description: "国内 AI 搜索，回答带引用",
      },
    ],
  },
];
