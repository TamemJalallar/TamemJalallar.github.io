"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";
import { pdfBytesToBlob } from "./_pdfBlob";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfPageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [left, setLeft] = useState(24);
  const [right, setRight] = useState(24);
  const [top, setTop] = useState(24);
  const [bottom, setBottom] = useState(24);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function crop() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const srcDoc = await window.PDFLib.PDFDocument.load(bytes);
      const outDoc = await window.PDFLib.PDFDocument.create();

      for (const page of srcDoc.getPages()) {
        const { width, height } = page.getSize();
        const l = Math.max(0, left);
        const r = Math.max(0, right);
        const t = Math.max(0, top);
        const b = Math.max(0, bottom);

        const box = {
          left: l,
          bottom: b,
          right: Math.max(l + 1, width - r),
          top: Math.max(b + 1, height - t),
        };

        if (box.right <= box.left || box.top <= box.bottom) {
          throw new Error("Crop margins are too large for this page size.");
        }

        const embedded = await outDoc.embedPage(page, box);
        const newPage = outDoc.addPage([embedded.width, embedded.height]);
        newPage.drawPage(embedded, { x: 0, y: 0 });
      }

      const outBytes = await outDoc.save();
      const blob = pdfBytesToBlob(outBytes);
      downloadBlob(blob, `${sanitizeFilename(file.name)}-cropped.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to crop PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Crop & Margins</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Trim margins from each page (values are in points; 72pt = 1 inch).
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

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-black/60 dark:text-white/60">
          Left
          <input
            type="number"
            min={0}
            value={left}
            onChange={(event) => setLeft(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Right
          <input
            type="number"
            min={0}
            value={right}
            onChange={(event) => setRight(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Top
          <input
            type="number"
            min={0}
            value={top}
            onChange={(event) => setTop(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Bottom
          <input
            type="number"
            min={0}
            value={bottom}
            onChange={(event) => setBottom(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void crop()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Cropping..." : "Crop PDF"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
