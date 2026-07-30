/**
 * Build favicon / PWA icons from lucide-react's official Inbox paths.
 * Paths from lucide-react dist (ISC) — not hand-drawn.
 *
 * Usage (repo root): node scripts/icons/build-mark.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(__dirname, "source");

// lucide-react dist/esm/icons/inbox.mjs
const LUCIDE_INBOX = `
  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
`;

const FG = "#1e4d3a";
const BG = "#ffffff";
const PAGE = "#e9ebef";

function svgIcon(size, { padded = true, bg = null } = {}) {
  const pad = padded ? size * 0.18 : size * 0.12;
  const inner = size - pad * 2;
  const r = Math.round(size * 0.18);
  const bgRect = bg
    ? `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  ${bgRect}
  <g transform="translate(${pad} ${pad}) scale(${inner / 24})"
     stroke="${FG}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${LUCIDE_INBOX}
  </g>
</svg>`;
}

function pngFromSvg(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "original" },
  });
  return resvg.render().asPng();
}

function writePng(svg, outPath) {
  const buf = pngFromSvg(svg);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`  ${path.basename(outPath).padEnd(28)} ${(buf.length / 1024).toFixed(1)}KB`);
  return buf;
}

function main() {
  fs.mkdirSync(SRC, { recursive: true });
  fs.mkdirSync(PUBLIC, { recursive: true });
  console.log("→ lucide Inbox icons (@resvg)");

  writePng(svgIcon(256, { padded: true, bg: null }), path.join(PUBLIC, "logo.png"));
  writePng(svgIcon(1024, { padded: true, bg: null }), path.join(SRC, "logo.png"));

  const favSizes = [
    ["favicon-16.png", 16],
    ["favicon-32.png", 32],
    ["favicon-48.png", 48],
    ["favicon.png", 64],
  ];
  const icoPngs = [];
  for (const [name, size] of favSizes) {
    const buf = writePng(
      svgIcon(size, { padded: true, bg: BG }),
      path.join(PUBLIC, name),
    );
    if (size <= 48) icoPngs.push({ size, buf });
  }

  // multi-size PNG ICO
  {
    let offset = 6 + 16 * icoPngs.length;
    const header = Buffer.alloc(6 + 16 * icoPngs.length);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(icoPngs.length, 4);
    const parts = [header];
    for (let i = 0; i < icoPngs.length; i++) {
      const { size, buf } = icoPngs[i];
      const o = 6 + i * 16;
      header.writeUInt8(size >= 256 ? 0 : size, o);
      header.writeUInt8(size >= 256 ? 0 : size, o + 1);
      header.writeUInt8(0, o + 2);
      header.writeUInt8(0, o + 3);
      header.writeUInt16LE(1, o + 4);
      header.writeUInt16LE(32, o + 6);
      header.writeUInt32LE(buf.length, o + 8);
      header.writeUInt32LE(offset, o + 12);
      offset += buf.length;
      parts.push(buf);
    }
    const ico = Buffer.concat(parts);
    fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico);
    console.log(`  ${"favicon.ico".padEnd(28)} ${(ico.length / 1024).toFixed(1)}KB`);
  }

  for (const [name, size] of [
    ["apple-touch-icon-120.png", 120],
    ["apple-touch-icon-152.png", 152],
    ["apple-touch-icon-167.png", 167],
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
    ["apple-touch-icon-1024.png", 1024],
  ]) {
    writePng(svgIcon(size, { padded: true, bg: BG }), path.join(PUBLIC, name));
  }

  fs.writeFileSync(
    path.join(PUBLIC, "favicon.svg"),
    svgIcon(32, { padded: true, bg: BG }),
  );
  console.log("  favicon.svg");

  fs.writeFileSync(
    path.join(PUBLIC, "manifest.webmanifest"),
    JSON.stringify(
      {
        name: "Email Desk",
        short_name: "Email Desk",
        description: "Eric's weekday email follow-up board",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: PAGE,
        theme_color: FG,
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  console.log("  manifest.webmanifest");
  console.log("done — bump ASSET_V in src/lib/brand.ts");
}

main();
