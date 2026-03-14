"use client";

/* Pure-CSS nebula blobs — no canvas needed.
   Each blob is a heavily-blurred, low-opacity radial-gradient div
   animated with CSS keyframes defined in globals.css.
   They extend 10 % beyond the viewport so parallax translate
   never shows a hard edge.                                          */
export default function NebulaLayer() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "-10%",
        width: "120%",
        height: "120%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* — Blob 1: large centred violet cloud (hero glow) — */}
      <div
        className="nebula-blob-1"
        style={{
          position: "absolute",
          width: "110vw",
          height: "110vw",
          maxWidth: 1100,
          maxHeight: 1100,
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.18) 0%, rgba(76,29,149,0.09) 45%, transparent 70%)",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />

      {/* — Blob 2: deep purple, bottom-left — */}
      <div
        className="nebula-blob-2"
        style={{
          position: "absolute",
          width: "80vw",
          height: "80vw",
          maxWidth: 800,
          maxHeight: 800,
          bottom: "5%",
          left: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(88,28,235,0.14) 0%, rgba(49,10,130,0.07) 50%, transparent 70%)",
          filter: "blur(90px)",
          willChange: "transform",
        }}
      />

      {/* — Blob 3: violet-rose, top-right — */}
      <div
        className="nebula-blob-3"
        style={{
          position: "absolute",
          width: "65vw",
          height: "65vw",
          maxWidth: 700,
          maxHeight: 700,
          top: "20%",
          right: "-5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.06) 50%, transparent 70%)",
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />

      {/* — Blob 4: cool indigo, mid-page — */}
      <div
        className="nebula-blob-4"
        style={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          maxWidth: 600,
          maxHeight: 600,
          top: "55%",
          left: "30%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(67,20,180,0.10) 0%, rgba(49,10,130,0.05) 50%, transparent 70%)",
          filter: "blur(100px)",
          willChange: "transform",
        }}
      />

      {/* — Blob 5: small bright accent, drifts freely — */}
      <div
        className="nebula-blob-5"
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          maxWidth: 440,
          maxHeight: 440,
          top: "70%",
          right: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.09) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />

      {/* — Blob 6: wide subtle base wash — */}
      <div
        style={{
          position: "absolute",
          width: "140vw",
          height: "140vw",
          maxWidth: 1600,
          maxHeight: 1600,
          top: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(55,10,120,0.07) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
    </div>
  );
}
