"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [size, setSize] = useState(48);
  const [opacity, setOpacity] = useState(0.2);
  const [angle, setAngle] = useState(45);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function applyWatermark() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const font = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);
      const pages = doc.getPages();

      pages.forEach((page: any) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const x = Math.max(12, (width - textWidth) / 2);
        const y = height / 2;
        page.drawText(text, {
          x,
          y,
          size,
          font,
          rotate: window.PDFLib.degrees(angle),
          color: window.PDFLib.rgb(0.4, 0.4, 0.4),
          opacity,
        });
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-watermarked.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to watermark PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Watermark</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Add a watermark to every page (local only).
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Watermark text
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Font size
          <input
            type="number"
            min={8}
            max={120}
            value={size}
            onChange={(event) => setSize(Math.max(8, Number(event.target.value) || 8))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Opacity (0.05 - 0.8)
          <input
            type="number"
            min={0.05}
            max={0.8}
            step={0.05}
            value={opacity}
            onChange={(event) => setOpacity(Math.max(0.05, Math.min(0.8, Number(event.target.value) || 0.2)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Angle
          <input
            type="number"
            min={-90}
            max={90}
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void applyWatermark()}
        disabled={!file || processing || !text.trim()}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Applying..." : "Apply Watermark"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
