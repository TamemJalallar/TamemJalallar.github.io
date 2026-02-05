"use client";

import React, { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, fileToImage } from "./_imageUtils";

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.9);

  const convert = async () => {
    if (!file) return;
    const img = await fileToImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // PNG transparency => fill with white before JPG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob) return;
    downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}.jpg`);
  };

  return (
    <ToolShell title="PNG → JPG" description="Convert a PNG image to JPG (transparency becomes white).">
      <input
        type="file"
        accept="image/png"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block text-sm"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-white/70">
          Quality: <span className="font-semibold">{Math.round(quality * 100)}%</span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="ml-3 align-middle"
          />
        </label>
        <button
          onClick={convert}
          disabled={!file}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Convert & Download JPG
        </button>
      </div>
    </ToolShell>
  );
}
