"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-purple-glow/10 py-8 text-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4">
        <div className="flex gap-4">
          <a
            href="https://github.com/hoangthao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400/50 transition-colors hover:text-purple-neon"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/hoangthao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400/50 transition-colors hover:text-purple-neon"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:hoangthao@email.com"
            className="text-purple-400/50 transition-colors hover:text-purple-neon"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
        <p className="text-xs text-purple-400/40">
          &copy; {new Date().getFullYear()} Hoang Thao. Built with Next.js &amp; Three.js
        </p>
      </div>
    </footer>
  );
}
