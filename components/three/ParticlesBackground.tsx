"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ── Glow sprite texture ────────────────────────────────────────────
   Soft radial gradient: white core → violet halo → transparent.
   128 px gives smooth results without heavy memory use.             */
function makeGlowTex(size = 128): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const h = size / 2;
  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0,    "rgba(255,255,255,1.00)");
  g.addColorStop(0.12, "rgba(225,200,255,0.90)");
  g.addColorStop(0.35, "rgba(160,100,255,0.45)");
  g.addColorStop(0.65, "rgba(100, 50,220,0.12)");
  g.addColorStop(1,    "rgba(  0,  0,  0,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* ── Imperatively set BufferAttributes (r3f + TS compatibility) ── */
function usePointGeo(positions: Float32Array, colors: Float32Array) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  useEffect(() => {
    const g = geoRef.current;
    if (!g) return;
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
  }, [positions, colors]);
  return geoRef;
}

/* ── Colour palette — purple/violet/white only ─────────────────── */
const PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#e0d4ff"),
  new THREE.Color("#c4a8ff"),
  new THREE.Color("#a78bfa"),
  new THREE.Color("#8b5cf6"),
];
function randColor(): THREE.Color {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)]
    .clone()
    .multiplyScalar(0.7 + Math.random() * 0.5);
}

/* ── Layer 1: Sparse galaxy arc — 120 particles ─────────────────── */
function SparseArc({ tex }: { tex: THREE.Texture }) {
  const meshRef = useRef<THREE.Points>(null);
  const matRef  = useRef<THREE.PointsMaterial>(null);
  const ptr     = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const N   = 120;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      /* Loose spiral arc — not a full ring */
      const t   = (i / N) * Math.PI * 2.2;
      const r   = 3.5 + t * 0.45 + (Math.random() - 0.5) * 1.6;
      pos[i*3]     = Math.cos(t) * r;
      pos[i*3 + 1] = (Math.random() - 0.5) * 1.2;
      pos[i*3 + 2] = Math.sin(t) * r;
      const c = randColor();
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const geoRef = usePointGeo(positions, colors);

  useFrame(({ clock, pointer: p }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.012;
    ptr.current.x += (p.x * 0.3 - ptr.current.x) * 0.02;
    ptr.current.y += (p.y * 0.2 - ptr.current.y) * 0.02;
    meshRef.current.rotation.x = ptr.current.y * 0.3 + 0.22;
    meshRef.current.rotation.z = ptr.current.x * 0.12;
    matRef.current.opacity = 0.55 + Math.sin(t * 0.45) * 0.15;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        ref={matRef}
        map={tex}
        size={0.07}
        vertexColors
        transparent
        opacity={0.55}
        alphaTest={0.004}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Layer 2: Ambient haze — 180 scattered specks ───────────────── */
function AmbientHaze({ tex }: { tex: THREE.Texture }) {
  const meshRef = useRef<THREE.Points>(null);
  const matRef  = useRef<THREE.PointsMaterial>(null);

  const { positions, colors } = useMemo(() => {
    const N   = 180;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r     = 3 + Math.pow(Math.random(), 0.5) * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i*3 + 2] = r * Math.cos(phi);
      const c = randColor();
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const geoRef = usePointGeo(positions, colors);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.005;
    matRef.current.opacity = 0.22 + Math.sin(t * 0.28 + 1.4) * 0.08;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        ref={matRef}
        map={tex}
        size={0.018}
        vertexColors
        transparent
        opacity={0.22}
        alphaTest={0.004}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Layer 3: Bright accent motes — only 18 large orbs ──────────── */
function AccentMotes({ tex }: { tex: THREE.Texture }) {
  const meshRef = useRef<THREE.Points>(null);
  const matRef  = useRef<THREE.PointsMaterial>(null);

  const { positions, colors } = useMemo(() => {
    const N   = 18;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i*3]     = (Math.random() - 0.5) * 18;
      pos[i*3 + 1] = (Math.random() - 0.5) * 12;
      pos[i*3 + 2] = (Math.random() - 0.5) * 18;
      /* Accent motes lean brighter/whiter */
      const c = PALETTE[Math.floor(Math.random() * 3)].clone();
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const geoRef = usePointGeo(positions, colors);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.007;
    meshRef.current.rotation.x = t * 0.004;
    matRef.current.opacity = 0.5 + Math.sin(t * 0.75 + 2.1) * 0.22;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        ref={matRef}
        map={tex}
        size={0.09}
        vertexColors
        transparent
        opacity={0.5}
        alphaTest={0.004}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Scene ──────────────────────────────────────────────────────── */
function Scene() {
  const tex = useMemo(() => makeGlowTex(128), []);
  return (
    <>
      <SparseArc   tex={tex} />
      <AmbientHaze tex={tex} />
      <AccentMotes tex={tex} />

      {/* Subtle bloom — low intensity so it enhances without overwhelming */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.08}
          luminanceSmoothing={0.9}
          intensity={0.9}
          radius={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ── Export ─────────────────────────────────────────────────────── */
export default function ParticlesCanvas() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
