"use client";

import { useEffect, useRef } from "react";

type ParticleType = "burst" | "trail";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  life = 0;
  maxLife: number;
  type: ParticleType;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    radius: number,
    hue: number,
    maxLife: number,
    type: ParticleType
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.hue = hue;
    this.maxLife = maxLife;
    this.type = type;
  }

  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.96;
    this.vy *= 0.96;
    if (this.type === "burst") this.vy += 0.04;
    return this.life < this.maxLife;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = this.life / this.maxLife;
    const alpha = (1 - t) * (this.type === "burst" ? 0.7 : 0.5);
    const r = this.radius * (1 - t * 0.25);
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 2.5);
    grad.addColorStop(0, `hsla(${this.hue}, 95%, 68%, ${alpha})`);
    grad.addColorStop(0.45, `hsla(${this.hue}, 95%, 56%, ${alpha * 0.55})`);
    grad.addColorStop(1, `hsla(${this.hue}, 95%, 50%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Ring {
  x: number;
  y: number;
  radius = 0;
  maxRadius: number;
  hue: number;
  life = 0;
  maxLife: number;
  spikes: number;
  radiusFactors: number[];
  phase: number;

  constructor(x: number, y: number, maxRadius: number, hue: number, maxLife: number) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.hue = hue;
    this.maxLife = maxLife;
    this.spikes = 7 + Math.floor(Math.random() * 4);
    this.radiusFactors = Array.from({ length: this.spikes }, () => 0.62 + Math.random() * 0.38);
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    this.life++;
    const t = this.life / this.maxLife;
    const ease = 1 - Math.pow(1 - t, 3);
    this.radius = this.maxRadius * ease;
    return this.life < this.maxLife;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = this.life / this.maxLife;
    const alpha = (1 - t) * 0.4;
    const inner = this.radius * 0.5;
    const grad = ctx.createRadialGradient(this.x, this.y, inner, this.x, this.y, this.radius);
    grad.addColorStop(0, `hsla(${this.hue}, 95%, 60%, 0)`);
    grad.addColorStop(0.72, `hsla(${this.hue}, 95%, 60%, ${alpha * 0.45})`);
    grad.addColorStop(0.92, `hsla(${this.hue}, 95%, 72%, ${alpha})`);
    grad.addColorStop(1, `hsla(${this.hue}, 95%, 60%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let i = 0; i <= this.spikes; i++) {
      const idx = i % this.spikes;
      const a = (i / this.spikes) * Math.PI * 2;
      const wobble = 0.86 + Math.sin(a * 2.7 + this.life * 0.22 + this.phase) * 0.14;
      const r = this.radius * this.radiusFactors[idx] * wobble;
      const px = this.x + Math.cos(a) * r;
      const py = this.y + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cvs = canvas as HTMLCanvasElement;
    const c = ctx as CanvasRenderingContext2D;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let w = window.innerWidth;
    let h = window.innerHeight;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const rings: Ring[] = [];
    let rafId = 0;
    let hueBase = Math.random() * 360;
    let trailHue = hueBase;
    let frame = 0;
    let prev = { x: 0, y: 0, t: 0 };
    let hasPrev = false;

    const isDark = () => document.documentElement.classList.contains("dark");

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(loop);
    }

    function spawnBurst(x: number, y: number) {
      hueBase = (hueBase + 51) % 360;
      const count = 10 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 1.5 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 0.4;
        const r = 1.5 + Math.random() * 2;
        const hue = (hueBase + (Math.random() - 0.5) * 60 + 360) % 360;
        const life = 45 + Math.floor(Math.random() * 25);
        particles.push(new Particle(x, y, vx, vy, r, hue, life, "burst"));
      }
      const ringCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < ringCount; i++) {
        const maxR = 110 + Math.random() * 50;
        const hue = (hueBase + i * 60 - 60 + 360) % 360;
        const life = 40 + Math.floor(Math.random() * 15);
        rings.push(new Ring(x, y, maxR, hue, life));
      }
      if (particles.length > 250) particles.splice(0, particles.length - 200);
      startLoop();
    }

    function spawnTrail(x: number, y: number, speed: number) {
      const count = speed > 2 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const sp = 0.3 + Math.random() * 0.7;
        const vx = Math.cos(angle) * sp;
        const vy = Math.sin(angle) * sp;
        const r = 1.2 + Math.random() * 1.6;
        const hue = (trailHue + (Math.random() - 0.5) * 50 + 360) % 360;
        const life = 35 + Math.floor(Math.random() * 25);
        particles.push(new Particle(x, y, vx, vy, r, hue, life, "trail"));
      }
      if (particles.length > 250) particles.splice(0, particles.length - 200);
      startLoop();
    }

    function loop() {
      frame++;
      if (frame % 30 === 0) trailHue = (trailHue + 6) % 360;

      c.clearRect(0, 0, w, h);
      c.globalCompositeOperation = isDark() ? "lighter" : "source-over";

      for (let i = rings.length - 1; i >= 0; i--) {
        if (!rings[i].update()) {
          rings.splice(i, 1);
          continue;
        }
        rings[i].draw(c);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
          particles.splice(i, 1);
          continue;
        }
        particles[i].draw(c);
      }

      if (particles.length === 0 && rings.length === 0) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(loop);
    }

    function isInputTarget(t: EventTarget | null): boolean {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    }

    function onClick(e: MouseEvent) {
      if (isInputTarget(e.target)) return;
      spawnBurst(e.clientX, e.clientY);
    }

    function onMouseMove(e: MouseEvent) {
      const now = e.timeStamp;
      if (!hasPrev) {
        prev = { x: e.clientX, y: e.clientY, t: now };
        hasPrev = true;
        return;
      }
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dt = Math.max(now - prev.t, 1);
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      prev = { x: e.clientX, y: e.clientY, t: now };
      if (speed < 0.05) return;
      spawnTrail(e.clientX, e.clientY, speed);
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 0) return;
      if (isInputTarget(e.target)) return;
      const t = e.touches[0];
      spawnBurst(t.clientX, t.clientY);
    }

    function onVisibility() {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (particles.length > 0 || rings.length > 0) {
        startLoop();
      }
    }

    window.addEventListener("click", onClick, true);
    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    } else {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
