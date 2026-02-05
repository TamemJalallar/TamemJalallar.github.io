"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Rgb = { r: number; g: number; b: number };

type Hsl = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const numeric = Number.parseInt(value, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function rgbToHex({ r, g, b }: Rgb) {
  const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;

  let h = 0;
  if (delta) {
    if (max === nr) h = ((ng - nb) / delta) % 6;
    else if (max === ng) h = (nb - nr) / delta + 2;
    else h = (nr - ng) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const ss = s / 100;
  const ll = l / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ll - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (h >= 0 && h < 60) {
    r1 = c;
    g1 = x;
  } else if (h >= 60 && h < 120) {
    r1 = x;
    g1 = c;
  } else if (h >= 120 && h < 180) {
    g1 = c;
    b1 = x;
  } else if (h >= 180 && h < 240) {
    g1 = x;
    b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function shiftHue(h: number, offset: number) {
  return (h + offset + 360) % 360;
}

export default function ColorPaletteGenerator() {
  const [hex, setHex] = useState("#3B82F6");
  const [copied, setCopied] = useState("");

  const palettes = useMemo(() => {
    const baseRgb = hexToRgb(hex);
    const baseHsl = rgbToHsl(baseRgb);

    const makeColor = (h: number, s = baseHsl.s, l = baseHsl.l) =>
      rgbToHex(hslToRgb({ h, s, l }));

    const tints = [20, 35, 50].map((delta) => makeColor(baseHsl.h, baseHsl.s, clamp(baseHsl.l + delta, 0, 100)));
    const shades = [20, 35, 50].map((delta) => makeColor(baseHsl.h, baseHsl.s, clamp(baseHsl.l - delta, 0, 100)));

    return [
      { label: "Base", colors: [rgbToHex(baseRgb)] },
      { label: "Complementary", colors: [makeColor(shiftHue(baseHsl.h, 180))] },
      { label: "Analogous", colors: [makeColor(shiftHue(baseHsl.h, -30)), makeColor(shiftHue(baseHsl.h, 30))] },
      { label: "Triad", colors: [makeColor(shiftHue(baseHsl.h, 120)), makeColor(shiftHue(baseHsl.h, 240))] },
      { label: "Tints", colors: tints },
      { label: "Shades", colors: shades },
    ];
  }, [hex]);

  async function copy(value: string) {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Color Palette Generator</h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          className="h-12 w-14 rounded border border-gray-300/70"
        />
        <input
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          className="w-36 rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm font-mono uppercase dark:border-white/20 dark:bg-grey-900"
        />
      </div>

      <div className="mt-4 grid gap-3">
        {palettes.map((palette) => (
          <div key={palette.label} className="rounded-xl border border-gray-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-grey-900/70">
            <p className="text-xs text-black/60 dark:text-white/60">{palette.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {palette.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => void copy(color)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-2 py-1 text-xs dark:border-white/10 dark:bg-grey-900"
                >
                  <span className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
                  <span className="font-mono">{color}</span>
                  <span className="text-[10px] text-black/50 dark:text-white/50">
                    {copied === color ? "Copied" : "Copy"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
