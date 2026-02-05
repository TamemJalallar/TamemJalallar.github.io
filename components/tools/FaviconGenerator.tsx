"use client";

import React, { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, fileToImage } from "./_imageUtils";

const SIZES = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);

  const generate = async (size: number) => {
    if (!file) return;
    const img = await fileToImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;
    downloadBlob(blob, `favicon-${size}x${size}.png`);
  };

  return (
    <ToolShell
      title="Favicon Generator"
      description="Upload an image, then download common favicon sizes as PNG."
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block text-sm"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => generate(s)}
            disabled={!file}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
          >
            Download {s}×{s}
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
