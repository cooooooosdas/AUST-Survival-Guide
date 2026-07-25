import { NextRequest, NextResponse } from "next/server";
import { retrieve } from "@/lib/rag/retrieval";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `你是「安理大生存指南」的智能助手。你拥有本站全站内容的完整知识，包括学长来信、工具链接、学习资源、FAQ 等。

回答规则：
1. 优先基于提供的【参考内容】回答，综合多段内容给出完整回答
2. 如果参考内容能回答问题，直接回答，不要提"我在站内找到了…"
3. 如果参考内容不足以回答，结合你的通用知识补充，并说明哪些是站内信息、哪些是补充
4. 如果完全不知道，如实说"这个我还不清楚，你可以试试搜索页或留言区提问"
5. 回答简洁有用，中文为主
6. 不要编造站内不存在的信息`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function buildRagPrompt(query: string, context: string): string {
  if (!context) {
    return `用户问题：${query}\n\n注意：当前没有检索到相关的站内内容。请基于你的通用知识回答，如果不知道就如实说明。`;
  }
  return `以下是本站的相关内容（供你回答时参考）：

${context}

---

用户问题：${query}

请基于以上参考内容回答用户问题。如果参考内容能回答问题，直接回答。如果部分内容不够，结合你的知识补充。`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "缺少消息内容" }, { status: 400 });
    }

    const lastUserMsg = messages[messages.length - 1].content.trim();

    // ---- RAG: 语义检索全站内容 ----
    let ragContext = "";
    let hasContext = false;
    try {
      const rag = await retrieve(lastUserMsg, 8);
      if (rag.ready) {
        hasContext = true;
        ragContext = rag.context;
      }
    } catch (err) {
      console.error("RAG retrieval error:", err);
      // 检索失败不影响继续走 LLM
    }

    // 没有 LLM key 时，用检索到的内容直接作答（不做生成，只做检索展示）
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      if (hasContext) {
        return NextResponse.json({
          mode: "rag-only",
          message:
            "我在站内找到了一些相关内容，整理如下：\n\n" +
            ragContext +
            "\n\n💡 配置 AI_API_KEY 后可以获得更智能的整合回答。",
        });
      }
      return NextResponse.json({
        mode: "fallback",
        message: "站内没找到相关内容，AI 助手暂未配置。你可以试试换个关键词，或通过搜索页浏览全站内容。",
        suggestion: "/search",
      });
    }

    const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    const isOpenAICompat =
      apiUrl.includes("openai") ||
      apiUrl.includes("openrouter") ||
      apiUrl.includes("groq") ||
      apiUrl.includes("deepseek") ||
      apiUrl.includes("dashscope") ||
      apiUrl.includes("zhipu") ||
      apiUrl.includes("api.stepfun") ||
      apiUrl.includes("api.moonshot") ||
      apiUrl.includes("api.siliconflow");

    const recentMessages = messages.slice(-10);

    if (isOpenAICompat) {
      const fullMessages: ChatMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...recentMessages.map((m) => ({ ...m, content: ragContext ? `[上下文]\n${ragContext}\n\n${m.content}` : m.content })),
      ];

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: fullMessages,
          max_tokens: 1024,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("AI API error:", res.status, errText.slice(0, 300));
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
            console.error("Stream relay error:", e);
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

    // Anthropic Messages API 格式 fallback
    const ragSystemPrompt = `${SYSTEM_PROMPT}\n\n${ragContext ? `参考内容：\n${ragContext}` : ""}`;

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
        system: ragSystemPrompt,
        messages: recentMessages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText.slice(0, 300));
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
            controller.enqueue(encoder.encode(decoder.decode(value)));
          }
        } catch (e) {
          console.error("Stream relay error:", e);
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
