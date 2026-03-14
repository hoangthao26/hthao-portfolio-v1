"use client";

import { useRef, useEffect } from "react";

/* ── Star tiers ─────────────────────────────────────────────────────
   1. Distant  (~65%) — tiny, very faint, almost no glow
   2. Mid      (~28%) — slightly larger, soft halo
   3. Near     ( ~7%) — small but clearly glowing, purple-tinted
   ────────────────────────────────────────────────────────────────── */
type Tier = 0 | 1 | 2;

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  speed: number;       // twinkle speed
  phase: number;
  tier: Tier;
  spriteIdx: number;   // 0 = cool-white  1 = violet
}

/* Pre-render a radial glow sprite once — drawn with drawImage, zero
   per-frame gradient cost.  Smaller softness = crisper edge.        */
function makeSprite(
  size: number,
  core: string,
  mid: string,
  softness: number     // 0–1: how quickly the glow falls off
): HTMLCanvasElement {
  const oc = document.createElement("canvas");
  oc.width = oc.height = size;
  const ctx = oc.getContext("2d")!;
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0,           "rgba(255,255,255,1)");
  g.addColorStop(0.15,        core);
  g.addColorStop(softness,    mid);
  g.addColorStop(1,           "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return oc;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let stars: Star[] = [];
    let logW = 0;
    let logH = 0;

    /* ── Build sprites ── */
    // Tier 0: distant — tiny core, almost no glow
    const sprite0w = makeSprite(32, "rgba(210,205,255,0.7)", "rgba(160,140,255,0.1)", 0.5);
    // Tier 1: mid — cool-white with gentle halo
    const sprite1w = makeSprite(64, "rgba(220,215,255,0.9)", "rgba(160,140,255,0.25)", 0.55);
    const sprite1v = makeSprite(64, "rgba(190,150,255,0.9)", "rgba(130,90,240,0.25)",  0.55);
    // Tier 2: near — violet glow, visible halo
    const sprite2w = makeSprite(96, "rgba(230,220,255,0.95)", "rgba(170,130,255,0.35)", 0.45);
    const sprite2v = makeSprite(96, "rgba(200,150,255,0.95)", "rgba(130,80,240,0.35)",  0.45);

    const spriteMap: HTMLCanvasElement[][] = [
      [sprite0w],
      [sprite1w, sprite1v],
      [sprite2w, sprite2v],
    ];

    /* ── Glow-radius multipliers per tier ── */
    const glowMult: number[] = [3.5, 9, 16];

    const generate = () => {
      /* Sparse total — aim for calm outer-space feel */
      const area   = logW * logH;
      const total  = Math.min(Math.floor(area / 4500), 420);

      stars = Array.from({ length: total }, () => {
        const rand = Math.random();
        const tier: Tier = rand < 0.65 ? 0 : rand < 0.93 ? 1 : 2;

        const r =
          tier === 0 ? Math.random() * 0.25 + 0.08 :
          tier === 1 ? Math.random() * 0.45 + 0.28 :
                       Math.random() * 0.70 + 0.45;

        const baseAlpha =
          tier === 0 ? Math.random() * 0.30 + 0.06 :
          tier === 1 ? Math.random() * 0.35 + 0.22 :
                       Math.random() * 0.30 + 0.55;

        const sprites  = spriteMap[tier];
        const spriteIdx = Math.floor(Math.random() * sprites.length);

        return {
          x: Math.random(),
          y: Math.random(),
          r,
          baseAlpha,
          speed: Math.random() * 0.25 + 0.03,
          phase: Math.random() * Math.PI * 2,
          tier,
          spriteIdx,
        };
      });
    };

    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      logW = rect.width  || window.innerWidth;
      logH = rect.height || window.innerHeight;
      canvas.width  = Math.round(logW * dpr);
      canvas.height = Math.round(logH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let t = 0;

    const draw = () => {
      t += 0.005;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, logW, logH);
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        /* Distant stars twinkle subtly; near stars pulse more */
        const depth   = s.tier === 0 ? 0.12 : s.tier === 1 ? 0.28 : 0.38;
        const twinkle = Math.sin(t * s.speed * 5 + s.phase);
        const alpha   = s.baseAlpha * (1 - depth + twinkle * depth);

        const px   = s.x * logW;
        const py   = s.y * logH;
        const gR   = s.r * glowMult[s.tier];
        const d    = gR * 2;
        const sp   = spriteMap[s.tier][s.spriteIdx];

        ctx.globalAlpha = Math.max(0, Math.min(0.92, alpha));
        ctx.drawImage(sp, px - gR, py - gR, d, d);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
