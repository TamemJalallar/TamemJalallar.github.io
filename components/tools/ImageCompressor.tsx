"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, fileToImage } from "./_imageUtils";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const meta = useMemo(() => {
    if (!file) return null;
    return { name: file.name, sizeKB: Math.round(file.size / 1024) };
  }, [file]);

  const onPick = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const compress = async () => {
    if (!file) return;
    const img = await fileToImage(file);

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    // Use JPEG for real compression
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", quality)
    );
    if (!blob) return;

    downloadBlob(blob, `compressed-${file.name.replace(/\.[^.]+$/, "")}.jpg`);
  };

  return (
    <ToolShell title="Image Compressor" description="Compress to JPEG using a quality slider.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        className="block text-sm"
      />

      {meta ? (
        <div className="mt-3 text-sm text-white/70">
          Selected: {meta.name} · {meta.sizeKB} KB
        </div>
      ) : null}

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
          onClick={compress}
          disabled={!file}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download Compressed JPG
        </button>
      </div>

      {previewUrl ? (
        <img src={previewUrl} alt="preview" className="mt-4 max-h-64 rounded-xl border border-white/10 object-contain" />
      ) : null}
    </ToolShell>
  );
}
