"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  '[role="button"]:not([aria-disabled="true"])',
  "summary",
  'input[type="button"]:not([disabled])',
  'input[type="submit"]:not([disabled])',
].join(",");

export default function ClickRipple() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = container.current;
    if (!host) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      if (!(event.target instanceof Element)) return;

      const target = event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (!target || target.dataset.ripple === "off") return;

      const ink = document.createElement("span");
      ink.className = "click-ink";
      ink.style.left = `${event.clientX}px`;
      ink.style.top = `${event.clientY}px`;
      ink.style.setProperty("--ink-color", getComputedStyle(target).color);
      ink.addEventListener("animationend", () => ink.remove(), { once: true });
      host.appendChild(ink);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return <div ref={container} aria-hidden className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden" />;
}
