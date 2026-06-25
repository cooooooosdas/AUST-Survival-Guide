import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `你是「安理大生存指南」的助手。你帮助安徽理工大学的学生解答学业、校园生活、软件工具等方面的问题。回答时：
1. 优先参考本站已有的内容（学长来信、工具链接、学习资源等）
2. 回答简洁有用，不要废话
3. 如果不确定，如实说明`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "缺少消息内容" }, { status: 400 });
    }

    const lastUserMsg = messages[messages.length - 1].content.trim();

    // 第一层：本地站内搜索
    const localResults = search(lastUserMsg);
    if (localResults.length > 0 && (localResults[0] as unknown as { score: number }).score >= 10) {
      const topResults = localResults.slice(0, 4);
      return NextResponse.json({
        mode: "local",
        results: topResults.map((r) => ({
          title: r.title,
          href: r.href,
          type: r.type,
          section: r.section,
          text: r.text?.slice(0, 120),
        })),
        message: `在站内找到 ${topResults.length} 个相关内容，看看有没有你要的：`,
      });
    }

    // 第二层：AI API（如果配置了）
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        mode: "fallback",
        message:
          "站内没找到相关内容，AI 助手暂未配置。你可以试试换个关键词，或通过搜索页浏览全站内容。",
        suggestion: "/search",
      });
    }

    const apiUrl = process.env.AI_API_URL || "https://api.anthropic.com/v1/messages";
    const model = process.env.AI_MODEL || "claude-sonnet-4-20250514";

    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-10), // 保留最近 10 轮上下文
    ];

    // 判断是否为 OpenAI 兼容格式
    const isOpenAICompat = apiUrl.includes("openai") || apiUrl.includes("openrouter") || apiUrl.includes("groq");

    if (isOpenAICompat) {
      // OpenAI 兼容格式
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: fullMessages.map((m) => ({ role: m.role, content: m.content })),
          max_tokens: 1024,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("AI API error:", res.status, errText);
        return NextResponse.json(
          { error: "AI 服务暂时不可用，请稍后再试。" },
          { status: 502 }
        );
      }

      // 流式返回
      const stream = res.body;
      if (!stream) {
        return NextResponse.json({ error: "响应流为空" }, { status: 502 });
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const readable = new ReadableStream({
        async start(controller) {
          const reader = stream.getReader();
          const decoder = new TextDecoder();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(encoder.encode(decoder.decode(value, { stream: true })));
            }
          } catch (e) {
            console.error("Stream error:", e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Anthropic Messages API 格式
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: fullMessages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return NextResponse.json(
        { error: "AI 服务暂时不可用，请稍后再试。" },
        { status: 502 }
      );
    }

    const stream = res.body;
    if (!stream) {
      return NextResponse.json({ error: "响应流为空" }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(encoder.encode(decoder.decode(value, { stream: true })));
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
