"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Download, Mail, FolderOpen } from "lucide-react";

/* ── Icons ──────────────────────────────────────────────────────── */
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* ── Typewriter hook ─────────────────────────────────────────────── */
const ROLES = ["Frontend Developer", "SAP ABAP Developer", "React Native Dev", "UI / UX Enthusiast"];

function useTypewriter(words: string[], speed = 75, pause = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx]     = useState(0);
  const [phase, setPhase]         = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const word = words[wordIdx];
    if (phase === "typing") {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), pause);
      return () => clearTimeout(t);
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 300);
      return () => clearTimeout(t);
    }
    // deleting
    if (displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), speed / 2);
      return () => clearTimeout(t);
    }
    setWordIdx(i => (i + 1) % words.length);
    setPhase("typing");
  }, [displayed, phase, wordIdx, words, speed, pause]);

  return displayed;
}


/* ── Orbit ring decoration ───────────────────────────────────────── */
/* ── Profile Card ────────────────────────────────────────────────── */
function ProfileCard() {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), springCfg);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), springCfg);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), springCfg);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), springCfg);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5);
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false);
  }, [rawX, rawY]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.14) 0%, transparent 65%)`
  );

  const avatarParticles = [
    { size: 4, top: "14%", left: "24%", delay: 0.4, duration: 10 },
    { size: 3, top: "20%", right: "20%", delay: 1.1, duration: 12 },
    { size: 5, top: "50%", left: "8%", delay: 0.7, duration: 9 },
    { size: 3, top: "66%", right: "12%", delay: 1.6, duration: 11 },
    { size: 4, top: "38%", right: "6%", delay: 0.9, duration: 8.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="order-1 flex-shrink-0 md:order-2"
      style={{ perspective: 900 }}
    >
      {/* Floating animation */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative" }}
        >
          {/* Holographic aura behind avatar */}
          <div
            style={{
              position: "absolute",
              inset: "-30% -20%",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            {/* Soft energy aura layers */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "540px",
                height: "540px",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 35% 35%, rgba(167,139,250,0.38) 0%, transparent 58%), radial-gradient(circle at 68% 60%, rgba(139,92,246,0.30) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(109,40,217,0.25) 0%, transparent 70%)",
                filter: "blur(18px)",
                mixBlendMode: "screen",
                opacity: 0.5,
              }}
            />

            <motion.div
              animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.4, 0.65, 0.4] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "380px",
                height: "380px",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(closest-side, rgba(196,181,253,0.55) 0%, rgba(139,92,246,0.22) 45%, transparent 72%)",
                filter: "blur(6px)",
                mixBlendMode: "screen",
                opacity: 0.6,
              }}
            />

            <motion.div
              animate={{ scale: [1, 1.02, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "620px",
                height: "620px",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(109,40,217,0.08) 45%, transparent 72%)",
                filter: "blur(26px)",
                opacity: 0.35,
              }}
            />

            {/* Particle sparks */}
            {avatarParticles.map((particle, index) => (
              <motion.span
                key={`avatar-particle-${index}`}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.1, 0.7, 0.1],
                  scale: [0.9, 1.15, 0.9],
                }}
                transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
                style={{
                  position: "absolute",
                  top: particle.top,
                  left: particle.left,
                  right: particle.right,
                  width: particle.size,
                  height: particle.size,
                  borderRadius: "50%",
                  background: "rgba(167,139,250,0.75)",
                  boxShadow: "0 0 10px rgba(139,92,246,0.55), 0 0 20px rgba(109,40,217,0.35)",
                }}
              />
            ))}
          </div>

          {/* Outer glow halo */}
          <motion.div
          animate={{
            boxShadow: hovered
              ? "0 0 70px 22px rgba(139,92,246,0.48), 0 0 140px 50px rgba(109,40,217,0.24)"
              : "0 0 44px 12px rgba(139,92,246,0.30), 0 0 90px 28px rgba(109,40,217,0.13)",
          }}
          transition={{ duration: 0.45 }}
          style={{ borderRadius: 24, position: "relative", zIndex: 1 }}
        >
          {/* 3-D tilt card */}
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: 24 }}
            animate={{ scale: hovered ? 1.045 : 1 }}
            transition={{ duration: 0.35 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glass shell — gradient border */}
            <div
              style={{
                position:   "relative",
                borderRadius: 24,
                padding:    2,
                background: "linear-gradient(135deg, rgba(139,92,246,0.6) 0%, rgba(109,40,217,0.28) 40%, rgba(255,255,255,0.10) 100%)",
                boxShadow:  "inset 0 1px 0 rgba(255,255,255,0.20), 0 28px 56px rgba(0,0,0,0.60)",
              }}
            >
              {/* Inner glass */}
              <div
                style={{
                  position:             "relative",
                  borderRadius:         22,
                  overflow:             "hidden",
                  background:           "linear-gradient(145deg, rgba(20,10,52,0.78) 0%, rgba(8,4,28,0.90) 100%)",
                  backdropFilter:       "blur(28px) saturate(1.7)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.7)",
                }}
              >
                {/* Mouse-tracked glare */}
                <motion.div
                  style={{
                    position:      "absolute",
                    inset:         0,
                    zIndex:        10,
                    pointerEvents: "none",
                    borderRadius:  22,
                    background:    glareBackground,
                    mixBlendMode:  "screen",
                  }}
                />

                {/* Static shimmer streak top-left */}
                <div
                  style={{
                    position:      "absolute",
                    top:           -28,
                    left:          -16,
                    width:         130,
                    height:        90,
                    background:    "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, transparent 70%)",
                    transform:     "rotate(-22deg)",
                    pointerEvents: "none",
                    zIndex:        9,
                  }}
                />

                {/* Profile image — translateZ pop */}
                <motion.div
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ translateZ: hovered ? 24 : 10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div
                    style={{
                      position: "relative",
                      width:    "clamp(280px, 42vw, 420px)",
                      height:   "clamp(280px, 42vw, 420px)",
                    }}
                  >
                    {imgError ? (
                      <div
                        style={{
                          position:       "absolute",
                          inset:          0,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          background:     "linear-gradient(135deg, rgba(88,28,135,0.6), rgba(49,46,129,0.4), rgba(76,29,149,0.6))",
                        }}
                      >
                        <span style={{ fontSize: 58, fontWeight: 700, color: "rgba(196,181,253,0.45)", userSelect: "none" }}>
                          HT
                        </span>
                      </div>
                    ) : (
                      <Image
                        src="/profile-v2.png"
                        alt="Phan Đỗ Hoàng Thao"
                        fill
                        className="object-cover"
                        priority
                        sizes="420px"
                        onError={() => setImgError(true)}
                      />
                    )}

                    {/* Bottom fade */}
                    <div
                      style={{
                        position:      "absolute",
                        inset:         "auto 0 0 0",
                        height:        80,
                        background:    "linear-gradient(to top, rgba(4,2,16,0.82), transparent)",
                        pointerEvents: "none",
                        zIndex:        5,
                      }}
                    />

                    {/* Image inner rim glow */}
                    <motion.div
                      animate={{
                        boxShadow: hovered
                          ? "inset 0 0 32px 10px rgba(139,92,246,0.32)"
                          : "inset 0 0 20px 5px rgba(139,92,246,0.16)",
                      }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0, borderRadius: 4, pointerEvents: "none", zIndex: 6 }}
                    />
                  </div>
                </motion.div>

                {/* Bottom name badge */}
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position:             "absolute",
                    bottom:               14,
                    left:                 "50%",
                    transform:            "translateX(-50%)",
                    zIndex:               12,
                    padding:              "5px 16px",
                    borderRadius:         999,
                    background:           "rgba(139,92,246,0.20)",
                    border:               "1px solid rgba(139,92,246,0.38)",
                    backdropFilter:       "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    whiteSpace:           "nowrap",
                    boxShadow:            "0 0 16px 4px rgba(139,92,246,0.22)",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(221,196,255,0.92)", letterSpacing: "0.09em" }}>
                    Frontend · SAP
                  </span>
                </motion.div>

                {/* Top-right availability dot */}
                <div
                  style={{
                    position:  "absolute",
                    top:       14,
                    right:     14,
                    zIndex:    12,
                    display:   "flex",
                    alignItems: "center",
                    gap:       6,
                    padding:   "4px 10px",
                    borderRadius: 999,
                    background: "rgba(16,185,129,0.12)",
                    border:    "1px solid rgba(16,185,129,0.30)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(52,211,153,1)", boxShadow: "0 0 6px 2px rgba(52,211,153,0.7)" }}
                  />
                  <span style={{ fontSize: 10, color: "rgba(110,231,183,0.9)", fontWeight: 600, letterSpacing: "0.06em" }}>
                    Open to work
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Text Panel ──────────────────────────────────────────────────── */
function TextPanel() {
  const role = useTypewriter(ROLES);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 140, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]),  spring);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]),  spring);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false);
  }, [rawX, rawY]);

  const nameContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.4 } },
  };
  const nameWord = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)",
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="order-2 w-full flex-1 md:order-1 text-center md:text-left"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ scale: hovered ? 1.015 : 1 }}
        transition={{ duration: 0.4 }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
      >
      {/* Name — word stagger + blur reveal */}
      <motion.h1
        variants={nameContainer}
        initial="hidden"
        animate="show"
        className="glow-text mb-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}
      >
        {["Phan Đỗ", "Hoàng Thao"].map(w => (
          <motion.span key={w} variants={nameWord} style={{ display: "inline-block" }}>
            {w}
          </motion.span>
        ))}
      </motion.h1>

      {/* Typewriter role */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.85, duration: 0.55 }}
        className="mb-5 md:mb-6"
        style={{ minHeight: 34, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <p
          className="text-base font-medium sm:text-lg md:text-xl"
          style={{ display: "flex", gap: 3, alignItems: "center" }}
        >
          <span style={{
            background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {role}
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.75, repeat: Infinity }}
            style={{
              display: "inline-block", width: 2, height: "1.05em",
              background: "rgba(167,139,250,0.9)", borderRadius: 1,
              marginLeft: 2, verticalAlign: "middle",
            }}
          />
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1, marginBottom: 20,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.45) 20%, rgba(167,139,250,0.20) 60%, transparent)",
        }}
      />

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mb-6 text-sm leading-relaxed text-purple-200/70 md:mb-7 md:text-base"
      >
        Final-year Software Engineering student at FPT University with hands-on
        SAP experience (ABAP, RAP, Fiori) from OJT at FPT Software. I ship
        modern frontends with React, Next.js &amp; React Native, and leverage
        AI-assisted tools to improve productivity across every project.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.55 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start"
      >
        <Button href="#projects" variant="primary">
          <FolderOpen size={16} />
          View Projects
        </Button>
        <Button href="/cv/cv_phandohoangthao.pdf" variant="outline">
          <Download size={16} />
          Download CV
        </Button>
        <Button href="https://github.com/hoangthao26" variant="outline">
          <GithubIcon size={16} />
          GitHub
        </Button>
        <Button href="#contact" variant="ghost">
          <Mail size={16} />
          Contact Me
        </Button>
      </motion.div>
      </motion.div>{/* /tilt */}
    </motion.div>
  );
}

/* ── Hero Section ────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center section-padding"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.13, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)" }}
        />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-purple-deep/10 blur-[100px]" />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-2/3 h-[250px] w-[250px] rounded-full blur-[80px]"
          style={{ background: "rgba(109,40,217,0.09)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto flex max-w-6xl flex-col items-center gap-8 sm:gap-10 md:flex-row md:items-center md:gap-14 lg:gap-20">
        <TextPanel />
        <ProfileCard />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-purple-400/50 tracking-widest uppercase">Scroll</span>
          <div className="h-7 w-4 rounded-full border border-purple-400/30 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-1.5 w-1 rounded-full bg-purple-400/70"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

