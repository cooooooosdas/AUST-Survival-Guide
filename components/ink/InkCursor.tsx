"use client";

import { useEffect, useRef } from "react";

/* ---------- 笔触点 ---------- */
type Point = { x: number; y: number; speed: number; born: number };

export default function InkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number>(0);
  const prevRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const visibleRef = useRef(false);

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

    function onMove(e: MouseEvent) {
      visibleRef.current = true;
      const prev = prevRef.current;
      const dx = prev ? e.clientX - prev.x : 0;
      const dy = prev ? e.clientY - prev.y : 0;
      const dt = prev ? Math.max(e.timeStamp - prev.t, 1) : 16;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
      prevRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };

      pointsRef.current.push({ x: e.clientX, y: e.clientY, speed, born: performance.now() });
      // 保留最近 700ms 的点
      const cutoff = performance.now() - 700;
      while (pointsRef.current.length > 1 && pointsRef.current[0].born < cutoff) {
        pointsRef.current.shift();
      }
      if (pointsRef.current.length > 60) {
        pointsRef.current = pointsRef.current.slice(-60);
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    function loop(now: number) {
      c.clearRect(0, 0, cvs.width, cvs.height);
      const pts = pointsRef.current;
      // 清理过期点
      for (let i = pts.length - 1; i >= 0; i--) {
        if (now - pts[i].born > 700) pts.splice(i, 1);
      }
      if (pts.length < 2) {
        rafRef.current = 0;
        prevRef.current = null;
        return;
      }

      // 画毛笔笔锋：从细到粗再收尖，模拟提按
      c.lineCap = "round";
      c.lineJoin = "round";

      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const age = (now - p1.born) / 700;
        if (age > 1) continue;

        // 速度越快笔画越细，慢则粗（模拟毛笔按压力度）
        const speedFactor = Math.min(p1.speed / 2, 1); // 0(慢) ~ 1(快)
        const baseWidth = 14 - speedFactor * 8; // 慢=14px 宽，快=6px 宽
        // 收尾处变细
        const t = i / pts.length;
        const taper = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
        const width = baseWidth * Math.max(taper, 0.2);

        // 透明度：越新越实，越旧越淡
        const opacity = 0.28 * (1 - age) * Math.min(t * 2, 1);

        if (opacity <= 0.01 || width < 0.3) continue;

        // 墨色渐变：中心浓，边缘淡
        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        const grad = c.createRadialGradient(mx, my, 0, mx, my, width / 2);
        grad.addColorStop(0, `rgba(18,18,18,${opacity})`);
        grad.addColorStop(0.5, `rgba(30,30,30,${opacity * 0.6})`);
        grad.addColorStop(1, `rgba(60,60,60,0)`);

        c.strokeStyle = grad;
        c.lineWidth = width;
        c.beginPath();
        c.moveTo(p0.x, p0.y);
        c.lineTo(p1.x, p1.y);
        c.stroke();
      }

      // 末端的墨滴（每次停顿处积墨）
      const last = pts[pts.length - 1];
      const lastAge = (now - last.born) / 700;
      if (lastAge < 0.3 && pts.length > 5) {
        const dotOpacity = 0.22 * (1 - lastAge / 0.3);
        const dotR = 3 + last.speed * 0.5;
        const dotGrad = c.createRadialGradient(last.x, last.y, 0, last.x, last.y, dotR);
        dotGrad.addColorStop(0, `rgba(18,18,18,${dotOpacity})`);
        dotGrad.addColorStop(1, `rgba(18,18,18,0)`);
        c.fillStyle = dotGrad;
        c.beginPath();
        c.arc(last.x, last.y, dotR, 0, Math.PI * 2);
        c.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9997]"
      aria-hidden="true"
      style={{ opacity: visibleRef.current ? 1 : 0, transition: "opacity 0.4s" }}
    />
  );
}
