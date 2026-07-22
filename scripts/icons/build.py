#!/usr/bin/env python3
"""Build Email Desk public icons from scripts/icons/source/ masters.

Locks (Eric):
  - logo.png          → source/logo.png (original padded header mark)
  - favicon*          → source/favicon-face.png + rounded corners (tab only)
  - apple-touch / PWA → source/mobile.png EXACT (resize only, no re-crop/zoom)

Usage (from repo root):
  python scripts/icons/build.py
  python scripts/icons/build.py --bump   # print reminder to bump ASSET_V
"""
from __future__ import annotations

import argparse
import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(__file__).resolve().parent / "source"
PUBLIC = ROOT / "public"

LOGO = SRC / "logo.png"
FACE = SRC / "favicon-face.png"  # tab face (may differ from mobile)
MOBILE = SRC / "mobile.png"  # Eric right-tile master, opaque square


def to_rgb(im: Image.Image, bg=(255, 255, 255)) -> Image.Image:
    im = im.convert("RGBA")
    base = Image.new("RGBA", im.size, (*bg, 255))
    base.alpha_composite(im)
    out = Image.new("RGB", im.size, bg)
    out.paste(base, mask=base.split()[-1])
    return out


def resize(im: Image.Image, size: int) -> Image.Image:
    rgb = to_rgb(im) if im.mode != "RGB" else im
    if rgb.size == (size, size):
        return rgb.copy()
    return rgb.resize((size, size), Image.Resampling.LANCZOS)


def round_corners(im: Image.Image, radius_ratio: float = 0.22) -> Image.Image:
    rgb = to_rgb(im)
    w, h = rgb.size
    r = max(1, int(min(w, h) * radius_ratio))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def save_png(im: Image.Image, path: Path, *, optimize: bool = True) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    kwargs = {"format": "PNG", "optimize": optimize, "compress_level": 9}
    if im.mode == "RGB":
        # palette-friendly B&W line art compresses much smaller as PNG-8
        try:
            quantized = im.quantize(colors=64, method=Image.Quantize.MEDIANCUT)
            quantized.save(path, **kwargs)
            # keep if smaller than RGB
            rgb_buf = io.BytesIO()
            im.save(rgb_buf, format="PNG", optimize=True, compress_level=9)
            if path.stat().st_size <= len(rgb_buf.getvalue()):
                print(f"  {path.name:28} {path.stat().st_size/1024:6.1f}KB  (P)")
                return
            im.save(path, **kwargs)
        except Exception:
            im.save(path, **kwargs)
    else:
        im.save(path, **kwargs)
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


def build() -> None:
    for p in (LOGO, FACE, MOBILE):
        if not p.exists():
            sys.exit(f"missing source master: {p}")

    logo = Image.open(LOGO)
    face = Image.open(FACE)
    mobile = Image.open(MOBILE)
    print("sources:", f"logo={logo.size}", f"face={face.size}", f"mobile={mobile.size}")
    print("→ public/")

    # Header logo (as-is artwork, keep alpha if present)
    if logo.mode == "RGBA":
        logo.save(PUBLIC / "logo.png", format="PNG", optimize=True, compress_level=9)
        print(f"  {'logo.png':28} {(PUBLIC/'logo.png').stat().st_size/1024:6.1f}KB")
    else:
        save_png(to_rgb(logo), PUBLIC / "logo.png")

    # Tab favicons — rounded
    fav_map = {
        "favicon-16.png": 16,
        "favicon-32.png": 32,
        "favicon-48.png": 48,
        "favicon.png": 64,
    }
    ico_frames: list[Image.Image] = []
    for name, size in fav_map.items():
        rounded = round_corners(resize(face, size))
        save_png(rounded, PUBLIC / name)
        ico_frames.append(rounded)
    # compact ico: 16/32/48 only (enough for tabs; smaller file)
    write_ico(PUBLIC / "favicon.ico", ico_frames[:3])

    # iOS + Android — exact mobile master, resize only
    mobile_specs = {
        "apple-touch-icon-120.png": 120,
        "apple-touch-icon-152.png": 152,
        "apple-touch-icon-167.png": 167,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
        # high-res optional (some “add to home” paths); keep compressed
        "apple-touch-icon-1024.png": 1024,
    }
    for name, size in mobile_specs.items():
        save_png(resize(mobile, size), PUBLIC / name)

    manifest = {
        "name": "Email Desk",
        "short_name": "Email Desk",
        "description": "Eric's weekday email follow-up board",
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "background_color": "#f4f4f5",
        "theme_color": "#f4f4f5",
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

    total = sum(f.stat().st_size for f in PUBLIC.iterdir() if f.is_file())
    print(f"public/ total {total/1024:.0f}KB")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--bump",
        action="store_true",
        help="remind to bump ASSET_V in src/lib/brand.ts",
    )
    args = ap.parse_args()
    build()
    if args.bump:
        print("\n→ bump ASSET_V in src/lib/brand.ts after shipping new icons")


if __name__ == "__main__":
    main()
