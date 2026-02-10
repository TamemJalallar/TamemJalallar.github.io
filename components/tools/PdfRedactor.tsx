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

export default function PdfRedactor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(0);
  const [xPercent, setXPercent] = useState(10);
  const [yPercent, setYPercent] = useState(10);
  const [widthPercent, setWidthPercent] = useState(30);
  const [heightPercent, setHeightPercent] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function redact() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const pages = doc.getPages();
      const total = pages.length;
      const start = Math.max(1, pageStart);
      const end = pageEnd <= 0 ? total : Math.min(total, pageEnd);
      if (start > end) throw new Error("Start page must be less than or equal to end page.");

      const xPct = Math.max(0, Math.min(100, xPercent)) / 100;
      const yPct = Math.max(0, Math.min(100, yPercent)) / 100;
      const wPct = Math.max(1, Math.min(100, widthPercent)) / 100;
      const hPct = Math.max(1, Math.min(100, heightPercent)) / 100;

      for (let i = start - 1; i < end; i += 1) {
        const page = pages[i];
        if (!page) continue;
        const { width, height } = page.getSize();
        const x = xPct * width;
        const y = yPct * height;
        const rectWidth = wPct * width;
        const rectHeight = hPct * height;

        page.drawRectangle({
          x,
          y,
          width: rectWidth,
          height: rectHeight,
          color: window.PDFLib.rgb(0, 0, 0),
          opacity: 1,
        });
      }

      const outBytes = await doc.save();
      const blob = pdfBytesToBlob(outBytes);
      downloadBlob(blob, `${sanitizeFilename(file.name)}-redacted.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to redact PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Redactor</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Add black rectangles to cover content. This is a visual mask only.
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
          Start page
          <input
            type="number"
            min={1}
            value={pageStart}
            onChange={(event) => setPageStart(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          End page (0 = all)
          <input
            type="number"
            min={0}
            value={pageEnd}
            onChange={(event) => setPageEnd(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          X (%) from left
          <input
            type="number"
            min={0}
            max={100}
            value={xPercent}
            onChange={(event) => setXPercent(Math.max(0, Math.min(100, Number(event.target.value) || 0)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Y (%) from bottom
          <input
            type="number"
            min={0}
            max={100}
            value={yPercent}
            onChange={(event) => setYPercent(Math.max(0, Math.min(100, Number(event.target.value) || 0)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Width (%)
          <input
            type="number"
            min={1}
            max={100}
            value={widthPercent}
            onChange={(event) => setWidthPercent(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Height (%)
          <input
            type="number"
            min={1}
            max={100}
            value={heightPercent}
            onChange={(event) => setHeightPercent(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void redact()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Redacting..." : "Apply Redaction"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
