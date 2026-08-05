"use client";

import { useEffect, useRef, useState, useTransition, useCallback } from "react";
import { Bot, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type MsgRole = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: MsgRole;
  content: string;
  mode?: "local" | "rag-only" | "ai" | "fallback";
  links?: { title: string; href: string; type: string }[];
};

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdown(text: string) {
  const escaped = escapeHtml(text);
  const lines = escaped.split("\n");
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre
            key={codeKey++}
            className="mt-2 overflow-x-auto rounded-lg bg-black/10 px-3 py-2 text-xs leading-relaxed"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <p key={i} className="mt-3 text-sm font-semibold text-text">
          {line.slice(2)}
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 text-xs leading-relaxed text-text/90">
          {line.slice(2)}
        </li>
      );
    } else if (line.match(/^\d+\./)) {
      elements.push(
        <li key={i} className="ml-4 text-xs leading-relaxed text-text/90 list-decimal">
          {line.replace(/^\d+\.\s*/, "")}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      elements.push(
        <p
          key={i}
          className="text-xs leading-relaxed text-text/90"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
  }

  return elements;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "你好！我是安理大生存指南助手。你可以问我关于学业、校园服务、工具使用等问题，或者直接搜索站内内容。",
    },
  ]);
  const [input, setInput] = useState("");
  // Loading indicator (render only — not in send deps).
  const [sending, setSending] = useState(false);
  // Refs for transient values — avoids recreating the send callback
  // on every keystroke (Vercel best practice: rerender-use-ref-transient-values).
  const inputRef = useRef(input);
  const messagesRef = useRef(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  // Sync refs with state via useEffect to avoid ref access during render
  useEffect(() => {
    inputRef.current = input;
    messagesRef.current = messages;
  }, [input, messages]);

  useEffect(() => {
    if (open && inputElRef.current) {
      inputElRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(async () => {
    // Read from refs so the callback has stable deps (rerender-use-ref-transient-values)
    const text = inputRef.current.trim();
    if (!text || sending) return;
    setSending(true);

    const userMsg: Message = { id: uid(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const history = [...messagesRef.current, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("event-stream")) {
        // Streaming AI response — use startTransition so input stays responsive
        // while text arrives (Vercel best practice: rerender-transitions).
        const assistantId = uid();
        setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", mode: "ai" }]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.slice(6).trim();
                if (dataStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(dataStr);

                  // OpenAI format
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    fullText += delta;
                    startTransition(() =>
                      setMessages((prev) =>
                        prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                      )
                    );
                    continue;
                  }

                  // Anthropic format
                  const anthText = parsed.delta?.text;
                  if (anthText) {
                    fullText += anthText;
                    startTransition(() =>
                      setMessages((prev) =>
                        prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                      )
                    );
                  }
                } catch {
                  // skip non-JSON lines
                }
              }
            }
          }
        }
      } else {
        // JSON response (local search or fallback)
        const data = await res.json();

        if (data.mode === "local") {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: data.message,
              mode: "local",
              links: data.results,
            },
          ]);
        } else if (data.mode === "rag-only") {
          // RAG 检索到了内容但未配置 LLM，直接把检索内容作为回答展示
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: data.message,
              mode: "rag-only",
            },
          ]);
        } else if (data.mode === "fallback") {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: data.message,
              mode: "fallback",
            },
          ]);
        } else {
          // Unexpected response format
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: data.message || "收到未知响应，请稍后再试。",
              mode: "fallback",
            },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: "连接出现问题，请稍后再试。你也可以直接浏览站内内容。",
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [sending]); // stable — reads all values from refs

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="打开 AI 助手"
          title="AI 助手"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:scale-105 active:scale-95"
        >
          <Bot className="h-6 w-6" strokeWidth={2} />
        </button>
      )}

      {/* 对话面板 */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex w-[calc(100vw-3rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-all duration-300 ease-out">
          {/* 标题栏 */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">安理大助手</span>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">beta</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭对话"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-alt hover:text-text"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* 消息列表 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4 max-h-[400px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2",
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-bg-alt text-text"
                  )}
                >
                  {msg.role === "assistant" && msg.mode === "local" && msg.links && (
                    <p className="text-xs text-muted mb-2">{msg.content}</p>
                  )}
                  {msg.role === "assistant" && msg.mode === "local" && msg.links ? (
                    <div className="space-y-1.5">
                      {msg.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-primary/10"
                        >
                          <span
                            className={cn(
                              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                              link.type === "letter" && "bg-accent-light text-[#3A8B72]",
                              link.type === "link" && "bg-primary-light text-primary",
                              link.type === "section" && "bg-secondary-light text-[#8B4560]"
                            )}
                          >
                            {link.type === "letter" ? "来信" : link.type === "link" ? "链接" : "板块"}
                          </span>
                          <span className="truncate text-text group-hover:text-primary">
                            {link.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : msg.role === "assistant" && msg.mode === "fallback" ? (
                    <div>
                      <p className="text-xs text-muted">{msg.content}</p>
                      <a
                        href="/search"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        前往搜索页 →
                      </a>
                    </div>
                  ) : msg.role === "assistant" && msg.mode === "rag-only" ? (
                    <div className="text-xs leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  ) : msg.role === "assistant" && msg.mode === "ai" ? (
                    <div className="text-xs leading-relaxed">
                      {msg.content ? renderMarkdown(msg.content) : (
                        <span className="inline-block h-3 w-2 animate-pulse bg-muted rounded-sm" />
                      )}
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-bg-alt px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 输入框 */}
          <div className="border-t border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <input
                ref={inputElRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="问点什么…"
                aria-label="输入问题"
                disabled={sending}
                className="flex-1 rounded-lg border border-border bg-bg-alt px-3 py-2 text-xs text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim() || sending}
                aria-label="发送"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-40 active:scale-95"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
