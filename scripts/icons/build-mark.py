#!/usr/bin/env python3
"""Generate Email Desk geometric mark icons (no photo).

Writes source masters + public favicons / PWA / logo.
Run from repo root: python scripts/icons/build-mark.py
"""
from __future__ import annotations

import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(__file__).resolve().parent / "source"
PUBLIC = ROOT / "public"

# GitHub Issues shell palette
MARK_BG = (31, 35, 40)  # #1f2328
MARK_FG = (255, 255, 255)
MARK_DOT = (207, 34, 46)  # #cf222e
PAGE_BG = (246, 248, 250)  # #f6f8fa


def draw_mark(size: int, *, rounded: bool = True, pad_ratio: float = 0.0) -> Image.Image:
    """Draw the tray-stack mark at any size."""
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # outer tile
    if rounded:
        r = max(2, int(size * 0.22))
        d.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=MARK_BG)
    else:
        d.rectangle((0, 0, size - 1, size - 1), fill=MARK_BG)

    # geometry in 32-unit design space
    s = size / 32.0
    stroke = max(1, int(round(2 * s)))

    def line(x1, y1, x2, y2):
        d.line(
            [(x1 * s, y1 * s), (x2 * s, y2 * s)],
            fill=MARK_FG,
            width=stroke,
        )

    line(8, 11, 24, 11)
    line(8, 16, 24, 16)
    line(8, 21, 19, 21)

    # signal dot
    cx, cy, rad = 23 * s, 21 * s, max(1.5, 2.25 * s)
    d.ellipse(
        [cx - rad, cy - rad, cx + rad, cy + rad],
        fill=MARK_DOT,
    )
    return im


def to_rgb(im: Image.Image, bg=PAGE_BG) -> Image.Image:
    im = im.convert("RGBA")
    base = Image.new("RGBA", im.size, (*bg, 255))
    base.alpha_composite(im)
    out = Image.new("RGB", im.size, bg)
    out.paste(base, mask=base.split()[-1])
    return out


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, format="PNG", optimize=True, compress_level=9)
    print(f"  {path.name:28} {path.stat().st_size/1024:6.1f}KB")


def write_ico(path: Path, images: list[Image.Image]) -> None:
    entries, blobs = [], []
    offset = 6 + 16 * len(images)
    for im in images:
        buf = io.BytesIO()
        im.convert("RGBA").save(buf, format="PNG", optimize=True, compress_level=9)
        data = buf.getvalue()
        w, h = im.size
        bw, bh = (0 if w >= 256 else w), (0 if h >= 256 else h)
        entries.append((bw, bh, len(data), offset))
        blobs.append(data)
        offset += len(data)
    out = io.BytesIO()
    out.write(struct.pack("<HHH", 0, 1, len(images)))
    for bw, bh, size, off in entries:
        out.write(struct.pack("<BBBBHHII", bw, bh, 0, 0, 1, 32, size, off))
    for b in blobs:
        out.write(b)
    path.write_bytes(out.getvalue())
    print(f"  {path.name:28} {path.stat().st_size/1024:6.1f}KB")


def main() -> None:
    SRC.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    print("→ geometric mark icons")

    # masters
    master = draw_mark(1024, rounded=True)
    save_png(master, SRC / "logo.png")
    save_png(master, SRC / "favicon-face.png")
    save_png(to_rgb(draw_mark(1024, rounded=False), bg=MARK_BG), SRC / "mobile.png")

    # header logo (transparent rounded)
    save_png(draw_mark(256, rounded=True), PUBLIC / "logo.png")

    # tab favicons
    ico_frames: list[Image.Image] = []
    for name, size in {
        "favicon-16.png": 16,
        "favicon-32.png": 32,
        "favicon-48.png": 48,
        "favicon.png": 64,
    }.items():
        im = draw_mark(size, rounded=True)
        save_png(im, PUBLIC / name)
        ico_frames.append(im)
    write_ico(PUBLIC / "favicon.ico", ico_frames[:3])

    # iOS / PWA — solid fill (no transparent corners on home screen)
    for name, size in {
        "apple-touch-icon-120.png": 120,
        "apple-touch-icon-152.png": 152,
        "apple-touch-icon-167.png": 167,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
        "apple-touch-icon-1024.png": 1024,
    }.items():
        # full-bleed teal square with mark geometry (less radius on large)
        save_png(to_rgb(draw_mark(size, rounded=size < 180), bg=MARK_BG), PUBLIC / name)

    manifest = {
        "name": "Email Desk",
        "short_name": "Email Desk",
        "description": "Eric's weekday email follow-up board",
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "background_color": "#f6f8fa",
        "theme_color": "#1f2328",
        "icons": [
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }
    (PUBLIC / "manifest.webmanifest").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print("  manifest.webmanifest")
    print("done — bump ASSET_V in src/lib/brand.ts")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
