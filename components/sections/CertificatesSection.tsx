"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { Award, X, ZoomIn } from "lucide-react";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
}

const certificates: Certificate[] = [
  {
    title: "On-the-Job Training (OJT)",
    issuer: "FPT Software",
    date: "Jan – May 2025",
    image: "/certificates/OJT.jpg",
  },
  {
    title: "Software Testing",
    issuer: "FPT Software",
    date: "2025",
    image: "/certificates/Software_testing.jpg",
  },
  {
    title: "Academic Preparatory English",
    issuer: "FPT University",
    date: "2023",
    image: "/certificates/ACADEMIC_PREPARATORY_ENGLISH.jpg",
  },
  {
    title: "Startup Course",
    issuer: "FPT University",
    date: "Summer 2025",
    image: "/certificates/startup_course.jpg",
  },
  {
    title: "Honorable Student — Fall 2023",
    issuer: "FPT University",
    date: "Fall 2023",
    image: "/certificates/Fall_2023.jpg",
  },
  {
    title: "Honorable Student — Spring 2024",
    issuer: "FPT University",
    date: "Spring 2024",
    image: "/certificates/Spring_2024.jpg",
  },
  {
    title: "Honorable Student — Summer 2025",
    issuer: "FPT University",
    date: "Summer 2025",
    image: "/certificates/Summer_2025.jpg",
  },
  {
    title: "Honorable Student — Fall 2025",
    issuer: "FPT University",
    date: "Fall 2025",
    image: "/certificates/Fall_2025.jpg",
  },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  const portalRef = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    portalRef.current = document.body;
    setMounted(true);
  }, []);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20,
        background: "rgba(2,0,10,0.92)",
        backdropFilter: "blur(20px)",
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(139,92,246,0.15)",
          border: "1px solid rgba(139,92,246,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#c4b5fd", cursor: "pointer", transition: "background 0.2s",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.30)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.15)")}
      >
        <X size={16} />
      </button>

      {/* Image container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 820,
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.30)",
          boxShadow: "0 40px 100px rgba(109,40,217,0.45)",
        }}
      >
        {imgError ? (
          <div style={{
            height: 480, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(60,20,110,0.5), rgba(15,8,40,0.9))",
          }}>
            <Award size={64} color="rgba(167,139,250,0.2)" />
          </div>
        ) : (
          <Image
            src={cert.image}
            alt={cert.title}
            width={820}
            height={580}
            className="w-full h-auto"
            style={{ display: "block", maxHeight: "80vh", objectFit: "contain" }}
            onError={() => setImgError(true)}
          />
        )}
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: 16, textAlign: "center" }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
          {cert.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999,
            color: "rgba(196,181,253,0.88)", background: "rgba(139,92,246,0.14)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}>{cert.issuer}</span>
          <span style={{ fontSize: 11, color: "rgba(167,139,250,0.50)" }}>{cert.date}</span>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted || !portalRef.current) return null;
  return createPortal(content, portalRef.current);
}

// ─── Cert Card ────────────────────────────────────────────────────────────────
function CertCard({ cert, index, onView }: { cert: Certificate; index: number; onView: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);

  return (
    <GlassCard delay={index * 0.1} noPadding>
      {/* Image — larger */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 220, cursor: "pointer" }}
        onClick={onView}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {imgError ? (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(88,28,135,0.35) 0%, rgba(49,46,129,0.25) 100%)",
          }}>
            <Award size={40} color="rgba(167,139,250,0.22)" />
          </div>
        ) : (
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-cover"
            style={{
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.06)" : "scale(1.01)",
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}

        {/* Bottom fade */}
        <div style={{
          position: "absolute", inset: "auto 0 0 0", height: 72,
          background: "linear-gradient(to top, rgba(8,3,22,0.90), transparent)",
          pointerEvents: "none",
        }} />

        {/* Zoom hint overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(8,3,22,0.32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2,
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 999,
            background: "rgba(109,40,217,0.55)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(139,92,246,0.45)",
            fontSize: 12, fontWeight: 600, color: "#e9d5ff",
          }}>
            <ZoomIn size={14} />
            View Full
          </div>
        </motion.div>

        {/* Award badge */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          width: 30, height: 30, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(139,92,246,0.22)", border: "1px solid rgba(139,92,246,0.35)",
          backdropFilter: "blur(10px)", boxShadow: "0 0 10px rgba(139,92,246,0.25)",
        }}>
          <Award size={13} color="#a78bfa" />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{
          fontSize: 13, fontWeight: 700, color: "#fff",
          lineHeight: 1.35, marginBottom: 8,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {cert.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10.5, fontWeight: 600, padding: "2px 9px", borderRadius: 999,
            color: "rgba(196,181,253,0.88)", background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.22)",
          }}>{cert.issuer}</span>
          <span style={{ fontSize: 10.5, color: "rgba(167,139,250,0.48)" }}>{cert.date}</span>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
const MOBILE_INITIAL = 3;

export default function CertificatesSection() {
  const [lightbox,  setLightbox]  = useState<Certificate | null>(null);
  const [expanded,  setExpanded]  = useState(false);

  return (
    <section id="certificates" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[130px]"
          style={{ background: "rgba(139,92,246,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-6xl">
        <SectionTitle
          title="Certificates"
          subtitle="Professional certifications and achievements"
        />

        {/* Mobile: show first 3, expandable. sm+: show all */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Always show all on sm+ via CSS, control count on mobile via state */}
          {certificates.map((cert, i) => (
            <div key={cert.title} className={i >= MOBILE_INITIAL ? "hidden sm:block" : ""}>
              <CertCard
                cert={cert}
                index={i}
                onView={() => setLightbox(cert)}
              />
            </div>
          ))}
          {/* Expanded certs on mobile */}
          <AnimatePresence>
            {expanded && certificates.slice(MOBILE_INITIAL).map((cert, i) => (
              <motion.div
                key={cert.title + "-expanded"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="sm:hidden"
              >
                <CertCard
                  cert={cert}
                  index={MOBILE_INITIAL + i}
                  onView={() => setLightbox(cert)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View more / less — mobile only */}
        {certificates.length > MOBILE_INITIAL && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center sm:hidden"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            8,
                padding:        "10px 24px",
                borderRadius:   999,
                background:     "rgba(139,92,246,0.12)",
                border:         "1px solid rgba(139,92,246,0.30)",
                color:          "#c4b5fd",
                fontSize:       13,
                fontWeight:     600,
                cursor:         "pointer",
                letterSpacing:  "0.04em",
                transition:     "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.22)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.30)";
              }}
            >
              {expanded
                ? "Show less"
                : `View ${certificates.length - MOBILE_INITIAL} more`}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex" }}
              >
                ▼
              </motion.span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox cert={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
