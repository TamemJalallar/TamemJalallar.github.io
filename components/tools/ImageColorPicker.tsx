"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard, loadImageFromFile } from "./tool-utils";

type Sample = {
  hex: string;
  rgb: string;
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

export default function ImageColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const loadImage = async (nextFile: File | null) => {
    setFile(nextFile);
    setSamples([]);
    setError("");

    if (!nextFile) return;

    try {
      const image = await loadImageFromFile(nextFile);
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load image.");
    }
  };

  const handlePick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0] ?? 0;
    const g = pixel[1] ?? 0;
    const b = pixel[2] ?? 0;
    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;

    setSamples((prev) => {
      if (prev.some((item) => item.hex === hex)) return prev;
      return [...prev, { hex, rgb }];
    });
  };

  const copyPalette = async () => {
    if (!samples.length) return;
    const list = samples.map((s) => s.hex).join(", ");
    const ok = await copyToClipboard(list);
    if (ok) setCopied(true);
  };

  return (
    <ToolShell
      title="Image Color Picker"
      description="Click on an image to collect color samples and export a palette."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => void loadImage(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => setSamples([])}
          disabled={!samples.length}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Clear palette
        </button>

        <button
          type="button"
          onClick={() => void copyPalette()}
          disabled={!samples.length}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {copied ? "Copied!" : "Copy palette"}
        </button>
      </div>

      {file ? (
        <p className="mt-3 text-xs text-white/60">Click on the image to pick colors.</p>
      ) : null}

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <canvas
          ref={canvasRef}
          onClick={handlePick}
          className="max-w-full rounded-lg border border-white/10"
        />
      </div>

      {samples.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => (
            <div
              key={sample.hex}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg border border-white/20"
                  style={{ backgroundColor: sample.hex }}
                />
                <div className="text-xs text-white/70">
                  <div className="font-mono text-[11px]">{sample.hex}</div>
                  <div className="text-[11px] text-white/50">{sample.rgb}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSamples((prev) => prev.filter((item) => item.hex !== sample.hex))
                }
                className="rounded-lg bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
