"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";
import * as Tooltip from "@radix-ui/react-tooltip";

type Hsl = { h: number; s: number; l: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) || 0;
  const g = Number.parseInt(normalized.slice(2, 4), 16) || 0;
  const b = Number.parseInt(normalized.slice(4, 6), 16) || 0;
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;

const rgbToHsl = (r: number, g: number, b: number): Hsl => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
      default:
        h = 0;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number) => {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;

  if (hh >= 0 && hh < 1) {
    r = c;
    g = x;
  } else if (hh >= 1 && hh < 2) {
    r = x;
    g = c;
  } else if (hh >= 2 && hh < 3) {
    g = c;
    b = x;
  } else if (hh >= 3 && hh < 4) {
    g = x;
    b = c;
  } else if (hh >= 4 && hh < 5) {
    r = x;
    b = c;
  } else if (hh >= 5 && hh < 6) {
    r = c;
    b = x;
  }

  const m = ln - c / 2;
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
};

const shiftHue = (h: number, delta: number) => (h + delta + 360) % 360;

export default function ColorHarmonyGenerator() {
  const [base, setBase] = useState("#5f6cff");
  const [copied, setCopied] = useState<string | null>(null);

  const palette = useMemo(() => {
    const { r, g, b } = hexToRgb(base);
    const hsl = rgbToHsl(r, g, b);
    const { s, l } = hsl;

    const toHex = (h: number) => {
      const rgb = hslToRgb(h, s, l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    };

    return {
      base,
      complementary: [toHex(shiftHue(hsl.h, 180))],
      triadic: [toHex(shiftHue(hsl.h, 120)), toHex(shiftHue(hsl.h, 240))],
      analogous: [toHex(shiftHue(hsl.h, -30)), toHex(shiftHue(hsl.h, 30))],
    };
  }, [base]);

  const handleCopy = async (hex: string) => {
    const ok = await copyToClipboard(hex);
    if (ok) {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1200);
    }
  };

  const renderSwatch = (hex: string) => (
    <Tooltip.Root key={hex}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => void handleCopy(hex)}
          className="group flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left"
        >
          <div className="h-12 w-full rounded-lg border border-white/10" style={{ backgroundColor: hex }} />
          <div className="text-xs text-white/70">{hex}</div>
          <div className="text-[11px] text-white/40 group-hover:text-white/60">
            {copied === hex ? "Copied" : "Click to copy"}
          </div>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="rounded-lg border border-white/10 bg-black/80 px-2 py-1 text-xs text-white"
          sideOffset={6}
        >
          Copy color
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );

  return (
    <ToolShell
      title="Color Harmony Generator"
      description="Generate complementary, triadic, and analogous palettes."
    >
      <Tooltip.Provider delayDuration={200}>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-white/70">
            Base color
            <input
              type="color"
              value={base}
              onChange={(event) => setBase(event.target.value)}
              className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs text-white/60">Base</div>
            {renderSwatch(palette.base)}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs text-white/60">Complementary</div>
            {palette.complementary.map(renderSwatch)}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs text-white/60">Triadic</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {palette.triadic.map(renderSwatch)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs text-white/60">Analogous</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {palette.analogous.map(renderSwatch)}
            </div>
          </div>
        </div>
      </Tooltip.Provider>
    </ToolShell>
  );
}
