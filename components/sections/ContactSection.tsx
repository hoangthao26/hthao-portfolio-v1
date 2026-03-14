"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { Send, Mail } from "lucide-react";

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

const socials = [
  { icon: GithubIcon,  label: "GitHub",   href: "https://github.com/hoangthao26",            display: "github.com/hoangthao26" },
  { icon: LinkedinIcon, label: "LinkedIn",  href: "https://linkedin.com/in/hoangthao2602",     display: "linkedin.com/in/hoangthao2602" },
  { icon: Mail,        label: "Email",     href: "mailto:hoangthao2222@gmail.com",            display: "hoangthao2222@gmail.com" },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailtoLink = `mailto:hoangthao2222@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.open(mailtoLink);
  }

  const inputBase: React.CSSProperties = {
    width:                "100%",
    borderRadius:         12,
    border:               "1px solid rgba(139,92,246,0.20)",
    background:           "rgba(139,92,246,0.05)",
    backdropFilter:       "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding:              "11px 16px",
    fontSize:             14,
    color:                "#fff",
    outline:              "none",
    transition:           "all 0.25s ease",
    boxSizing:            "border-box",
    fontFamily:           "inherit",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor  = "rgba(139,92,246,0.50)";
    e.currentTarget.style.background   = "rgba(139,92,246,0.09)";
    e.currentTarget.style.boxShadow    = "0 0 16px rgba(139,92,246,0.16), inset 0 1px 0 rgba(255,255,255,0.06)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(139,92,246,0.20)";
    e.currentTarget.style.background  = "rgba(139,92,246,0.05)";
    e.currentTarget.style.boxShadow   = "none";
  };

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

      <div className="relative z-10 w-full mx-auto max-w-4xl">
        <SectionTitle
          title="Get In Touch"
          subtitle="Have a question or want to work together? Feel free to reach out!"
        />

        <div className="grid gap-6 md:grid-cols-5 md:gap-8">
          {/* Contact Form */}
          <GlassCard tilt={false} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: "name",    label: "Name",    type: "text",  placeholder: "Your name" },
                { id: "email",   label: "Email",   type: "email", placeholder: "your@email.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 500, color: "rgba(196,181,253,0.70)" }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    style={inputBase}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 500, color: "rgba(196,181,253,0.70)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  style={{ ...inputBase, resize: "none" }}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                <Send size={15} />
                Send Message
              </Button>
            </form>
          </GlassCard>

          {/* Social Links */}
          <div className="flex flex-col justify-center gap-4 md:col-span-2">
            {socials.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, y: -3 }}
                style={{
                  display:              "flex",
                  alignItems:           "center",
                  gap:                  14,
                  padding:              "14px 16px",
                  borderRadius:         16,
                  textDecoration:       "none",
                  background:           "linear-gradient(150deg, rgba(15,6,40,0.82) 0%, rgba(6,2,20,0.90) 100%)",
                  backdropFilter:       "blur(24px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.6)",
                  border:               "1px solid rgba(139,92,246,0.22)",
                  boxShadow:            "inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.35)",
                  transition:           "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(139,92,246,0.45)";
                  el.style.boxShadow   = "0 0 28px rgba(139,92,246,0.22), inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.45)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(139,92,246,0.22)";
                  el.style.boxShadow   = "inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.35)";
                }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    flexShrink:     0,
                    width:          40,
                    height:         40,
                    borderRadius:   12,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    background:     "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.12) 100%)",
                    border:         "1px solid rgba(139,92,246,0.30)",
                    boxShadow:      "0 0 12px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <social.icon size={18} color="#a78bfa" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
                    {social.label}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(167,139,250,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {social.display}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
