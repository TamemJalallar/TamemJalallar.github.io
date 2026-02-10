"use client";

import { useEffect, useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes } from "./tool-utils";

const PRESETS = [
  { name: "Slate", className: "bg-slate-900" },
  { name: "Pearl", className: "bg-slate-100" },
  { name: "Sky", className: "bg-gradient-to-br from-sky-500 to-indigo-500" },
  { name: "Sunset", className: "bg-gradient-to-br from-orange-400 to-rose-500" },
  { name: "Emerald", className: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  { name: "Midnight", className: "bg-gradient-to-br from-zinc-900 to-slate-800" },
  { name: "Sand", className: "bg-gradient-to-br from-amber-200 to-orange-300" },
  { name: "Lavender", className: "bg-gradient-to-br from-purple-400 to-indigo-600" },
];

type LogoPreview = {
  name: string;
  url: string;
  size: number;
};

export default function LogoBackgroundTester() {
  const [logo, setLogo] = useState<LogoPreview | null>(null);
  const [scale, setScale] = useState(60);
  const [padding, setPadding] = useState(24);

  useEffect(() => {
    return () => {
      if (logo?.url) URL.revokeObjectURL(logo.url);
    };
  }, [logo?.url]);

  const logoStyle = useMemo(
    () => ({
      width: `${scale}%`,
      maxWidth: 240,
      padding: `${padding}px`,
    }),
    [scale, padding],
  );

  const downloadGrid = async () => {
    if (!logo) return;

    const canvas = document.createElement("canvas");
    const size = 320;
    const columns = 4;
    const rows = 2;
    canvas.width = size * columns;
    canvas.height = size * rows;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = logo.url;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    PRESETS.forEach((preset, idx) => {
      const col = idx % columns;
      const row = Math.floor(idx / columns);
      const x = col * size;
      const y = row * size;

      const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
      switch (preset.name) {
        case "Sky":
          gradient.addColorStop(0, "#38bdf8");
          gradient.addColorStop(1, "#6366f1");
          break;
        case "Sunset":
          gradient.addColorStop(0, "#fb923c");
          gradient.addColorStop(1, "#f43f5e");
          break;
        case "Emerald":
          gradient.addColorStop(0, "#10b981");
          gradient.addColorStop(1, "#0d9488");
          break;
        case "Midnight":
          gradient.addColorStop(0, "#0f172a");
          gradient.addColorStop(1, "#1e293b");
          break;
        case "Sand":
          gradient.addColorStop(0, "#fde68a");
          gradient.addColorStop(1, "#fdba74");
          break;
        case "Lavender":
          gradient.addColorStop(0, "#a78bfa");
          gradient.addColorStop(1, "#6366f1");
          break;
        case "Pearl":
          gradient.addColorStop(0, "#f8fafc");
          gradient.addColorStop(1, "#e2e8f0");
          break;
        default:
          gradient.addColorStop(0, "#0f172a");
          gradient.addColorStop(1, "#0f172a");
      }

      ctx.fillStyle = preset.name === "Slate" ? "#0f172a" : gradient;
      ctx.fillRect(x, y, size, size);

      const targetWidth = size * (scale / 100);
      const targetHeight = (img.height / img.width) * targetWidth;
      const dx = x + (size - targetWidth) / 2;
      const dy = y + (size - targetHeight) / 2;
      ctx.drawImage(img, dx, dy, targetWidth, targetHeight);

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(x + 8, y + 8, 86, 22);
      ctx.fillStyle = "white";
      ctx.font = "12px sans-serif";
      ctx.fillText(preset.name, x + 14, y + 24);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, "logo-backgrounds.png");
    }, "image/png");
  };

  return (
    <ToolShell
      title="Logo Background Tester"
      description="Preview your logo across eight curated background styles."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (!file) {
              setLogo(null);
              return;
            }
            if (logo?.url) URL.revokeObjectURL(logo.url);
            setLogo({
              name: file.name,
              url: URL.createObjectURL(file),
              size: file.size,
            });
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Scale
          <input
            type="number"
            min={30}
            max={90}
            value={scale}
            onChange={(event) => setScale(Number(event.target.value) || 60)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Padding
          <input
            type="number"
            min={0}
            max={60}
            value={padding}
            onChange={(event) => setPadding(Number(event.target.value) || 24)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void downloadGrid()}
          disabled={!logo}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download grid
        </button>
      </div>

      {logo ? (
        <div className="mt-4 text-xs text-white/60">
          {logo.name} · {formatBytes(logo.size)}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRESETS.map((preset) => (
          <div
            key={preset.name}
            className={`flex items-center justify-center rounded-2xl p-4 ${preset.className}`}
          >
            {logo ? (
              <img
                src={logo.url}
                alt={logo.name}
                style={logoStyle}
                className="max-h-full max-w-full"
              />
            ) : (
              <div className="text-xs text-white/70">Upload logo</div>
            )}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
