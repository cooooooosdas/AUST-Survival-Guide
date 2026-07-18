"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-revealed");
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`reveal-init ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
