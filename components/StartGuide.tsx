"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Laptop,
  GraduationCap,
} from "lucide-react";

const paths = [
  {
    label: "刚来安理",
    icon: Compass,
    title: "先熟悉校园，再慢慢找到自己的节奏。",
    description: "报到、宿舍、食堂和选课，从学长整理的新生指南开始。",
    links: [
      { href: "/letters/freshman-handbook", label: "打开新生手册" },
      { href: "/microservices", label: "查找校内办事入口" },
    ],
  },
  {
    label: "准备学习",
    icon: GraduationCap,
    title: "把想学的，变成今天可以开始的事。",
    description: "找一门课程、安排一次练习，用适合自己的步调坚持下去。",
    links: [
      { href: "/letters/cs-first-semester", label: "读计算机入学指南" },
      { href: "/checkin", label: "开始学习打卡" },
    ],
  },
  {
    label: "寻找工具",
    icon: Laptop,
    title: "让趁手的工具，替你省一点时间。",
    description: "软件、实用网站与 AI 工具，按你正在做的事来选。",
    links: [
      { href: "/software", label: "浏览常用软件" },
      { href: "/tools", label: "打开工具箱" },
    ],
  },
] as const;

export default function StartGuide() {
  const [selected, setSelected] = useState(0);
  const current = paths[selected];
  return (
    <section
      id="start-guide"
      className="start-guide"
      aria-labelledby="start-title"
    >
      <div className="start-guide-intro">
        <span className="eyebrow">
          <Compass size={16} aria-hidden /> 从这里开始
        </span>
        <h2 id="start-title">你现在需要什么？</h2>
        <p>选一个方向，我们帮你找到入口。</p>
        <div
          className="guide-choices"
          role="group"
          aria-label="选择你的当前需求"
        >
          {paths.map((path, index) => (
            <button
              key={path.label}
              type="button"
              aria-pressed={selected === index}
              aria-controls="guide-result"
              onClick={() => setSelected(index)}
            >
              <path.icon size={18} aria-hidden />
              {path.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="guide-result"
        id="guide-result"
        aria-live="polite"
        aria-atomic="true"
      >
        <BookOpen size={24} className="text-primary" aria-hidden />
        <h3>{current.title}</h3>
        <p>{current.description}</p>
        <div className="guide-result-links">
          {current.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
              <ArrowRight size={16} aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
