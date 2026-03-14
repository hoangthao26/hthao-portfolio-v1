"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import ResumeSection from "@/components/sections/ResumeSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/ui/Footer";

/* CosmicBackground is entirely browser-side (Three.js + Canvas APIs) */
const CosmicBackground = dynamic(
  () => import("@/components/three/CosmicBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <CosmicBackground />
      <Navbar />
      <main className="relative z-10 overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificatesSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
