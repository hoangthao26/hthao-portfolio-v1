"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-violet-600 text-white border border-purple-500/40 shadow-[0_0_18px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.20)]",
    outline:
      "border border-purple-500/35 text-purple-300 bg-purple-500/8 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-purple-400/60 hover:text-white hover:bg-purple-500/15 hover:shadow-[0_0_22px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]",
    ghost:
      "text-purple-300/80 hover:text-white hover:bg-purple-500/12 hover:shadow-[0_0_14px_rgba(139,92,246,0.18)]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.04, y: -1 },
    whileTap:   { scale: 0.96 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
