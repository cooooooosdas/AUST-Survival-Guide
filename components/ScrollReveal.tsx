"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const style: CSSProperties = shown
    ? { animation: `fade-up 0.7s var(--ease-out-soft) ${delay}ms forwards` }
    : {};

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
