"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, fileToImage } from "./_imageUtils";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(800);
  const [keepAspect, setKeepAspect] = useState(true);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const ratio = useMemo(() => (orig ? orig.w / orig.h : 1), [orig]);

  const onPick = async (f: File) => {
    setFile(f);
    const img = await fileToImage(f);
    setOrig({ w: img.naturalWidth, h: img.naturalHeight });
    setW(img.naturalWidth);
    setH(img.naturalHeight);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const onW = (val: number) => {
    setW(val);
    if (keepAspect && orig) setH(Math.round(val / ratio));
  };

  const onH = (val: number) => {
    setH(val);
    if (keepAspect && orig) setW(Math.round(val * ratio));
  };

  const resize = async () => {
    if (!file) return;
    const img = await fileToImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;

    downloadBlob(blob, `resized-${file.name.replace(/\.[^.]+$/, "")}.png`);
  };

  return (
    <ToolShell title="Image Resizer" description="Resize an image and download as PNG.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        className="block text-sm"
      />

      {orig ? (
        <div className="mt-3 text-sm text-white/70">
          Original: {orig.w} × {orig.h}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm text-white/70">
          Width
          <input
            type="number"
            min={1}
            value={w}
            onChange={(e) => onW(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Height
          <input
            type="number"
            min={1}
            value={h}
            onChange={(e) => onH(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80 md:mt-6">
          <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
          Keep aspect ratio
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={resize}
          disabled={!file}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download Resized PNG
        </button>
      </div>

      {previewUrl ? (
        <img src={previewUrl} alt="preview" className="mt-4 max-h-64 rounded-xl border border-white/10 object-contain" />
      ) : null}
    </ToolShell>
  );
}
