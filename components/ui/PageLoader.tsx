"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ─── Timeline (seconds) ──────────────────────────────────────────────────── */
const T_WARP  = 1.6;   // full warp speed until here
const T_SLOW  = 2.5;   // particles decelerate + collapse
const T_GLOW  = 3.1;   // glow sphere expands, text appears
const T_FADE  = 3.6;   // everything fades to black
const T_HIDE  = 3.9;   // unmount the loader

const N = 2800;         // particle count

/* ─── Glow-point shader (soft radial halo per streak head) ───────────────── */
const GLOW_V = /* glsl */`
  attribute vec3  aCol;
  uniform   float uOp;
  varying   vec3  vC;
  varying   float vO;
  void main() {
    vC = aCol;
    vO = uOp;
    vec4 mv      = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(1400.0 / -mv.z, 1.5, 96.0);
    gl_Position  = projectionMatrix * mv;
  }
`;
const GLOW_F = /* glsl */`
  varying vec3  vC;
  varying float vO;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv) * 2.0;           /* 0=centre, 1=edge */
    if (d > 1.0) discard;
    float a  = exp(-d * d * 5.5) * vO;     /* Gaussian falloff  */
    gl_FragColor = vec4(vC, a);
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const inv   = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
const easeIn  = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function PageLoader() {
  const [visible,   setVisible]   = useState(true);
  const [showText,  setShowText]  = useState(false);
  const [webglFail, setWebglFail] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), (T_GLOW - 0.15) * 1000);
    const t2 = setTimeout(() => setVisible(false),  T_HIDE * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const W = window.innerWidth, H = window.innerHeight;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      setWebglFail(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x010006, 1);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, W / H, 0.05, 600);
    camera.position.z = 2;

    /* ── Per-particle data ── */
    const px  = new Float32Array(N);   // world x  (constant)
    const py  = new Float32Array(N);   // world y  (constant)
    const rad = new Float32Array(N);   // radius from axis (for collapse)
    const ang = new Float32Array(N);   // angle around axis
    const spd = new Float32Array(N);   // speed multiplier 0.6-1.6
    const pz  = new Float32Array(N);   // current z (dynamic)

    /* ── GPU Buffers: 2 vertices per particle ── */
    const posArr = new Float32Array(N * 6);  // [head.xyz, tail.xyz] × N
    const colArr = new Float32Array(N * 6);  // [head.rgb, tail.rgb] × N

    for (let i = 0; i < N; i++) {
      /* Particle radius uses sqrt distribution → denser near axis */
      const r = Math.pow(Math.random(), 0.55) * 4.5 + 0.08;
      const a = Math.random() * Math.PI * 2;
      rad[i] = r;
      ang[i] = a;
      px[i]  = r * Math.cos(a);
      py[i]  = r * Math.sin(a);
      spd[i] = 0.6 + Math.random();
      /* Spread particles along the entire tunnel from the start */
      pz[i]  = camera.position.z - 200 * Math.random() - 1;

      /* Color palette — purple-dominant to match site theme
         #8b5cf6 (0.545, 0.361, 0.965)  #a78bfa (0.655, 0.545, 0.980)  #6d28d9 (0.427, 0.157, 0.851) */
      const t = Math.random();
      let cr, cg, cb;
      if (t < 0.45) {                                          /* #8b5cf6 core purple */
        cr = 0.50 + Math.random() * 0.10; cg = 0.32 + Math.random() * 0.08; cb = 0.94 + Math.random() * 0.06;
      } else if (t < 0.70) {                                   /* #a78bfa soft violet */
        cr = 0.62 + Math.random() * 0.12; cg = 0.50 + Math.random() * 0.10; cb = 0.96 + Math.random() * 0.04;
      } else if (t < 0.88) {                                   /* near-white violet (bright cores) */
        cr = 0.88 + Math.random() * 0.12; cg = 0.82 + Math.random() * 0.12; cb = 1.0;
      } else {                                                  /* #6d28d9 deep violet accent */
        cr = 0.40 + Math.random() * 0.08; cg = 0.14 + Math.random() * 0.06; cb = 0.84 + Math.random() * 0.08;
      }

      /* Head: full brightness  |  Tail: nearly black (GPU interpolates fade) */
      const h = i * 6, tk = h + 3;
      colArr[h]     = cr;   colArr[h + 1] = cg;   colArr[h + 2] = cb;
      colArr[tk]    = cr * 0.04; colArr[tk + 1] = cg * 0.04; colArr[tk + 2] = cb * 0.04;
    }

    const geo     = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(posArr, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
      transparent:  true,
      opacity:      1,
    });

    scene.add(new THREE.LineSegments(geo, mat));

    /* ── Glow halos (Points on top of streak heads) ── */
    const glowPosArr = new Float32Array(N * 3);
    const glowColArr = new Float32Array(N * 3);
    /* Purple glow color — same across all particles for cohesive theme */
    for (let i = 0; i < N; i++) {
      const mix = Math.random();
      glowColArr[i * 3 + 0] = 0.50 + mix * 0.16;  /* R: 0.50–0.66 */
      glowColArr[i * 3 + 1] = 0.25 + mix * 0.20;  /* G: 0.25–0.45 */
      glowColArr[i * 3 + 2] = 0.92 + mix * 0.08;  /* B: 0.92–1.00 */
    }
    const glowPtGeo  = new THREE.BufferGeometry();
    const glowPosAttr = new THREE.BufferAttribute(glowPosArr, 3);
    glowPosAttr.setUsage(THREE.DynamicDrawUsage);
    glowPtGeo.setAttribute("position", glowPosAttr);
    glowPtGeo.setAttribute("aCol",     new THREE.BufferAttribute(glowColArr, 3));
    const glowPtMat = new THREE.ShaderMaterial({
      uniforms:       { uOp: { value: 1 } },
      vertexShader:   GLOW_V,
      fragmentShader: GLOW_F,
      blending:       THREE.AdditiveBlending,
      depthWrite:     false,
      transparent:    true,
    });
    scene.add(new THREE.Points(glowPtGeo, glowPtMat));

    /* ── Glow sphere ── */
    const glowGeo = new THREE.SphereGeometry(1, 20, 20);
    const glowMat = new THREE.MeshBasicMaterial({
      color:       0x7c3aed,
      transparent: true,
      opacity:     0,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.z = -1;
    scene.add(glowMesh);

    /* ── Render loop ── */
    const t0 = performance.now();
    let prev = 0;
    const MAX_SPEED = 95; // world-units / second

    const draw = () => {
      const elapsed = (performance.now() - t0) / 1000;
      const dt      = Math.min(elapsed - prev, 0.033);
      prev          = elapsed;

      /* Speed curve */
      let speed = 0;
      if (elapsed < T_WARP) {
        speed = MAX_SPEED * easeIn(inv(0, T_WARP, elapsed));
      } else if (elapsed < T_SLOW) {
        speed = MAX_SPEED * easeOut(1 - inv(T_WARP, T_SLOW, elapsed));
      }

      /* Collapse: shrink radius toward axis during decel */
      const collapseT = elapsed > T_WARP ? easeIn(inv(T_WARP, T_SLOW, elapsed)) : 0;
      const normalSpd = speed / MAX_SPEED;

      for (let i = 0; i < N; i++) {
        /* Advance particle */
        pz[i] += spd[i] * speed * dt;

        /* Reset when it passes camera (only during active warp) */
        if (pz[i] > camera.position.z - 0.12) {
          pz[i] = camera.position.z - 200 - Math.random() * 10;
        }

        /* Collapsed radius */
        const rNow = rad[i] * (1 - collapseT * 0.97);
        const x    = rNow * Math.cos(ang[i]);
        const y    = rNow * Math.sin(ang[i]);
        const z    = pz[i];

        /* Streak length: longer when fast and close to camera */
        const proximity   = Math.max(0, 1 - Math.abs(z - camera.position.z) / 80);
        const streakLen   = spd[i] * normalSpd * (1.5 + proximity * 4) * (1 - collapseT * 0.92);

        /* Write head then tail */
        const h = i * 6;
        posArr[h]     = x;  posArr[h + 1] = y;  posArr[h + 2] = z;
        posArr[h + 3] = x;  posArr[h + 4] = y;  posArr[h + 5] = z - streakLen;

        /* Sync glow point to streak head */
        glowPosArr[i * 3]     = x;
        glowPosArr[i * 3 + 1] = y;
        glowPosArr[i * 3 + 2] = z;
      }
      posAttr.needsUpdate    = true;
      glowPosAttr.needsUpdate = true;

      /* Glow sphere */
      const glowT = inv(T_SLOW, T_GLOW, elapsed);
      glowMesh.scale.setScalar(0.04 + easeOut(glowT) * 4.5);
      glowMat.opacity = glowT * 0.85;

      /* Fade streaks + glow points when sphere takes over */
      const fadeT = inv(T_GLOW, T_FADE, elapsed);
      mat.opacity  = 1 - fadeT;
      glowPtMat.uniforms.uOp.value = (1 - fadeT) * normalSpd;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();          mat.dispose();
      glowPtGeo.dispose();    glowPtMat.dispose();
      glowGeo.dispose();      glowMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#010006" }}
        >
          {/* Three.js canvas mount (hidden when WebGL unavailable) */}
          <div ref={mountRef} style={{ position: "absolute", inset: 0, display: webglFail ? "none" : undefined }} />

          {/* CSS-only fallback when WebGL is unavailable */}
          {webglFail && (
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <style>{`
                @keyframes _warpStar {
                  0%   { transform: translate(-50%,-50%) scale(0.1); opacity: 0; }
                  20%  { opacity: 1; }
                  100% { transform: translate(-50%,-50%) scale(28); opacity: 0; }
                }
                @keyframes _glowPulse {
                  0%, 100% { opacity: 0.55; transform: scale(1); }
                  50%       { opacity: 0.90; transform: scale(1.15); }
                }
              `}</style>
              {Array.from({ length: 80 }).map((_, i) => {
                const angle = (i / 80) * Math.PI * 2 + Math.random() * 0.15;
                const dist  = 5 + Math.random() * 45;
                const left  = 50 + Math.cos(angle) * dist;
                const top   = 50 + Math.sin(angle) * dist;
                const dur   = 0.9 + Math.random() * 1.4;
                const delay = Math.random() * 2.2;
                const size  = 1 + Math.random() * 2;
                const hue   = 260 + Math.random() * 30;
                return (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${left}%`, top: `${top}%`,
                    width: size, height: size * (3 + Math.random() * 8),
                    borderRadius: 2,
                    background: `hsl(${hue},90%,72%)`,
                    boxShadow: `0 0 6px 2px hsl(${hue},90%,65%)`,
                    transformOrigin: "50% 50%",
                    animation: `_warpStar ${dur}s ${delay}s ease-in infinite`,
                  }} />
                );
              })}
              {/* Central purple glow orb */}
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                width: 160, height: 160,
                borderRadius: "50%",
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(circle, rgba(139,92,246,0.70) 0%, rgba(109,40,217,0.30) 50%, transparent 70%)",
                animation: "_glowPulse 1.8s ease-in-out infinite",
              }} />
            </div>
          )}

          {/* Soft center vignette to focus eye */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 10%, rgba(1,0,6,0.60) 100%)",
          }} />

          {/* "Entering…" text — centered via flex */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <AnimatePresence>
              {showText && (
                <motion.span
                  key="txt"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    fontSize: "clamp(16px, 5vw, 36px)",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(216, 197, 255, 0.82)",
                    textShadow:
                      "0 0 18px rgba(139,92,246,0.90), 0 0 50px rgba(109,40,217,0.55)",
                    textAlign: "center",
                    padding: "0 24px",
                  }}
                >
                  HOANG THAO PORTFOLIO
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
