"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
};

const COLORS = ["#B45309", "#2563EB", "#059669", "#DC2626", "#7C3AED", "#DB2777", "#F59E0B"];

export default function CheckinCelebration({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 从屏幕中上方爆开（打卡按钮通常在这个区域）
    const cx = w * 0.5;
    const cy = h * 0.35;

    const particles: Particle[] = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7;
      const hue = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        color: hue,
        size: 2.5 + Math.random() * 4,
        life: 0,
        maxLife: 40 + Math.floor(Math.random() * 35),
      });
    }

    let raf = 0;
    function loop() {
      c.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        p.life++;
        if (p.life >= p.maxLife) continue;
        alive = true;
        const t = p.life / p.maxLife;
        const alpha = 1 - t;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14;
        p.vx *= 0.98;
        c.globalAlpha = alpha;
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
        c.fill();
        // 尾迹小点
        if (p.life < p.maxLife * 0.6) {
          c.globalAlpha = alpha * 0.3;
          c.beginPath();
          c.arc(p.x - p.vx * 0.5, p.y - p.vy * 0.5, p.size * 0.5, 0, Math.PI * 2);
          c.fill();
        }
      }
      c.globalAlpha = 1;
      if (alive) {
        raf = requestAnimationFrame(loop);
      }
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[10000]"
      aria-hidden="true"
    />
  );
}
