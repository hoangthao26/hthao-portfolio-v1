"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="mb-14 text-center"
    >
      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{
          width:      64,
          height:     1,
          margin:     "0 auto 16px",
          originX:    0.5,
          background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)",
          boxShadow:  "0 0 8px rgba(167,139,250,0.6)",
        }}
      />

      {/* Title */}
      <h2
        className="glow-text mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mx-auto max-w-xl text-sm text-purple-300/65 md:text-base">
          {subtitle}
        </p>
      )}

      {/* Bottom decorative bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          gap:        6,
          marginTop:  18,
        }}
      >
        <div style={{
          height:     1,
          width:      48,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.55))",
        }} />
        <div style={{
          width:        5,
          height:       5,
          borderRadius: "50%",
          background:   "rgba(167,139,250,0.9)",
          boxShadow:    "0 0 8px 2px rgba(167,139,250,0.65)",
        }} />
        <div style={{
          height:     1,
          width:      48,
          background: "linear-gradient(90deg, rgba(139,92,246,0.55), transparent)",
        }} />
      </motion.div>
    </motion.div>
  );
}
