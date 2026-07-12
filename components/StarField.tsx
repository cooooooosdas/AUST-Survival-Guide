"use client";

import { useMemo } from "react";

type Star = {
  id: string;
  left: number;
  top: number;
  size: number;
  color: "primary" | "secondary" | "tertiary" | "white";
  duration: number;
  delay: number;
};

const COLORS: Star["color"][] = ["primary", "secondary", "tertiary", "white"];

const SEED = Date.now();

function buildStars(count: number, seed: number): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    const pseudo = Math.sin(seed + i * 127.1) * 43758.5453;
    const f = (v: number) => ((v % 1) + 1) % 1;
    out.push({
      id: `s-${i}-${seed}`,
      left: f(pseudo),
      top: f(pseudo * 0.618),
      size: 1 + (Math.abs(pseudo * 3) % 3.5),
      color: COLORS[i % COLORS.length],
      duration: 5 + (Math.abs(pseudo * 8) % 12),
      delay: (Math.abs(pseudo * 5) % 7),
    });
  }
  return out;
}

const COLOR_CLASS: Record<Star["color"], string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  white: "bg-white",
};

export default function StarField({ count = 50 }: { count?: number }) {
  const stars = useMemo(() => buildStars(count, SEED), [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className={`absolute rounded-full ${COLOR_CLASS[s.color]}`}
          style={{
            left: `${s.left * 100}%`,
            top: `${s.top * 100}%`,
            width: s.size,
            height: s.size,
            opacity: 0.3,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
