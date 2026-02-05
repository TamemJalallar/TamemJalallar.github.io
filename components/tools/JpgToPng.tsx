"use client";

import React, { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, fileToImage } from "./_imageUtils";

export default function JpgToPng() {
  const [file, setFile] = useState<File | null>(null);

  const convert = async () => {
    if (!file) return;
    const img = await fileToImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;
    downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}.png`);
  };

  return (
    <ToolShell title="JPG → PNG" description="Convert a JPEG image to PNG.">
      <input
        type="file"
        accept="image/jpeg,image/jpg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block text-sm"
      />
      <button
        onClick={convert}
        disabled={!file}
        className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
      >
        Convert & Download PNG
      </button>
    </ToolShell>
  );
}
