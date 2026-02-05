"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function clamp(n: number, a = 0, b = 255) {
  return Math.min(b, Math.max(a, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  if (![3, 6].includes(h.length)) return null;
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) => clamp(x).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });

  const derived = useMemo(() => {
    const fromHex = hexToRgb(hex);
    const fromRgbHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { fromHex, fromRgbHex, hsl };
  }, [hex, rgb]);

  const applyHex = () => {
    const x = hexToRgb(hex);
    if (x) setRgb(x);
  };

  const applyRgb = () => {
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const copy = async (v: string) => navigator.clipboard.writeText(v);

  return (
    <ToolShell title="Color Converter" description="Convert Hex ↔ RGB and view HSL.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-sm text-white/70">Hex</div>
          <div className="flex gap-2">
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <button onClick={applyHex} className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Apply
            </button>
            <button onClick={() => copy(hex)} className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Copy
            </button>
          </div>
          <div className="mt-3 h-12 w-full rounded-xl border border-white/10" style={{ background: hex }} />
          <div className="mt-3 text-sm text-white/80">
            Parsed RGB:{" "}
            {derived.fromHex ? `${derived.fromHex.r}, ${derived.fromHex.g}, ${derived.fromHex.b}` : "Invalid hex"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-sm text-white/70">RGB</div>
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((k) => (
              <input
                key={k}
                type="number"
                min={0}
                max={255}
                value={rgb[k]}
                onChange={(e) => setRgb((p) => ({ ...p, [k]: Number(e.target.value) }))}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
              />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={applyRgb} className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Apply
            </button>
            <button
              onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Copy RGB
            </button>
            <button
              onClick={() => copy(derived.fromRgbHex)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Copy Hex
            </button>
          </div>

          <div className="mt-3 text-sm text-white/80">
            Hex: {derived.fromRgbHex}
            <br />
            HSL: hsl({derived.hsl.h}, {derived.hsl.s}%, {derived.hsl.l}%)
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
