"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import { Mail } from "lucide-react";

/* ── Icons ─────────────────────────────────────────────────────── */
function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5.03 3.66 9.2 8.44 9.93v-7.02H7.9v-2.91h2.54V9.86c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.73 8.44-4.9 8.44-9.93z" />
    </svg>
  );
}

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-4.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function PhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

const socials = [
  { icon: GithubIcon,   label: "GitHub",   href: "https://github.com/hoangthao26",               display: "hoangthao26" },
  { icon: LinkedinIcon, label: "LinkedIn",  href: "https://linkedin.com/in/hoangthao2602",        display: "hoangthao2602" },
  { icon: FacebookIcon, label: "Facebook",  href: "https://www.facebook.com/thaohoang2602",       display: "thaohoang2602" },
  { icon: DiscordIcon,  label: "Discord",   href: "https://discord.com/users/389831697316839427", display: "389831697316839427" },
  { icon: Mail,         label: "Email",     href: "mailto:hoangthao2222@gmail.com",               display: "hoangthao2222@gmail.com" },
  { icon: PhoneIcon,    label: "Phone",     href: "tel:0908475945",                               display: "0908 475 945" },
];

/* ── Social Card ────────────────────────────────────────────────── */
function SocialCard({ social, index }: { social: (typeof socials)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        animate={{ y: hovered ? -3 : 0 }}
        transition={{ duration: 0.25 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "10px 4px",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {/* Circular icon with glow */}
        <motion.div
          animate={{
            boxShadow: hovered
              ? "0 0 24px 10px rgba(139,92,246,0.52)"
              : "0 0 10px 3px rgba(139,92,246,0.22)",
            background: hovered
              ? "linear-gradient(135deg, rgba(139,92,246,0.48) 0%, rgba(109,40,217,0.32) 100%)"
              : "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(109,40,217,0.10) 100%)",
          }}
          transition={{ duration: 0.28 }}
          style={{
            flexShrink: 0,
            width: 46, height: 46,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(139,92,246,0.38)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.14) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />
          <social.icon size={19} color={hovered ? "#f3e8ff" : "#a78bfa"} />
        </motion.div>

        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <motion.p
            animate={{
              textShadow: hovered
                ? "0 0 22px rgba(139,92,246,0.75), 0 0 50px rgba(139,92,246,0.30)"
                : "0 0 16px rgba(139,92,246,0.45), 0 0 35px rgba(139,92,246,0.15)",
            }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 3,
              lineHeight: 1.2,
            }}
          >
            {social.label}
          </motion.p>
          <p style={{
            fontSize: 14,
            color: hovered ? "rgba(196,181,253,0.82)" : "rgba(167,139,250,0.55)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.25s",
          }}>
            {social.display}
          </p>
        </div>
      </motion.a>
    </motion.div>
  );
}

/* ── Contact Profile Card (left column) ─────────────────────────── */
function ContactProfileCard() {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springCfg = { stiffness: 180, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), springCfg);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), springCfg);
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
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.13) 0%, transparent 65%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.88 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900, flexShrink: 0 }}
      className="flex justify-center"
    >
      {/* Floating animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative" }}
      >
        {/* Holographic aura */}
        <div style={{ position: "absolute", inset: "-30% -20%", zIndex: 0, pointerEvents: "none" }}>
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.28, 0.48, 0.28] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: "50%", top: "50%",
              width: "420px", height: "420px",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle at 35% 35%, rgba(167,139,250,0.35) 0%, transparent 58%), radial-gradient(circle at 68% 60%, rgba(139,92,246,0.26) 0%, transparent 60%)",
              filter: "blur(18px)", mixBlendMode: "screen",
            }}
          />
        </div>

        {/* Outer glow halo */}
        <motion.div
          animate={{
            boxShadow: hovered
              ? "0 0 60px 18px rgba(139,92,246,0.44), 0 0 120px 44px rgba(109,40,217,0.20)"
              : "0 0 36px 10px rgba(139,92,246,0.26), 0 0 70px 22px rgba(109,40,217,0.10)",
          }}
          transition={{ duration: 0.45 }}
          style={{ borderRadius: 24, position: "relative", zIndex: 1 }}
        >
          {/* 3-D tilt card */}
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: 24 }}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.35 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gradient border shell */}
            <div
              style={{
                position: "relative", borderRadius: 24, padding: 2,
                background: "linear-gradient(135deg, rgba(139,92,246,0.58) 0%, rgba(109,40,217,0.26) 40%, rgba(255,255,255,0.10) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20), 0 24px 48px rgba(0,0,0,0.55)",
              }}
            >
              {/* Inner glass */}
              <div
                style={{
                  position: "relative", borderRadius: 22, overflow: "hidden",
                  background: "linear-gradient(145deg, rgba(20,10,52,0.80) 0%, rgba(8,4,28,0.92) 100%)",
                  backdropFilter: "blur(28px) saturate(1.7)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.7)",
                }}
              >
                {/* Mouse-tracked glare */}
                <motion.div
                  style={{
                    position: "absolute", inset: 0, zIndex: 10,
                    pointerEvents: "none", borderRadius: 22,
                    background: glareBackground, mixBlendMode: "screen",
                  }}
                />

                {/* Shimmer streak */}
                <div
                  style={{
                    position: "absolute", top: -28, left: -16,
                    width: 120, height: 80,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 70%)",
                    transform: "rotate(-22deg)", pointerEvents: "none", zIndex: 9,
                  }}
                />

                {/* Profile image */}
                <div
                  style={{
                    position: "relative",
                    width:  "clamp(240px, 32vw, 340px)",
                    height: "clamp(240px, 32vw, 340px)",
                  }}
                >
                  {imgError ? (
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(88,28,135,0.6), rgba(49,46,129,0.4), rgba(76,29,149,0.6))",
                      }}
                    >
                      <span style={{ fontSize: 52, fontWeight: 700, color: "rgba(196,181,253,0.45)", userSelect: "none" }}>
                        HT
                      </span>
                    </div>
                  ) : (
                    <Image
                      src="/profile-v2.png"
                      alt="Phan Đỗ Hoàng Thao"
                      fill
                      className="object-cover"
                      sizes="280px"
                      onError={() => setImgError(true)}
                    />
                  )}

                  {/* Bottom fade */}
                  <div
                    style={{
                      position: "absolute", inset: "auto 0 0 0", height: 70,
                      background: "linear-gradient(to top, rgba(4,2,16,0.85), transparent)",
                      pointerEvents: "none", zIndex: 5,
                    }}
                  />

                  {/* Inner rim glow */}
                  <motion.div
                    animate={{
                      boxShadow: hovered
                        ? "inset 0 0 28px 8px rgba(139,92,246,0.30)"
                        : "inset 0 0 16px 4px rgba(139,92,246,0.14)",
                    }}
                    transition={{ duration: 0.35 }}
                    style={{ position: "absolute", inset: 0, borderRadius: 4, pointerEvents: "none", zIndex: 6 }}
                  />
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main section ────────────────────────────────────────────────── */
export default function ContactSection() {
  return (
    <section id="contact" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.07, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "rgba(139,92,246,1)" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-5xl">
        <SectionTitle
          title="Get In Touch"
          subtitle="Let's connect — you can reach me on the platforms below."
        />

        {/* Profile left + social grid right */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">

          {/* Left — profile card, hidden on mobile */}
          <div className="hidden md:flex items-center self-stretch">
            <ContactProfileCard />
          </div>

          {/* Right — social links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full min-w-0">
            {socials.map((social, i) => (
              <SocialCard key={social.label} social={social} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
