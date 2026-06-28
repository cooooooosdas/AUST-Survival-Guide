"use client";

import { useEffect, useRef, useCallback } from "react";

/* ---------- 墨滴 ---------- */
class InkDrop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  splats: { ox: number; oy: number; r: number; opacity: number }[];
  rings: { r: number; opacity: number; born: number }[];

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.maxRadius = size;
    this.opacity = 0.4 + Math.random() * 0.2;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.life = 0;
    this.maxLife = 55 + Math.random() * 35;

    // 飞溅小墨点
    const count = 4 + Math.floor(Math.random() * 6);
    this.splats = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = this.maxRadius * (0.7 + Math.random() * 0.8);
      return {
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        r: 0.8 + Math.random() * 2.5,
        opacity: 0.12 + Math.random() * 0.18,
      };
    });

    // 多层墨晕扩散环（模拟墨水在宣纸上的扩散层次）
    this.rings = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => ({
      r: this.maxRadius * (0.3 + i * 0.2),
      opacity: 0.15 - i * 0.03,
      born: 5 + i * 6 + Math.random() * 4,
    }));
  }

  update() {
    this.life++;
    const t = this.life / this.maxLife;
    const ease = 1 - Math.pow(1 - t, 3);
    this.radius = 1 + (this.maxRadius - 1) * ease;
    this.opacity = 0.4 * (1 - t * t);
    this.x += this.vx * (1 - t) * 0.6;
    this.y += this.vy * (1 - t) * 0.6;
    return this.life < this.maxLife;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = this.life;

    // 扩散环
    for (const ring of this.rings) {
      if (t < ring.born) continue;
      const ringAge = (t - ring.born) / (this.maxLife - ring.born);
      if (ringAge > 1) continue;
      const ringR = ring.r * (1 + ringAge * 0.4);
      const ringOp = ring.opacity * (1 - ringAge);
      ctx.strokeStyle = `rgba(25,25,25,${ringOp})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 主体：不规则墨晕
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, `rgba(18,18,18,${this.opacity})`);
    grad.addColorStop(0.35, `rgba(25,25,25,${this.opacity * 0.75})`);
    grad.addColorStop(0.65, `rgba(50,50,50,${this.opacity * 0.3})`);
    grad.addColorStop(1, `rgba(100,100,100,0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    const spikes = 7 + Math.floor(Math.random() * 3);
    for (let i = 0; i <= spikes; i++) {
      const a = (i / spikes) * Math.PI * 2;
      const wobble = 0.82 + Math.sin(a * 2.7 + this.life * 0.25) * 0.18;
      const r = this.radius * wobble;
      const px = this.x + Math.cos(a) * r;
      const py = this.y + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // 飞溅小点
    for (const s of this.splats) {
      const sOp = s.opacity * (1 - this.life / this.maxLife);
      if (sOp <= 0) continue;
      ctx.fillStyle = `rgba(18,18,18,${sOp})`;
      ctx.beginPath();
      ctx.arc(this.x + s.ox, this.y + s.oy, s.r * (1 - this.life / this.maxLife * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------- 主组件 ---------- */
export default function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<InkDrop[]>([]);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dropsRef.current = dropsRef.current.filter((d) => {
      const alive = d.update();
      if (alive) d.draw(ctx);
      return alive;
    });

    if (dropsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = 0;
    }
  }, []);

  const spawn = useCallback((x: number, y: number) => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    // 主墨滴
    const mainSize = 35 + Math.random() * 70;
    dropsRef.current.push(new InkDrop(x, y, mainSize));

    // 2-4 个卫星墨滴（更小更淡）
    const satellites = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < satellites; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 80;
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      const size = 10 + Math.random() * 25;
      dropsRef.current.push(new InkDrop(sx, sy, size));
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cvs: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    function resize() {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.closest("button[type='submit']") ||
        target?.closest("a[href]") ||
        target?.closest("[role='dialog']")
      ) {
        return;
      }
      spawn(e.clientX, e.clientY);
    }

    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spawn]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden="true"
    />
  );
}
