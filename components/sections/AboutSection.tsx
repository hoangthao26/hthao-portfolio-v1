"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { GraduationCap, Code2, Layers, Rocket } from "lucide-react";

const aboutItems = [
  {
    icon: GraduationCap,
    title: "IT Graduate",
    description:
      "Recent Information Technology graduate with a strong foundation in software engineering and problem-solving.",
  },
  {
    icon: Layers,
    title: "SAP Specialist",
    description:
      "Specialized in SAP ABAP development, including RAP, CDS Views, UI5, and Fiori applications.",
  },
  {
    icon: Code2,
    title: "Frontend Developer",
    description:
      "Experienced in building frontend applications with modern JavaScript frameworks like React, Next.js, and React Native.",
  },
  {
    icon: Rocket,
    title: "Continuous Learner",
    description:
      "Passionate about learning new technologies and building real-world applications that solve meaningful problems.",
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
          subtitle="A brief introduction about who I am and what I do"
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
