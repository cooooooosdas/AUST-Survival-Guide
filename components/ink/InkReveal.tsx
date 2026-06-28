"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** 动画方向，默认从左到右模拟墨笔划过 */
  direction?: "left" | "right" | "up" | "down";
  /** 延迟 ms，同一批元素可以递增实现依次出现 */
  delay?: number;
  /** 额外 className */
  className?: string;
};

export default function InkReveal({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 延迟后触发
          const timer = setTimeout(() => setVisible(true), delay);
          obs.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const dirMap: Record<string, { from: string; to: string }> = {
    left: { from: "-105%", to: "0%" },
    right: { from: "105%", to: "0%" },
    up: { from: "105%", to: "0%" },
    down: { from: "-105%", to: "0%" },
  };
  const axis = direction === "left" || direction === "right" ? "translateX" : "translateY";
  const { from, to } = dirMap[direction];

  return (
    <div
      ref={ref}
      className={["ink-reveal overflow-hidden", className].join(" ")}
      style={
        {
          "--ink-from": from,
          "--ink-to": to,
          "--ink-axis": axis,
          opacity: visible ? 1 : 0,
          transform: `${axis}(${visible ? to : from})`,
          transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0ms, ${axis} 0.8s cubic-bezier(0.16,1,0.3,1) 0ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
