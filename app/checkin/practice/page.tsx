"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Question = {
  id: string;
  type: "choice" | "coding";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  content: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  tags: string[];
};

const DIFFICULTY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: "简单", color: "text-[#3A8B72]", bg: "bg-accent/10" },
  medium: { label: "中等", color: "text-[#D97706]", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  hard: { label: "困难", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
};

export default function PracticePage() {
  const [type, setType] = useState<"choice" | "coding">("choice");
  const [difficulty, setDifficulty] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const current = questions[currentIndex];

  function fetchQuestions() {
    setLoading(true);
    setSelectedAnswer(null);
    setShowAnswer(false);
    const params = new URLSearchParams({ type, count: "10" });
    if (difficulty) params.set("difficulty", difficulty);

    fetch(`/api/questions-bank?${params}`)
      .then((r) => r.json())
      .then((json) => {
        setQuestions(json.questions ?? []);
        setCurrentIndex(0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (type || difficulty) {
      fetchQuestions();
    }
  }, [type, difficulty]);

  function handleSelect(option: string) {
    if (showAnswer) return;
    setSelectedAnswer(option);
    setShowAnswer(true);
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      fetchQuestions();
    }
  }

  const diffInfo = DIFFICULTY_MAP[current?.difficulty ?? "easy"];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/checkin" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        返回打卡
      </Link>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Practice</p>
        <h1 className="mt-2 text-2xl font-semibold text-primary">刷题练习</h1>
        <p className="mt-2 text-sm text-muted">随机出题，检验你的基础。</p>
      </div>

      {/* 题型选择 */}
      <div className="mt-6 flex gap-2">
        {[
          { key: "choice" as const, label: "选择题", icon: "☑️" },
          { key: "coding" as const, label: "编程题", icon: "💻" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setType(t.key); setDifficulty(""); }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-all duration-200",
              type === t.key
                ? "border-primary bg-primary-light text-primary shadow-sm"
                : "border-border text-muted hover:border-primary/50 hover:text-primary"
            )}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 难度选择 */}
      <div className="mt-4 flex gap-2">
        {[
          { key: "easy", label: "简单" },
          { key: "medium", label: "中等" },
          { key: "hard", label: "困难" },
        ].map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDifficulty(d.key)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-all duration-200",
              difficulty === d.key
                ? `${DIFFICULTY_MAP[d.key].bg} ${DIFFICULTY_MAP[d.key].color} border-current`
                : "border-border text-muted hover:border-primary/50 hover:text-primary"
            )}
          >
            {d.label}
          </button>
        ))}
        {difficulty && (
          <button
            type="button"
            onClick={() => setDifficulty("")}
            className="text-xs text-muted underline underline-offset-2 self-center ml-1"
          >
            不限难度
          </button>
        )}
      </div>

      {/* 题目展示 */}
      <div className="mt-8">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">加载中…</div>
        ) : !difficulty ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-sm text-muted">请先选择难度，开始刷题吧。</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">😅</p>
            <p className="text-sm text-muted">该分类暂无题目，换个难度试试。</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6">
            {/* 题号和标签 */}
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                第 {currentIndex + 1} / {questions.length} 题
              </span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs", diffInfo.bg, diffInfo.color)}>
                {diffInfo.label}
              </span>
              {current.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">{t}</span>
              ))}
            </div>

            {/* 题干 */}
            <h3 className="text-base font-medium text-text whitespace-pre-line">{current.title}</h3>
            <p className="mt-3 text-sm text-text/90 whitespace-pre-line leading-relaxed">{current.content}</p>

            {/* 选择题选项 */}
            {current.type === "choice" && current.options && (
              <div className="mt-5 space-y-2">
                {current.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const isSelected = selectedAnswer === letter;
                  const isCorrect = letter === current.answer;
                  const showResult = showAnswer && isSelected;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(letter)}
                      disabled={showAnswer}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200",
                        showResult
                          ? "border-green-400 bg-green-50 text-green-800"
                          : isSelected && !isCorrect
                            ? "border-red-400 bg-red-50 text-red-800"
                            : showAnswer && isCorrect
                              ? "border-green-400 bg-green-50 text-green-800"
                              : "border-border hover:border-primary/30 hover:bg-bg-alt",
                        showAnswer && "cursor-default",
                        !showAnswer && "cursor-pointer"
                      )}
                    >
                      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium", showResult ? "border-green-500 bg-green-100" : isSelected && !isCorrect ? "border-red-500 bg-red-100" : showAnswer && isCorrect ? "border-green-500 bg-green-100" : "border-border")}>
                        {letter}
                      </span>
                      <span>{opt}</span>
                      {showResult && isCorrect && <span className="ml-auto text-green-600">✓</span>}
                      {showAnswer && isSelected && !isCorrect && <span className="ml-auto text-red-600">✗</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 编程题 */}
            {current.type === "coding" && (
              <div className="mt-5">
                <p className="text-xs text-muted mb-2">参考答案：</p>
                {showAnswer ? (
                  <pre className="overflow-x-auto rounded-lg bg-black/5 p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                    {current.answer}
                  </pre>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    查看参考答案
                  </button>
                )}
              </div>
            )}

            {/* 解析 */}
            {(showAnswer || current.type === "coding") && current.explanation && (
              <div className="mt-5 rounded-lg border border-accent/20 bg-accent/5 p-4">
                <p className="text-xs font-medium text-accent mb-1">解析</p>
                <p className="text-sm text-text/80 leading-relaxed">{current.explanation}</p>
              </div>
            )}

            {/* 下一题 */}
            {(showAnswer || current.type === "coding") && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
                >
                  {currentIndex < questions.length - 1 ? "下一题 →" : "再来一轮 →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
