"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",         href: "#hero",         id: "hero" },
  { label: "About",        href: "#about",        id: "about" },
  { label: "Skills",       href: "#skills",       id: "skills" },
  { label: "Projects",     href: "#projects",     id: "projects" },
  { label: "Certificates", href: "#certificates", id: "certificates" },
  { label: "Resume",       href: "#resume",       id: "resume" },
  { label: "Contact",      href: "#contact",      id: "contact" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const trigger = window.scrollY + window.innerHeight * 0.28;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= trigger) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [shimmerPos,    setShimmerPos]    = useState({ x: 50, y: 50 });

  const headerRef = useRef<HTMLElement>(null);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));

  /* Scroll → glass intensity + progress */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Body scroll-lock when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Mouse-tracking shimmer */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      if (e.clientY > rect.bottom + 60) return;
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width)  * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top)  / rect.height) * 100));
      setShimmerPos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ── Derived glass values ── */
  const blurPx  = scrolled ? 52 : 28;
  const bgAlpha = scrolled ? 0.80 : 0.50;
  const glowOp  = scrolled ? 0.55 : 0.30;

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HEADER — plain element, no Framer transforms → safe on mobile
          ════════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          right:      0,
          zIndex:     50,
          width:      "100%",
          maxWidth:   "100vw",
          overflow:   "hidden",
          boxSizing:  "border-box",
          padding:    "10px 14px",
        }}
      >
        {/* ── Outer glow halo (behind the pill) ── */}
        <div
          style={{
            position:     "absolute",
            top:          "50%",
            left:         "50%",
            transform:    "translate(-50%, -50%)",
            width:        "70%",
            height:       "100%",
            background:   `radial-gradient(ellipse, rgba(139,92,246,${glowOp * 0.35}) 0%, transparent 70%)`,
            filter:       "blur(20px)",
            pointerEvents:"none",
            transition:   "opacity 0.5s ease",
            zIndex:       0,
          }}
        />

        {/* ── Gradient-border wrapper (creates the 1px gradient edge) ── */}
        <div
          style={{
            position:       "relative",
            maxWidth:       "1152px",
            width:          "100%",
            margin:         "0 auto",
            borderRadius:   "20px",
            /* 1-px gradient border via padding trick */
            background:     `linear-gradient(
              135deg,
              rgba(167,139,250,${scrolled ? 0.50 : 0.35}) 0%,
              rgba(139,92,246, ${scrolled ? 0.25 : 0.18}) 40%,
              rgba(109,40,217, ${scrolled ? 0.20 : 0.12}) 65%,
              rgba(167,139,250,${scrolled ? 0.45 : 0.30}) 100%
            )`,
            padding:        "1px",
            boxSizing:      "border-box",
            /* Floating depth shadow */
            boxShadow:      scrolled
              ? "0 16px 56px rgba(0,0,0,0.60), 0 4px 16px rgba(139,92,246,0.18), 0 0 0 0 transparent"
              : "0 8px 32px rgba(0,0,0,0.38), 0 2px 8px rgba(139,92,246,0.10)",
            transition:     "box-shadow 0.5s ease, background 0.5s ease",
            zIndex:         1,
          }}
        >
          {/* ── Glass surface ── */}
          <div
            style={{
              position:           "relative",
              borderRadius:       "19px",
              overflow:           "hidden",
              background:         `rgba(6, 3, 20, ${bgAlpha})`,
              backdropFilter:     `blur(${blurPx}px) saturate(180%) brightness(1.05)`,
              WebkitBackdropFilter:`blur(${blurPx}px) saturate(180%) brightness(1.05)`,
              transition:         "background 0.5s ease, backdrop-filter 0.5s ease",
            }}
          >
            {/* Top edge highlight — light reflection */}
            <div
              style={{
                position:   "absolute",
                top:        0,
                left:       "8%",
                right:      "8%",
                height:     "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 25%, rgba(167,139,250,0.45) 50%, rgba(255,255,255,0.18) 75%, transparent)",
                pointerEvents:"none",
                zIndex:     3,
              }}
            />

            {/* Bottom edge micro-glow */}
            <div
              style={{
                position:   "absolute",
                bottom:     0,
                left:       "20%",
                right:      "20%",
                height:     "1px",
                background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)",
                pointerEvents:"none",
                zIndex:     3,
              }}
            />

            {/* Mouse-tracking radial shimmer */}
            <div
              style={{
                position:   "absolute",
                inset:      0,
                background: `radial-gradient(ellipse 55% 120% at ${shimmerPos.x}% ${shimmerPos.y}%, rgba(167,139,250,0.09) 0%, rgba(139,92,246,0.04) 40%, transparent 65%)`,
                pointerEvents:"none",
                transition: "background 0.12s ease",
                zIndex:     2,
              }}
            />

            {/* Ambient inner light — diagonal band that drifts */}
            <div
              style={{
                position:        "absolute",
                top:             0,
                left:            0,
                width:           "35%",
                height:          "100%",
                background:      "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), rgba(167,139,250,0.04), transparent)",
                animation:       "liquid-shimmer 9s ease-in-out infinite",
                animationDelay:  "3s",
                pointerEvents:   "none",
                zIndex:          2,
              }}
            />

            {/* Second shimmer pass — offset */}
            <div
              style={{
                position:        "absolute",
                top:             0,
                left:            0,
                width:           "25%",
                height:          "100%",
                background:      "linear-gradient(90deg, transparent, rgba(167,139,250,0.03), transparent)",
                animation:       "liquid-shimmer 12s ease-in-out infinite",
                animationDelay:  "7s",
                pointerEvents:   "none",
                zIndex:          2,
              }}
            />

            {/* ── Content row ── */}
            <div
              style={{
                position:       "relative",
                zIndex:         10,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "8px 12px",
                boxSizing:      "border-box",
                minWidth:       0,
              }}
            >
              {/* Logo */}
              <a
                href="#hero"
                style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}
              >
                {/* Logo mark — glass badge */}
                <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
                  {/* Glow halo */}
                  <div
                    style={{
                      position:   "absolute",
                      inset:      -3,
                      borderRadius: 12,
                      background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)",
                      filter:     "blur(6px)",
                    }}
                  />
                  {/* Badge face */}
                  <div
                    style={{
                      position:        "relative",
                      width:           36,
                      height:          36,
                      borderRadius:    11,
                      background:      "linear-gradient(145deg, rgba(139,92,246,0.38) 0%, rgba(79,28,173,0.20) 100%)",
                      border:          "1px solid rgba(167,139,250,0.45)",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      boxShadow:       "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 14px rgba(139,92,246,0.35)",
                      backdropFilter:  "blur(8px)",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#d4b8ff", letterSpacing: "-0.02em" }}>HT</span>
                  </div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.92)", whiteSpace: "nowrap", letterSpacing: "-0.015em" }}>
                  Hoang{" "}
                  <span style={{ color: "#a78bfa" }}>Thao</span>
                </span>
              </a>

              {/* ── Desktop nav ── */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="group relative"
                    style={{ padding: "7px 14px", textDecoration: "none", display: "block" }}
                  >
                    {/* Active glass pill */}
                    {active === link.id && (
                      <motion.div
                        layoutId="liquid-nav-pill"
                        style={{
                          position:   "absolute",
                          inset:      0,
                          borderRadius: 10,
                          background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.12) 100%)",
                          border:     "1px solid rgba(167,139,250,0.28)",
                          boxShadow:  "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 12px rgba(139,92,246,0.18)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}

                    {/* Hover glass pill */}
                    <span
                      className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background: "rgba(139,92,246,0.08)",
                        border:     "1px solid rgba(167,139,250,0.12)",
                      }}
                    />

                    {/* Label */}
                    <span
                      className={`relative z-10 text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                        active === link.id
                          ? "text-white"
                          : "text-purple-200/55 group-hover:text-white"
                      }`}
                    >
                      {link.label}
                    </span>

                    {/* Glowing underline */}
                    <span
                      className={`absolute bottom-[5px] left-[14px] right-[14px] h-px rounded-full transition-all duration-300 group-hover:opacity-100 ${
                        active === link.id ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)",
                        boxShadow:  "0 0 6px rgba(167,139,250,0.7)",
                      }}
                    />

                    {/* Active dot */}
                    {active === link.id && (
                      <motion.span
                        layoutId="nav-dot"
                        style={{
                          position:    "absolute",
                          bottom:      -1,
                          left:        "50%",
                          transform:   "translateX(-50%)",
                          width:       4,
                          height:      4,
                          borderRadius: "50%",
                          background:  "#a78bfa",
                          boxShadow:   "0 0 8px 2px rgba(167,139,250,0.75)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                ))}
              </nav>

              {/* ── Right side ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* Download CV — liquid glass button */}
                <a
                  href="/cv.pdf"
                  download
                  className="hidden lg:flex items-center gap-1.5 group"
                  style={{
                    position:       "relative",
                    borderRadius:   13,
                    padding:        "8px 18px",
                    textDecoration: "none",
                    background:     "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.16) 100%)",
                    border:         "1px solid rgba(167,139,250,0.32)",
                    color:          "#c4b5fd",
                    fontSize:       13,
                    fontWeight:     600,
                    letterSpacing:  "-0.01em",
                    boxShadow:      "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 14px rgba(139,92,246,0.22)",
                    transition:     "all 0.25s ease",
                    overflow:       "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = "linear-gradient(135deg, rgba(139,92,246,0.45) 0%, rgba(109,40,217,0.28) 100%)";
                    el.style.borderColor = "rgba(167,139,250,0.55)";
                    el.style.color       = "#fff";
                    el.style.boxShadow   = "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 22px rgba(139,92,246,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.16) 100%)";
                    el.style.borderColor = "rgba(167,139,250,0.32)";
                    el.style.color       = "#c4b5fd";
                    el.style.boxShadow   = "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 14px rgba(139,92,246,0.22)";
                  }}
                >
                  {/* Button shimmer on hover */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)",
                    }}
                  />
                  <Download size={13} />
                  Download CV
                </a>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Toggle menu"
                  className="lg:hidden flex items-center justify-center"
                  style={{
                    width:       38,
                    height:      38,
                    borderRadius: 11,
                    border:      "1px solid rgba(167,139,250,0.28)",
                    background:  "rgba(139,92,246,0.14)",
                    color:       "#c4b5fd",
                    cursor:      "pointer",
                    boxShadow:   "inset 0 1px 0 rgba(255,255,255,0.10)",
                    transition:  "all 0.2s ease",
                    flexShrink:  0,
                  }}
                >
                  {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                </button>
              </div>
            </div>
          </div>{/* /glass surface */}
        </div>{/* /gradient-border wrapper */}
      </header>

      {/* ════════════════════════════════════════════════════════
          MOBILE DRAWER
          ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position:       "fixed",
                inset:          0,
                zIndex:         40,
                background:     "rgba(2,0,14,0.55)",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              style={{
                position:            "fixed",
                top:                 0,
                right:               0,
                bottom:              0,
                zIndex:              50,
                width:               "min(300px, 88vw)",
                display:             "flex",
                flexDirection:       "column",
                background:          "rgba(6, 3, 20, 0.94)",
                backdropFilter:      "blur(48px) saturate(180%)",
                WebkitBackdropFilter:"blur(48px) saturate(180%)",
                borderLeft:          "1px solid rgba(167,139,250,0.22)",
                boxShadow:           "-12px 0 60px rgba(0,0,0,0.7), -4px 0 20px rgba(139,92,246,0.12), inset 1px 0 0 rgba(167,139,250,0.08)",
                boxSizing:           "border-box",
                overflowX:           "hidden",
              }}
            >
              {/* Top light reflection */}
              <div
                style={{
                  position:   "absolute",
                  top:        0,
                  left:       0,
                  right:      0,
                  height:     1,
                  background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
                  pointerEvents:"none",
                }}
              />

              {/* Drawer header */}
              <div
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "space-between",
                  padding:         "20px 20px",
                  borderBottom:    "1px solid rgba(139,92,246,0.10)",
                  flexShrink:      0,
                }}
              >
                <span
                  style={{
                    fontSize:       11,
                    fontWeight:     600,
                    color:          "rgba(167,139,250,0.45)",
                    letterSpacing:  "0.15em",
                    textTransform:  "uppercase",
                  }}
                >
                  Navigation
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    width:          32,
                    height:         32,
                    borderRadius:   8,
                    border:         "1px solid rgba(167,139,250,0.22)",
                    background:     "rgba(139,92,246,0.12)",
                    color:          "#a78bfa",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    cursor:         "pointer",
                    boxShadow:      "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Links */}
              <nav style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      padding:        "13px 16px",
                      borderRadius:   12,
                      marginBottom:   4,
                      fontSize:       15,
                      fontWeight:     500,
                      textDecoration: "none",
                      transition:     "background 0.15s, color 0.15s",
                      background:     active === link.id ? "rgba(139,92,246,0.18)" : "transparent",
                      border:         `1px solid ${active === link.id ? "rgba(167,139,250,0.22)" : "transparent"}`,
                      color:          active === link.id ? "#fff" : "rgba(196,168,255,0.65)",
                      boxShadow:      active === link.id ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    {link.label}
                    {active === link.id && (
                      <span
                        style={{
                          width:        6,
                          height:       6,
                          borderRadius: "50%",
                          background:   "#a78bfa",
                          boxShadow:    "0 0 10px rgba(167,139,250,0.9)",
                          flexShrink:   0,
                        }}
                      />
                    )}
                  </motion.a>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div style={{ padding: "16px", borderTop: "1px solid rgba(139,92,246,0.10)", flexShrink: 0 }}>
                <a
                  href="/cv.pdf"
                  download
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            8,
                    padding:        "14px",
                    borderRadius:   13,
                    border:         "1px solid rgba(167,139,250,0.32)",
                    background:     "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.15) 100%)",
                    color:          "#c4b5fd",
                    fontSize:       14,
                    fontWeight:     600,
                    textDecoration: "none",
                    width:          "100%",
                    boxSizing:      "border-box",
                    boxShadow:      "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 14px rgba(139,92,246,0.18)",
                  }}
                >
                  <Download size={15} />
                  Download CV
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
