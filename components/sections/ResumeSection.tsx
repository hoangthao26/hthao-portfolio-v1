"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { Download, GraduationCap, Briefcase } from "lucide-react";

interface TimelineItem {
  type: "education" | "experience";
  title: string;
  organization: string;
  period: string;
  description: string;
}

const timeline: TimelineItem[] = [
  {
    type: "education",
    title: "Bachelor of Information Technology",
    organization: "FPT University",
    period: "2021 - 2025",
    description:
      "Studied software engineering with focus on web development and enterprise systems.",
  },
  {
    type: "experience",
    title: "SAP ABAP Developer",
    organization: "Company Name",
    period: "2024 - Present",
    description:
      "Developing SAP ABAP applications, RAP-based Fiori apps, and CDS view models for business processes.",
  },
  {
    type: "experience",
    title: "Frontend Developer",
    organization: "Freelance / Projects",
    period: "2023 - Present",
    description:
      "Building modern web and mobile applications using React, Next.js, React Native, and TypeScript.",
  },
];

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const isLeft = index % 2 === 0;
  const Icon = item.type === "education" ? GraduationCap : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-4 sm:gap-6"
    >
      {/* Timeline node */}
      <div className="relative z-10 flex-shrink-0">
        <div
          style={{
            width:          40,
            height:         40,
            borderRadius:   "50%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.15) 100%)",
            border:         "2px solid rgba(139,92,246,0.55)",
            boxShadow:      "0 0 14px rgba(139,92,246,0.55), 0 0 32px rgba(139,92,246,0.22)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Icon size={16} color="#a78bfa" />
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.013, y: -3 }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1, marginBottom: 32 }}
      >
        {/* Gradient border */}
        <div
          style={{
            borderRadius: 18,
            padding:      "1.5px",
            background:   "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.12) 50%, rgba(167,139,250,0.24) 100%)",
            boxShadow:    "0 16px 40px rgba(0,0,0,0.40)",
            transition:   "background 0.3s ease",
          }}
        >
          <div
            style={{
              position:             "relative",
              borderRadius:         17,
              overflow:             "hidden",
              background:           "linear-gradient(150deg, rgba(15,6,40,0.82) 0%, rgba(6,2,20,0.92) 100%)",
              backdropFilter:       "blur(28px) saturate(1.6)",
              WebkitBackdropFilter: "blur(28px) saturate(1.6)",
              padding:              "20px 22px",
            }}
          >
            {/* Top edge highlight */}
            <div
              style={{
                position:      "absolute",
                top:           0,
                left:          "5%",
                right:         "5%",
                height:        1,
                background:    "linear-gradient(90deg, transparent, rgba(167,139,250,0.30) 50%, transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Period badge */}
            <span
              style={{
                display:      "inline-block",
                marginBottom: 10,
                padding:      "3px 12px",
                borderRadius: 999,
                fontSize:     11,
                fontWeight:   600,
                color:        "rgba(196,181,253,0.88)",
                background:   "rgba(139,92,246,0.14)",
                border:       "1px solid rgba(139,92,246,0.26)",
              }}
            >
              {item.period}
            </span>

            <h3 className="text-base font-bold text-white mb-0.5">{item.title}</h3>
            <p className="text-sm font-medium text-purple-300/65 mb-2">{item.organization}</p>
            <p className="text-sm leading-relaxed text-purple-200/50">{item.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ResumeSection() {
  return (
    <section id="resume" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.07, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(109,40,217,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-3xl px-1">
        <SectionTitle
          title="Resume"
          subtitle="My education and professional journey"
        />

        {/* Download CV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Button href="/cv.pdf" variant="primary">
            <Download size={15} />
            Download CV
          </Button>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-5">
          {/* Vertical line */}
          <div className="timeline-line absolute left-[19px] top-0 h-full w-px" />
          {timeline.map((item, i) => (
            <TimelineCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
