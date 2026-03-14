"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;   // outer wrapper — use for grid col-span, sizing etc.
  tilt?: boolean;
  glow?: boolean;
  delay?: number;
  noPadding?: boolean;  // skip default p-6 on content area
}

export default function GlassCard({
  children,
  className = "",
  tilt = true,
  glow = false,
  delay = 0,
  noPadding = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp   = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]),   sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]),   sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]),  sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]),  sp);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [rawX, rawY, tilt]);

  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false);
  }, [rawX, rawY]);

  const glare = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) =>
      `radial-gradient(ellipse 65% 55% at ${x}% ${y}%, rgba(255,255,255,0.07) 0%, transparent 65%)`
  );

  const borderBg = hovered || glow
    ? "linear-gradient(135deg, rgba(167,139,250,0.55) 0%, rgba(139,92,246,0.28) 40%, rgba(109,40,217,0.18) 70%, rgba(167,139,250,0.50) 100%)"
    : "linear-gradient(135deg, rgba(139,92,246,0.26) 0%, rgba(109,40,217,0.10) 50%, rgba(167,139,250,0.22) 100%)";

  return (
    /* Entrance animation wrapper — className here for grid placement */
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={tilt ? { perspective: 800 } : {}}
    >
      {/* Glow halo */}
      <motion.div
        animate={{
          boxShadow: hovered || glow
            ? "0 0 44px 10px rgba(139,92,246,0.22), 0 0 90px 24px rgba(109,40,217,0.10)"
            : "0 0 18px 2px rgba(139,92,246,0.07)",
        }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: 18, height: "100%" }}
      >
        {/* 3-D tilt + lift */}
        <motion.div
          ref={ref}
          style={
            tilt
              ? { rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: 18, height: "100%" }
              : { borderRadius: 18, height: "100%" }
          }
          animate={{ scale: hovered ? 1.014 : 1, y: hovered ? -4 : 0 }}
          transition={{ duration: 0.35 }}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={onLeave}
        >
          {/* Gradient border shell */}
          <div
            style={{
              position:   "relative",
              borderRadius: 18,
              padding:    "1.5px",
              height:     "100%",
              background: borderBg,
              transition: "background 0.4s ease",
              boxSizing:  "border-box",
              boxShadow:  "inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 48px rgba(0,0,0,0.45)",
            }}
          >
            {/* Glass surface */}
            <div
              style={{
                position:             "relative",
                borderRadius:         17,
                overflow:             "hidden",
                height:               "100%",
                background:           "linear-gradient(150deg, rgba(15,6,40,0.82) 0%, rgba(6,2,20,0.92) 60%, rgba(11,4,30,0.86) 100%)",
                backdropFilter:       "blur(28px) saturate(1.65)",
                WebkitBackdropFilter: "blur(28px) saturate(1.65)",
                boxSizing:            "border-box",
              }}
            >
              {/* Mouse-tracked glare */}
              <motion.div
                style={{
                  position:      "absolute",
                  inset:         0,
                  zIndex:        1,
                  pointerEvents: "none",
                  background:    glare,
                  mixBlendMode:  "screen",
                }}
              />

              {/* Top edge highlight */}
              <div
                style={{
                  position:      "absolute",
                  top:           0,
                  left:          "5%",
                  right:         "5%",
                  height:        1,
                  background:    "linear-gradient(90deg, transparent, rgba(255,255,255,0.13) 30%, rgba(167,139,250,0.35) 50%, rgba(255,255,255,0.13) 70%, transparent)",
                  pointerEvents: "none",
                  zIndex:        2,
                }}
              />

              {/* Content */}
              <div
                style={{ position: "relative", zIndex: 10, height: "100%" }}
                className={noPadding ? "" : "p-6"}
              >
                {children}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
