/**
 * Generates simple placeholder PNG images for projects and certificates.
 * Uses only Node.js built-ins (zlib, fs) — no extra packages needed.
 * Run: node scripts/gen-placeholders.mjs
 */
import zlib from "zlib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/* ── Tiny CRC-32 ── */
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  Buffer.from(type, "ascii").copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/**
 * Create a minimal solid-colour PNG (RGB, no alpha).
 * @param {number} w  width in px
 * @param {number} h  height in px
 * @param {number[]} bg  [r, g, b]  background colour
 * @param {string} label  text rendered as… nothing (pure PNG, no text encoding)
 */
function makePNG(w, h, [r, g, b]) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // RGB
  // compression / filter / interlace = 0

  // Raw scanlines: filter byte (0) + RGB pixels per row
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    const base = y * (1 + w * 3);
    raw[base] = 0; // filter type None
    for (let x = 0; x < w; x++) {
      const px = base + 1 + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 1 });

  return Buffer.concat([
    PNG_SIG,
    chunk("IHDR", ihdrData),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── Files to generate ── */
const files = [
  // Projects  (600 × 360, dark purple-tinted)
  { out: "public/projects/portfolio.png",       size: [600, 360], color: [15, 8, 40]  },
  { out: "public/projects/hengout.png",         size: [600, 360], color: [10, 12, 45] },
  { out: "public/projects/sap-fiori.png",       size: [600, 360], color: [8,  10, 38] },
  // Certificates  (480 × 320)
  { out: "public/certificates/sap-cert.png",          size: [480, 320], color: [18, 8, 50]  },
  { out: "public/certificates/react-cert.png",         size: [480, 320], color: [12, 5, 42]  },
  { out: "public/certificates/freecodecamp-cert.png",  size: [480, 320], color: [10, 8, 38]  },
];

for (const { out, size: [w, h], color } of files) {
  const dest = path.join(root, out);
  if (fs.existsSync(dest)) {
    console.log(`skip  ${out}  (already exists)`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, makePNG(w, h, color));
  console.log(`wrote ${out}  (${w}×${h})`);
}

console.log("done.");
