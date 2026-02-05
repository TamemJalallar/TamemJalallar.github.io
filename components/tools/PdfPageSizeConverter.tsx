"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

const SIZE_PRESETS: Record<string, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
  Legal: [612, 1008],
};

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfPageSizeConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [scaleToFit, setScaleToFit] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const srcDoc = await window.PDFLib.PDFDocument.load(bytes);
      const outDoc = await window.PDFLib.PDFDocument.create();

      const base = SIZE_PRESETS[preset] ?? SIZE_PRESETS.A4;
      const targetSize: [number, number] =
        orientation === "portrait" ? base : [base[1], base[0]];

      for (const page of srcDoc.getPages()) {
        const embedded = await outDoc.embedPage(page);
        const [targetWidth, targetHeight] = targetSize;

        const scale = scaleToFit
          ? Math.min(targetWidth / embedded.width, targetHeight / embedded.height)
          : 1;
        const drawWidth = embedded.width * scale;
        const drawHeight = embedded.height * scale;
        const x = (targetWidth - drawWidth) / 2;
        const y = (targetHeight - drawHeight) / 2;

        const newPage = outDoc.addPage([targetWidth, targetHeight]);
        newPage.drawPage(embedded, {
          x,
          y,
          xScale: scale,
          yScale: scale,
        });
      }

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-${preset.toLowerCase()}.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to resize PDF pages.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Page Size Converter</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Convert pages to standard sizes like A4, Letter, or Legal.
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

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-black/60 dark:text-white/60">
          Preset
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {Object.keys(SIZE_PRESETS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Orientation
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as "portrait" | "landscape")}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>

        <label className="mt-6 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
          <input
            type="checkbox"
            checked={scaleToFit}
            onChange={(event) => setScaleToFit(event.target.checked)}
          />
          Scale to fit
        </label>
      </div>

      <button
        type="button"
        onClick={() => void convert()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Converting..." : "Convert Page Size"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
