"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const element = bar.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      const root = document.documentElement;
      const available = root.scrollHeight - root.clientHeight;
      const progress = available > 0 ? Math.min(root.scrollTop / available, 1) : 0;
      element.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div
        ref={bar}
        className="reading-progress-bar"
      />
    </div>
  );
}
