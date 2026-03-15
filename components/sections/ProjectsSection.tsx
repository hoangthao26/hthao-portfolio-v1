"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { ExternalLink, X } from "lucide-react";

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
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Custom Notification Center — SAP Fiori (Graduation)",
    description:
      "Graduation project (on-going, team member) — custom notification center in SAP Fiori. Designed CDS views & database tables, implemented RAP behaviors for Mark Read/Unread, configured SM36 background jobs for scheduled delivery, and deployed via Fiori Launchpad with AMC/APC near real-time updates.",
    image: "/projects/notification_center.png",
    tech: ["ABAP", "SAP RAP", "CDS Views", "OData", "SAPUI5", "SAP HANA", "AMC/APC"],
    featured: true,
  },
  {
    title: "Hengout — Location Recommendation iOS App",
    description:
      "Startup project — sole frontend developer. Built the entire mobile UI/UX from Figma to production using React Native, implemented In-App Purchase (IAP), offline-first chat architecture, and deployed to the Apple App Store. Awarded 50,000,000 VND Startup Potential Scholarship.",
    image: "/projects/hengout_app.png",
    tech: ["React Native", "Expo", "EAS", "Cloudinary", "Spring Boot", "Microservices"],
    github: "https://github.com/hoangthao26/hengout-app",
    demo: "https://apps.apple.com/vn/app/hengout/id6754825310",
    featured: true,
  },
  {
    title: "Hengout Admin Dashboard",
    description:
      "Frontend admin dashboard for Hengout — a startup project with a team scholarship from the university.",
    image: "/projects/hengout_admin.png",
    tech: ["Next.js", "TypeScript", "Admin Dashboard"],
    github: "https://github.com/hoangthao26/hengout-admin-web",
    demo: "https://hengout-admin-web.vercel.app",
    featured: false,
  },
  {
    title: "VNR202 History Learning Platform",
    description:
      "Interactive learning web app for the History of the Communist Party of Vietnam featuring an AI chatbot.",
    image: "/projects/vnr_202.png",
    tech: ["Next.js", "TypeScript", "AI Chatbot"],
    github: "https://github.com/hoangthao26/vnr202-group5",
    demo: "https://vnr202-group5.vercel.app",
  },
  {
    title: "MLN-131 Learning Platform",
    description:
      "Interactive learning web app for Marxism–Leninism with quizzes and an AI chatbot.",
    image: "/projects/mln_131.png",
    tech: ["Next.js", "TypeScript", "Quizzes"],
    github: "https://github.com/hoangthao26/mln-131",
    demo: "https://mln-131-group5-two.vercel.app",
  },
  {
    title: "Event Management Web App",
    description:
      "Team-built event management web app for creating events and registering participants.",
    image: "/projects/Event_Management.png",
    tech: ["Next.js", "TypeScript", "Team Project"],
    github: "https://github.com/hoangthao26/EventManagement-FE",
  },
  {
    title: "Koi Veterinary Service Center",
    description:
      "Team-built frontend web app for booking Koi fish veterinary services.",
    image: "/projects/Koi-veterinary-service-center.png",
    tech: ["React", "TypeScript", "Team Project"],
    github: "https://github.com/hoangthao26/koi-veterinary-service-center-FE",
  },
];

const featuredProjects = projects.filter((p) => p.featured);
const otherProjects    = projects.filter((p) => !p.featured);

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, background: "rgba(2,0,10,0.85)", backdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.84, y: 44 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto",
          borderRadius: 24, background: "rgba(8,3,22,0.95)",
          border: "1px solid rgba(139,92,246,0.28)", backdropFilter: "blur(36px)",
          boxShadow: "0 48px 120px rgba(109,40,217,0.45), 0 0 0 1px rgba(139,92,246,0.08) inset",
          position: "relative",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, zIndex: 10,
          width: 34, height: 34, borderRadius: "50%",
          background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#c4b5fd", cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.26)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.12)")}
        ><X size={15} /></button>

        <div style={{ position: "relative", height: 260, borderRadius: "24px 24px 0 0", overflow: "hidden" }}>
          {imgError ? (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(60,20,110,0.5),rgba(20,10,50,0.85))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 64, opacity: 0.12 }}>◈</span>
            </div>
          ) : (
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="680px" onError={() => setImgError(true)} />
          )}
          <div style={{ position: "absolute", inset: "auto 0 0 0", height: 110, background: "linear-gradient(to top,rgba(8,3,22,0.97),transparent)", pointerEvents: "none" }} />
        </div>

        <div style={{ padding: "22px 28px 28px" }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
            {project.title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
            style={{ fontSize: 13.5, color: "rgba(196,181,253,0.66)", lineHeight: 1.75, marginBottom: 18 }}>
            {project.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
            {project.tech.map((t) => (
              <span key={t} style={{ padding: "3px 11px", borderRadius: 999, fontSize: 11, fontWeight: 500, color: "rgba(196,181,253,0.9)", background: "rgba(139,92,246,0.11)", border: "1px solid rgba(139,92,246,0.24)" }}>{t}</span>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {project.github && <Button href={project.github} variant="outline"><GithubIcon size={13} />GitHub</Button>}
            {project.demo   && <Button href={project.demo}   variant="primary"><ExternalLink size={13} />Live Demo</Button>}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Featured Card (vertical, tall) ──────────────────────────────────────────
function FeaturedCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 240, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 240, damping: 30 });
  const glareX  = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY  = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glare   = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.11) 0%, transparent 62%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ minWidth: 0, perspective: 1100, position: "relative", cursor: "pointer" }}
    >
      {/* Glow halo */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: -10, borderRadius: 26,
          background: "radial-gradient(ellipse at 50% 60%, rgba(109,40,217,0.50) 0%, transparent 70%)",
          filter: "blur(22px)", zIndex: 0, pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", position: "relative", zIndex: 1 }}
      >
        {/* Card shell */}
        <div style={{
          borderRadius: 20, overflow: "hidden",
          height: 420,
          display: "flex", flexDirection: "column",
          background: "rgba(8,3,20,0.85)",
          border: hovered ? "1px solid rgba(139,92,246,0.58)" : "1px solid rgba(139,92,246,0.16)",
          backdropFilter: "blur(28px)",
          boxShadow: hovered
            ? "0 32px 80px rgba(109,40,217,0.42), 0 0 0 1px rgba(139,92,246,0.14) inset"
            : "0 12px 44px rgba(0,0,0,0.55)",
          transition: "border 0.38s, box-shadow 0.38s",
          position: "relative",
        }}>
          {/* Glare */}
          <motion.div style={{
            position: "absolute", inset: 0, borderRadius: 20,
            background: glare, zIndex: 4, pointerEvents: "none", mixBlendMode: "screen",
          }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.28 }}
          />
          {/* Top edge */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
            zIndex: 5, pointerEvents: "none",
          }} />

          {/* Image — top 55% */}
          <div style={{ position: "relative", height: 232, flexShrink: 0, overflow: "hidden" }}>
            {imgError ? (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(60,20,110,0.55),rgba(15,8,40,0.88))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 56, opacity: 0.13 }}>◈</span>
              </div>
            ) : (
              <Image src={project.image} alt={project.title} fill className="object-cover"
                style={{ transition: "transform 0.6s ease", transform: hovered ? "scale(1.08)" : "scale(1.02)" }}
                sizes="33vw" onError={() => setImgError(true)} />
            )}
            <div style={{ position: "absolute", inset: "auto 0 0 0", height: 80, background: "linear-gradient(to top,rgba(8,3,20,0.95),transparent)", zIndex: 2, pointerEvents: "none" }} />

            {/* Featured badge */}
            <div style={{
              position: "absolute", top: 13, left: 13, zIndex: 3,
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(109,40,217,0.55)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(139,92,246,0.38)",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.10em",
              textTransform: "uppercase", color: "#e9d5ff",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 6px rgba(167,139,250,0.9)", display: "inline-block" }} />
              Featured
            </div>
          </div>

          {/* Content — bottom area */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            padding: "18px 20px 20px", position: "relative", zIndex: 3, overflow: "hidden",
          }}>
            <h3 style={{
              fontWeight: 700, fontSize: 15, color: "#fff",
              lineHeight: 1.35, marginBottom: 8,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {project.title}
            </h3>
            <p style={{
              fontSize: 12, color: "rgba(196,181,253,0.55)", lineHeight: 1.68,
              marginBottom: 14, flex: 1,
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {project.description}
            </p>

            {/* Tech + action row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", gap: 5, overflow: "hidden" }}>
                {project.tech.slice(0, 3).map((t) => (
                  <span key={t} style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", color: "rgba(196,181,253,0.90)", background: "rgba(139,92,246,0.13)", border: "1px solid rgba(139,92,246,0.24)" }}>{t}</span>
                ))}
                {project.tech.length > 3 && (
                  <span style={{ padding: "2px 7px", borderRadius: 999, fontSize: 10, fontWeight: 500, color: "rgba(139,92,246,0.60)", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.13)" }}>+{project.tech.length - 3}</span>
                )}
              </div>
              <motion.div
                animate={{ opacity: hovered ? 1 : 0.35, x: hovered ? 0 : 4 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 10.5, fontWeight: 500, color: "rgba(167,139,250,0.85)" }}
              >
                <ExternalLink size={10} /><span>Explore</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Other Project Card (marquee, vertical, tall) ─────────────────────────────
function OtherCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 260, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 260, damping: 30 });
  const glareX  = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY  = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glare   = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.10) 0%, transparent 60%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      animate={{ y: hovered ? -8 : 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{ width: 300, perspective: 1000, position: "relative", cursor: "pointer" }}
    >
      {/* Glow halo */}
      <motion.div
        animate={{ opacity: hovered ? 0.9 : 0 }}
        transition={{ duration: 0.32 }}
        style={{
          position: "absolute", inset: -5, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(139,92,246,0.40), rgba(109,40,217,0.20))",
          filter: "blur(14px)", zIndex: -1, pointerEvents: "none",
        }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div style={{
          width: 300, height: 370,
          borderRadius: 16, overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "rgba(10,4,26,0.82)",
          border: hovered ? "1px solid rgba(139,92,246,0.50)" : "1px solid rgba(139,92,246,0.12)",
          backdropFilter: "blur(24px)",
          boxShadow: hovered
            ? "0 22px 56px rgba(109,40,217,0.32), 0 0 0 1px rgba(139,92,246,0.10) inset"
            : "0 8px 28px rgba(0,0,0,0.50)",
          transition: "border 0.32s, box-shadow 0.32s",
          position: "relative",
        }}>
          {/* Glare */}
          <motion.div style={{
            position: "absolute", inset: 0, borderRadius: 16,
            background: glare, zIndex: 4, pointerEvents: "none", mixBlendMode: "screen",
          }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.26 }}
          />
          {/* Top edge */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
            zIndex: 5, pointerEvents: "none",
          }} />

          {/* Image */}
          <div style={{ position: "relative", height: 180, flexShrink: 0, overflow: "hidden" }}>
            {imgError ? (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(60,20,110,0.45),rgba(15,8,40,0.82))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 44, opacity: 0.14 }}>◈</span>
              </div>
            ) : (
              <Image src={project.image} alt={project.title} fill className="object-cover"
                style={{ transition: "transform 0.55s ease", transform: hovered ? "scale(1.08)" : "scale(1.02)" }}
                sizes="300px" onError={() => setImgError(true)} />
            )}
            <div style={{ position: "absolute", inset: "auto 0 0 0", height: 64, background: "linear-gradient(to top,rgba(10,4,26,0.95),transparent)", zIndex: 2, pointerEvents: "none" }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 18px 18px", position: "relative", zIndex: 3, overflow: "hidden" }}>
            <h3 style={{
              fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.35, marginBottom: 7,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {project.title}
            </h3>
            <p style={{
              fontSize: 12, color: "rgba(196,181,253,0.52)", lineHeight: 1.65, flex: 1,
              marginBottom: 12,
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {project.description}
            </p>

            {/* Tech + links */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <div style={{ display: "flex", gap: 5, overflow: "hidden" }}>
                {project.tech.slice(0, 2).map((t) => (
                  <span key={t} style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", color: "rgba(196,181,253,0.86)", background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.20)" }}>{t}</span>
                ))}
                {project.tech.length > 2 && (
                  <span style={{ padding: "2px 6px", borderRadius: 999, fontSize: 10, color: "rgba(139,92,246,0.58)", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.13)" }}>+{project.tech.length - 2}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "rgba(167,139,250,0.50)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(167,139,250,0.50)")}
                  ><GithubIcon size={13} /></a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "rgba(167,139,250,0.50)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(167,139,250,0.50)")}
                  ><ExternalLink size={12} /></a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [modal,  setModal]  = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);

  const doubled = [...otherProjects, ...otherProjects];

  return (
    <section id="projects" className="relative section-padding overflow-hidden">
      <style>{`
        @keyframes prj-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.10, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/4 h-[560px] w-[560px] rounded-full blur-[130px]"
          style={{ background: "rgba(109,40,217,1)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute left-1/4 bottom-1/3 h-[380px] w-[380px] rounded-full blur-[110px]"
          style={{ background: "rgba(88,28,135,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-6xl">
        <SectionTitle title="Projects" subtitle="Some of the projects I have built" />

        {/* ── Featured: 3 cards side by side ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(139,92,246,0.75)" }}>
              Featured
            </span>
            <div style={{ height: 1, width: 28, background: "linear-gradient(to right, rgba(139,92,246,0.45), transparent)" }} />
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {featuredProjects.map((p, i) => (
              <div key={p.title} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                <FeaturedCard project={p} index={i} onClick={() => setModal(p)} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Other Projects: infinite marquee ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginTop: 56 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, position: "relative", zIndex: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(139,92,246,0.55)" }}>
              Other Projects
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(139,92,246,0.22), transparent)" }} />
          </div>

          {/* Side fades */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10"
              style={{ width: 72, background: "linear-gradient(to right, rgba(2,0,8,1), transparent)" }} />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10"
              style={{ width: 72, background: "linear-gradient(to left, rgba(2,0,8,1), transparent)" }} />

            <div
              style={{ overflow: "hidden", marginBlock: -36, paddingBlock: 36 }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div style={{
                display: "flex", gap: 20, width: "max-content",
                paddingBlock: 36,
                animation: "prj-marquee 45s linear infinite",
                animationPlayState: paused ? "paused" : "running",
              }}>
                {doubled.map((p, i) => (
                  <OtherCard key={`${p.title}-${i}`} project={p} onClick={() => setModal(p)} />
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(139,92,246,0.35)", marginTop: 4, letterSpacing: "0.05em" }}>
            Hover to pause · Click to explore
          </p>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
}
