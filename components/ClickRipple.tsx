"use client";

import { useCallback, useEffect, useRef } from "react";

export default function ClickRipple() {
  const container = useRef<HTMLDivElement>(null);

  const spawn = useCallback((x: number, y: number) => {
    const el = document.createElement("span");
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0; height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123,140,222,0.3) 0%, rgba(255,158,181,0.15) 50%, rgba(125,212,184,0.05) 100%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      animation: austin-ripple 0.9s ease-out forwards;
    `;
    container.current?.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes austin-ripple {
        0%   { width: 0;   height: 0;   opacity: 0.9; }
        100% { width: 320px; height: 320px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    const onClick = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      style.remove();
    };
  }, [spawn]);

  return <div ref={container} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />;
}
