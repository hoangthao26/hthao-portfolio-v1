# Hoang Thao — Developer Portfolio

A modern futuristic 3D developer portfolio built with Next.js, React Three Fiber, and Framer Motion. Features a cinematic cosmic space theme with glassmorphism UI, a 6-layer animated background, and interactive 3D particles reacting to mouse movement.

## Features

- **6-layer cosmic background** — nebula blobs, 1 800 twinkling stars (canvas), 3D particle galaxy (Three.js), mouse parallax depth
- **Glassmorphism UI** — glass cards with real-time 3D tilt on hover
- **Smooth animations** — Framer Motion scroll-triggered reveals, floating effects, gradient borders
- **Fully responsive** — mobile-first layout, glass mobile menu
- **Sections** — Hero · About · Skills · Projects · Certificates · Resume · Contact

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| 3D / WebGL | React Three Fiber + Three.js + @react-three/drei |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |
| Package manager | pnpm |
| Deployment | Vercel |

## Getting Started

**Prerequisites:** Node.js 18+ and pnpm (`npm i -g pnpm`)

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # ESLint (flat config)
```

## Deploy to Vercel

Push to GitHub then import at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected, no config needed. Or:

```bash
pnpm dlx vercel --prod
```

## Customization

### Content

| What | File | Where |
|---|---|---|
| Name / title / intro | `HeroSection.tsx` | inline text |
| About cards | `AboutSection.tsx` | `aboutItems` array |
| Skills | `SkillsSection.tsx` | `skillGroups` array |
| Projects | `ProjectsSection.tsx` | `projects` array |
| Certificates | `CertificatesSection.tsx` | `certificates` array |
| Timeline | `ResumeSection.tsx` | `timeline` array |
| Social links / email | `HeroSection`, `ContactSection`, `Footer` | `href` props |

### Static Assets

```
public/
├── profile.jpg          ← Hero profile photo (recommended 400×400 px)
├── cv.pdf               ← Downloadable CV
├── projects/
│   ├── portfolio.png    ← One image per project card
│   ├── hengout.png
│   └── sap-fiori.png
└── certificates/
    ├── sap-cert.png
    ├── react-cert.png
    └── freecodecamp-cert.png
```

### Colors

Edit CSS custom properties in `app/globals.css` `:root`:

```css
--background:   #020008;   /* deep space black    */
--purple-glow:  #8b5cf6;   /* primary accent      */
--purple-deep:  #6d28d9;   /* secondary accent    */
--purple-neon:  #a78bfa;   /* neon highlight      */
```

## Background Layer Stack

| Layer | File | Technique | Parallax shift |
|---|---|---|---|
| 0 – Base | `CosmicBackground` | `#020008` solid fill | none |
| 1 – Vignette | `CosmicBackground` | CSS radial-gradient overlay | none |
| 2 – Nebula | `NebulaLayer` | CSS blobs + `@keyframes` drift | 14 / 10 px |
| 3 – Stars | `StarField` | Canvas 2D, ~1 800 twinkling stars, DPR-aware | 22 / 16 px |
| 4 – Particles | `ParticlesBackground` | Three.js — galaxy ring + haze cloud + bright motes | internal pointer |
| 5 – Glows | `CosmicBackground` | CSS radial-gradient section accents | 30 / 22 px |

Mouse parallax uses a `requestAnimationFrame` loop with lerp factor `0.04` applied via direct `element.style.transform` mutations.

## Project Structure

```
├── app/
│   ├── globals.css          # Tailwind import, CSS tokens, glass card styles, nebula keyframes
│   ├── layout.tsx           # Root layout — Geist fonts, metadata
│   └── page.tsx             # Entry point — dynamically imports CosmicBackground (ssr:false)
├── components/
│   ├── three/
│   │   ├── CosmicBackground.tsx   # Master wrapper — 6 layers + RAF mouse parallax
│   │   ├── NebulaLayer.tsx        # CSS animated nebula blobs (Layer 2)
│   │   ├── StarField.tsx          # Canvas twinkling stars, DPR-correct (Layer 3)
│   │   └── ParticlesBackground.tsx# Three.js scene — GalaxyRing, HazeCloud, BrightMotes (Layer 4)
│   ├── sections/
│   │   ├── HeroSection.tsx        # Text left, profile photo right, 4 CTA buttons
│   │   ├── AboutSection.tsx       # 4 glassmorphism info cards
│   │   ├── SkillsSection.tsx      # Skill badges grouped: Frontend · SAP · Tools
│   │   ├── ProjectsSection.tsx    # Project gallery — image, description, tech, links
│   │   ├── CertificatesSection.tsx# Certificate gallery with issuer + date
│   │   ├── ResumeSection.tsx      # Timeline + Download CV button
│   │   └── ContactSection.tsx     # Contact form (opens mailto) + social links
│   └── ui/
│       ├── GlassCard.tsx    # Glassmorphism card — Framer Motion useSpring 3D tilt on hover
│       ├── Button.tsx       # primary / outline / ghost variants, renders <a> or <button>
│       ├── SectionTitle.tsx # Animated glow heading with subtitle
│       ├── Navbar.tsx       # Fixed — transparent → glass on scroll, animated mobile menu
│       └── Footer.tsx       # Social icons + copyright
└── public/                  # Static assets
```

## License

MIT
