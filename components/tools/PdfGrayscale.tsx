"use client";

import { useState } from "react";
import { canvasToBlob, downloadBlob, loadScript, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfGrayscale() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1.5);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  async function convert() {
    if (!file) return;
    setProcessing(true);
    setError("");
    setProgress(null);

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const outDoc = await window.PDFLib.PDFDocument.create();

      const total = pdf.numPages;
      setProgress({ current: 0, total });

      for (let i = 1; i <= total; i += 1) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        ctx.filter = "grayscale(1)";

        await (page.render as any)({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        const blob = await canvasToBlob(canvas, "image/png");
        const pngBytes = await blob.arrayBuffer();
        const image = await outDoc.embedPng(pngBytes);

        const newPage = outDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });

        setProgress({ current: i, total });
      }

      const outBytes = await outDoc.save();
      const outBlob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(outBlob, `${sanitizeFilename(file.name)}-grayscale.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to convert PDF.");
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Grayscale</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Render pages to grayscale (flattened output).
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

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Render scale
          <select
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            {[1, 1.5, 2].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={() => void convert()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Converting..." : "Convert to Grayscale"}
      </button>

      {progress ? (
        <p className="mt-3 text-xs text-black/60 dark:text-white/60">
          Processing page {progress.current} / {progress.total}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
