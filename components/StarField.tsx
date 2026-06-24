"use client";

import { useEffect, useId, useMemo } from "react";

type Star = {
  id: string;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

const COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "#FFFFFF",
];

function buildStars(count: number, seed: number): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    const pseudo = Math.sin(seed + i * 127.1) * 43758.5453;
    out.push({
      id: `s-${i}-${seed}`,
      left: pseudo - Math.floor(pseudo),
      top: ((pseudo * 0.618) % 1 + 1) % 1,
      size: 2 + ((pseudo * 3) % 3),
      color: COLORS[i % COLORS.length],
      duration: 6 + ((pseudo * 8) % 10),
      delay: ((pseudo * 5) % 6),
    });
  }
  return out;
}

export default function StarField({ count = 12 }: { count?: number }) {
  const reactId = useId();
  const seed = useMemo(() => Date.now(), []);
  const stars = useMemo(() => buildStars(count, seed), [count, seed]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left * 100}%`,
            top: `${s.top * 100}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            opacity: 0.35,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
