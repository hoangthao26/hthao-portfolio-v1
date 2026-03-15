"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { GraduationCap, Code2, Layers, Rocket } from "lucide-react";

const aboutItems = [
  {
    icon: GraduationCap,
    title: "Software Engineering Student",
    description:
      "Final-year Software Engineering student at FPT University (2022–2026), GPA 3.2/4.0, with a strong foundation in enterprise systems and modern software development.",
  },
  {
    icon: Layers,
    title: "SAP Technical Developer",
    description:
      "Specialized in SAP ABAP, RAP, CDS Views, OData, SAP Fiori and SAPUI5. Gained real-world experience through On-the-Job Training at FPT Software (Jan–May 2025).",
  },
  {
    icon: Code2,
    title: "Frontend Developer",
    description:
      "Sole frontend developer on the Hengout iOS app — from Figma design to App Store launch. Builds responsive interfaces with React, Next.js, and React Native.",
  },
  {
    icon: Rocket,
    title: "AI-Augmented Developer",
    description:
      "Leverages AI-assisted tools (Claude Code, Cursor, OpenAI Codex) to accelerate planning, coding, and problem-solving — staying at the edge of modern development workflows.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(109,40,217,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-6xl">
        <SectionTitle
          title="About Me"
          subtitle="SAP Technical Developer & Frontend Engineer"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {aboutItems.map((item, i) => (
            <GlassCard key={item.title} delay={i * 0.1} glow={false}>
              <div className="flex items-start gap-4">
                {/* Icon badge */}
                <div
                  style={{
                    flexShrink:   0,
                    width:        48,
                    height:       48,
                    borderRadius: 14,
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    background:   "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.12) 100%)",
                    border:       "1px solid rgba(139,92,246,0.30)",
                    boxShadow:    "0 0 16px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
                  }}
                >
                  <item.icon size={20} color="#a78bfa" />
                </div>

                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-purple-200/60">
                    {item.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
