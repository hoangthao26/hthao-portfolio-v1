"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface Project {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description:
      "A modern futuristic 3D portfolio built with Next.js, React Three Fiber, and Framer Motion featuring cosmic theme and glassmorphism design.",
    image: "/projects/portfolio.png",
    tech: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS"],
    github: "https://github.com/hoangthao26",
    demo: "#",
  },
  {
    title: "HengOut Mobile App",
    description:
      "A social mobile application built with React Native and Expo for connecting people, featuring real-time chat and location-based features.",
    image: "/projects/hengout.png",
    tech: ["React Native", "Expo", "TypeScript", "Zustand"],
    github: "https://github.com/hoangthao26",
  },
  {
    title: "SAP Fiori Application",
    description:
      "Enterprise SAP Fiori application developed using SAP RAP, CDS Views, and ABAP for business process automation.",
    image: "/projects/sap-fiori.png",
    tech: ["SAP ABAP", "SAP RAP", "CDS Views", "SAP UI5"],
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <GlassCard delay={index * 0.15} glow noPadding>
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
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
            <span style={{ fontSize: 32, opacity: 0.25, userSelect: "none" }}>◈</span>
          </div>
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
        {/* Fade to glass bottom */}
        <div
          style={{
            position:   "absolute",
            inset:      "auto 0 0 0",
            height:     80,
            background: "linear-gradient(to top, rgba(8,3,22,0.95), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 pt-4">
        <h3 className="mb-2 text-base font-bold text-white">{project.title}</h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-purple-200/60">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                display:      "inline-block",
                padding:      "3px 10px",
                borderRadius: 999,
                fontSize:     11,
                fontWeight:   500,
                color:        "rgba(196,181,253,0.85)",
                background:   "rgba(139,92,246,0.10)",
                border:       "1px solid rgba(139,92,246,0.20)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {project.github && (
            <Button href={project.github} variant="outline" className="py-2 px-4 text-xs">
              <GithubIcon size={13} />
              GitHub
            </Button>
          )}
          {project.demo && (
            <Button href={project.demo} variant="ghost" className="py-2 px-4 text-xs">
              <ExternalLink size={13} />
              Live Demo
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.07, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full blur-[140px]"
          style={{ background: "rgba(109,40,217,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-6xl">
        <SectionTitle
          title="Projects"
          subtitle="Some of the projects I have built"
        />

        <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
