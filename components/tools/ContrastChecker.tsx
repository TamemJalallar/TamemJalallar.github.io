"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  if (![3, 6].includes(h.length)) return null;
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function srgbToLin(v: number) {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(rgb: { r: number; g: number; b: number }) {
  const R = srgbToLin(rgb.r);
  const G = srgbToLin(rgb.g);
  const B = srgbToLin(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(a: string, b: string) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  if (!A || !B) return null;
  const L1 = luminance(A);
  const L2 = luminance(B);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#111827");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  const badge = (ok: boolean) =>
    ok ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200";

  const AA_normal = ratio != null && ratio >= 4.5;
  const AA_large = ratio != null && ratio >= 3.0;
  const AAA_normal = ratio != null && ratio >= 7.0;
  const AAA_large = ratio != null && ratio >= 4.5;

  return (
    <ToolShell title="Contrast Checker" description="WCAG contrast ratio for text on background.">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-white/70">
          Text
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="ml-2 h-10 w-16 align-middle" />
          <input value={fg} onChange={(e) => setFg(e.target.value)} className="ml-2 w-32 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" />
        </label>
        <label className="text-sm text-white/70">
          Background
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="ml-2 h-10 w-16 align-middle" />
          <input value={bg} onChange={(e) => setBg(e.target.value)} className="ml-2 w-32 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-5" style={{ background: bg, color: fg }}>
          <div className="text-2xl font-semibold">Preview</div>
          <div className="mt-2 text-sm opacity-90">
            The quick brown fox jumps over the lazy dog.
          </div>
          <div className="mt-4 rounded-lg bg-black/20 p-3 text-sm">
            Ratio:{" "}
            <span className="font-semibold">
              {ratio == null ? "Invalid colors" : ratio.toFixed(2) + ":1"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm">
          <div className="mb-3 font-semibold">WCAG Results</div>
          <div className="grid gap-2">
            <div className={`rounded-lg px-3 py-2 ${badge(AA_normal)}`}>AA (Normal text): {AA_normal ? "Pass" : "Fail"} (≥ 4.5)</div>
            <div className={`rounded-lg px-3 py-2 ${badge(AA_large)}`}>AA (Large text): {AA_large ? "Pass" : "Fail"} (≥ 3.0)</div>
            <div className={`rounded-lg px-3 py-2 ${badge(AAA_normal)}`}>AAA (Normal text): {AAA_normal ? "Pass" : "Fail"} (≥ 7.0)</div>
            <div className={`rounded-lg px-3 py-2 ${badge(AAA_large)}`}>AAA (Large text): {AAA_large ? "Pass" : "Fail"} (≥ 4.5)</div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
