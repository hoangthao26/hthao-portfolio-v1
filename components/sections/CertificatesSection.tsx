"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { Award, ExternalLink } from "lucide-react";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  link?: string;
}

const certificates: Certificate[] = [
  {
    title: "SAP Certified Development Associate",
    issuer: "SAP",
    date: "2025",
    image: "/certificates/sap-cert.png",
    link: "#",
  },
  {
    title: "React Developer Certificate",
    issuer: "Meta",
    date: "2024",
    image: "/certificates/react-cert.png",
    link: "#",
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    date: "2024",
    image: "/certificates/freecodecamp-cert.png",
    link: "#",
  },
];

function CertCard({ cert, index }: { cert: Certificate; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <GlassCard delay={index * 0.12} noPadding>
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        {imgError ? (
          <div
            style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     "linear-gradient(135deg, rgba(88,28,135,0.35) 0%, rgba(49,46,129,0.25) 100%)",
            }}
          >
            <Award size={32} color="rgba(167,139,250,0.25)" />
          </div>
        ) : (
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
        <div
          style={{
            position:      "absolute",
            inset:         "auto 0 0 0",
            height:        64,
            background:    "linear-gradient(to top, rgba(8,3,22,0.95), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Award badge */}
        <div
          style={{
            position:       "absolute",
            top:            12,
            right:          12,
            width:          32,
            height:         32,
            borderRadius:   "50%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "rgba(139,92,246,0.22)",
            border:         "1px solid rgba(139,92,246,0.35)",
            backdropFilter: "blur(10px)",
            boxShadow:      "0 0 12px rgba(139,92,246,0.25)",
          }}
        >
          <Award size={14} color="#a78bfa" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1 text-sm font-bold text-white leading-snug">{cert.title}</h3>

        <div className="mb-3 flex items-center gap-2 mt-2">
          <span
            style={{
              fontSize:     11,
              fontWeight:   600,
              color:        "rgba(196,181,253,0.85)",
              padding:      "2px 9px",
              borderRadius: 999,
              background:   "rgba(139,92,246,0.12)",
              border:       "1px solid rgba(139,92,246,0.22)",
            }}
          >
            {cert.issuer}
          </span>
          <span style={{ fontSize: 11, color: "rgba(167,139,250,0.50)" }}>{cert.date}</span>
        </div>

        {cert.link && (
          <Button href={cert.link} variant="outline" className="py-1.5 px-3 text-xs">
            <ExternalLink size={11} />
            View Certificate
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

export default function CertificatesSection() {
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
