"use client";

/*  CosmicBackground — multi-layer immersive space background
 *
 *  Layer stack (back → front):
 *    0  Deep-space base          (#020008 solid fill)
 *    1  Noise vignette           (CSS radial-gradient)
 *    2  Nebula blobs             (CSS animated divs   — NebulaLayer)
 *    3  Star field               (Canvas + raf        — StarField)
 *    4  3-D particle cloud       (Three.js / r3f      — ParticlesCanvas)
 *    5  Section-glow accents     (CSS radial-gradients)
 *
 *  Mouse parallax (RAF loop, lerp factor 0.04) applies different
 *  translation magnitudes to each layer to create depth.
 */

import { useRef, useEffect } from "react";
import NebulaLayer from "./NebulaLayer";
import StarField from "./StarField";
import ParticlesCanvas from "./ParticlesBackground";

export default function CosmicBackground() {
  /* Parallax refs — one per moving layer */
  const nebulaRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* Raw + smoothed mouse position in [-1, 1] */
  const target = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let rafId: number;

    const tick = () => {
      const L = 0.04;
      smooth.current.x += (target.current.x - smooth.current.x) * L;
      smooth.current.y += (target.current.y - smooth.current.y) * L;

      const sx = smooth.current.x;
      const sy = smooth.current.y;

      /* Scale parallax strength by viewport width so it never exceeds
         the negative-inset buffer on small screens.
         vw < 768  → factor 0.4 (mobile)
         768–1024  → factor 0.7 (tablet)
         1024+     → factor 1.0 (desktop)                              */
      const vw = window.innerWidth;
      const f  = vw < 768 ? 0.4 : vw < 1024 ? 0.7 : 1.0;

      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate(${sx * 14 * f}px, ${sy * 10 * f}px)`;
      }
      if (starsRef.current) {
        starsRef.current.style.transform = `translate(${sx * 22 * f}px, ${sy * 16 * f}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${sx * 30 * f}px, ${sy * 22 * f}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        /* contain:strict creates a hard clip boundary — nothing inside
           can trigger layout/paint/scroll outside this box.
           Fixes horizontal scroll on mobile caused by negative-inset
           parallax layers overflowing on iOS Safari.                  */
        contain: "strict",
      }}
    >
      {/* ── Layer 0 – deep-space base ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#020008",
        }}
      />

      {/* ── Layer 0b – subtle vignette noise via radial overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,5,0.7) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Layer 2 – Nebula blobs (parallax, slowest) ── */}
      <div
        ref={nebulaRef}
        style={{
          position: "absolute",
          inset: "-12%",
          willChange: "transform",
        }}
      >
        <NebulaLayer />
      </div>

      {/* ── Layer 3 – Star field canvas (parallax, mid) ── */}
      <div
        ref={starsRef}
        style={{
          position: "absolute",
          inset: "-5%",
          willChange: "transform",
        }}
      >
        <StarField />
      </div>

      {/* ── Layer 4 – 3-D particles (Three.js handles its own
                      mouse reaction internally) ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ParticlesCanvas />
      </div>

      {/* ── Layer 5 – Section glow accents (parallax, fastest) ── */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: "-15%",
          willChange: "transform",
        }}
      >
        {/* Hero centre bloom */}
        <div
          style={{
            position: "absolute",
            width: "900px",
            height: "900px",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.13) 0%, rgba(109,40,217,0.06) 40%, transparent 68%)",
            filter: "blur(40px)",
          }}
        />
        {/* Mid-page left accent */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            top: "42%",
            left: "-5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(88,28,235,0.10) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        {/* Bottom-right accent */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            bottom: "8%",
            right: "5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%)",
            filter: "blur(45px)",
          }}
        />
        {/* Very wide deep-purple ambient */}
        <div
          style={{
            position: "absolute",
            width: "160%",
            height: "160%",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(55,10,130,0.06) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
