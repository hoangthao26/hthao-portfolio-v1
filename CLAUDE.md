# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # Run ESLint (flat config, eslint.config.mjs)
```

## Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`; uses `@import "tailwindcss"` and `@theme inline` in `globals.css`)
- **3D**: React Three Fiber + Three.js + @react-three/drei
- **Post-processing**: @react-three/postprocessing (Bloom effect on 3D particles)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans + Geist Mono via `next/font/google`
- **Package manager**: pnpm

## Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

## Architecture

Single-page futuristic 3D portfolio using Next.js App Router. The entire site is rendered from `app/page.tsx` which composes all sections.

### Component Structure

```
components/
├── three/                       # 3D / canvas / background layers
│   ├── CosmicBackground.tsx     # Master wrapper — 6 layers + RAF mouse parallax
│   │                            #   dynamically imported (ssr:false) from page.tsx
│   ├── NebulaLayer.tsx          # Layer 2 — CSS animated purple/violet nebula blobs (6 blobs)
│   ├── StarField.tsx            # Layer 3 — Canvas 2D, ~1600 glow stars, additive blending
│   │                            #   Pre-rendered glow sprites (3 colour variants, 96×96 px offscreen canvas)
│   │                            #   drawn with globalCompositeOperation='lighter'. resize uses
│   │                            #   getBoundingClientRect() + ctx.setTransform(dpr,…)
│   └── ParticlesBackground.tsx  # Layer 4 — Three.js: GalaxyRing + HazeCloud + BrightMotes
│                                #   makeGlowTex() — soft radial gradient sprite, fixes square-pixel artefact
│                                #   Vertex colours (purple/violet/white palette) per particle.
│                                #   Bloom via <EffectComposer><Bloom mipmapBlur /> from @react-three/postprocessing
│                                #   Per-group pulsing opacity animated in useFrame with different phases.
├── sections/                    # Hero · About · Skills · Projects · Certificates · Resume · Contact
│   └── HeroSection.tsx          # text panel LEFT (order-1), profile photo RIGHT (order-2), flex-col → md:flex-row
│                                #   Profile image uses onError → gradient "HT" fallback (useState)
└── ui/                          # Reusable UI primitives
    ├── GlassCard.tsx            # Glassmorphism card — Framer Motion useSpring 3D tilt on hover
    ├── Button.tsx               # primary / outline / ghost; renders <a> or <button> by prop
    ├── SectionTitle.tsx         # Section heading with glow + subtitle
    ├── Navbar.tsx               # Fixed — transparent → glass-card-strong on scroll + mobile menu
    └── Footer.tsx
```

### Background Layer Stack (back → front)

| Layer | File | Technique | Parallax shift |
|-------|------|-----------|----------------|
| 0 – Base | `CosmicBackground` inline div | `#020008` solid fill | none |
| 1 – Vignette | `CosmicBackground` inline div | CSS radial-gradient overlay | none |
| 2 – Nebula | `NebulaLayer.tsx` | CSS blobs + `@keyframes` drift | 14 / 10 px |
| 3 – Stars | `StarField.tsx` | Canvas 2D + additive blending glow sprites | 22 / 16 px |
| 4 – Particles | `ParticlesBackground.tsx` | Three.js (r3f) + Bloom post-processing | internal pointer |
| 5 – Glows | `CosmicBackground` inline divs | CSS radial-gradients | 30 / 22 px |

Mouse parallax uses a `requestAnimationFrame` loop with lerp factor `0.04` applied via direct style mutations (`element.style.transform`) — faster than Framer Motion for per-frame updates.

`BufferAttribute` in Three.js components must be set imperatively via `useEffect` + `geometry.setAttribute()` — the JSX `<bufferAttribute>` tag requires an `args` prop that conflicts with TypeScript types in this version of r3f.

### Key Patterns

- **CosmicBackground** is loaded with `next/dynamic` and `ssr: false` — all canvas/Three.js children are regular imports inside it.
- **StarField** pre-renders 3 colour-variant glow sprites (offscreen canvas, 96 px) once on mount, then draws them each frame with `ctx.drawImage` + `globalCompositeOperation = 'lighter'` (additive blending). Never creates gradients inside the draw loop — pure performance.
- **ParticlesBackground** uses vertex colours (`vertexColors: true`) on `PointsMaterial` for per-particle colour variation. `BufferAttribute` must be set imperatively via `useEffect` + `geometry.setAttribute()` — the JSX `<bufferAttribute>` tag conflicts with TypeScript types in this version of r3f.
- **Bloom** (`@react-three/postprocessing`) wraps the Three.js scene inside `<EffectComposer>`. `luminanceThreshold={0.05}` catches dim purple particles; `mipmapBlur` gives smooth falloff. Installed separately: `pnpm add @react-three/postprocessing postprocessing`.
- **Image fallbacks**: `ProjectsSection`, `CertificatesSection`, and `HeroSection` each use a per-card `useState(false)` + `onError` handler to show a gradient placeholder when image files are missing. Each card that needs this is extracted to its own sub-component.
- **Global CSS** (`app/globals.css`) defines the cosmic theme: custom properties, `.glass-card`, `.glow-purple`, `.gradient-border`, nebula blob animations (`.nebula-blob-1…5`), and float/pulse keyframes.
- **GlassCard** uses Framer Motion's `useMotionValue` + `useSpring` for smooth 3D tilt on hover.
- All section data (projects, certificates, timeline, skills) is defined as typed constants inside their respective section files. To update content, edit the arrays directly.

### Static Assets

- `public/profile.jpg` — Hero profile photo
- `public/cv.pdf` — Downloadable CV
- `public/projects/` — Project screenshot images
- `public/certificates/` — Certificate images

### Customization

- **Social links / GitHub URL**: Update in `HeroSection.tsx`, `ContactSection.tsx`, and `Footer.tsx`
- **Projects / Certificates**: Edit the `projects` and `certificates` arrays in their respective section files
- **Timeline**: Edit the `timeline` array in `ResumeSection.tsx`
- **Color theme**: Modify CSS custom properties in `globals.css` `:root` block
