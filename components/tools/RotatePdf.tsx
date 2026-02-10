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

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function rotate() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      const start = Math.max(1, startPage);
      const end = endPage <= 0 ? pageCount : Math.min(pageCount, endPage);

      if (start > end) throw new Error("Start page must be less than or equal to end page.");

      const pages = doc.getPages();
      for (let index = start - 1; index < end; index += 1) {
        const page = pages[index];
        if (!page) continue;
        page.setRotation(window.PDFLib.degrees(rotation));
      }

      const outBytes = await doc.save();
      const blob = pdfBytesToBlob(outBytes);
      downloadBlob(blob, `${sanitizeFilename(file.name)}-rotated.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to rotate PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Rotate PDF</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Rotate selected pages by 90, 180, or 270 degrees.
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
          Start page
          <input
            type="number"
            min={1}
            value={startPage}
            onChange={(event) => setStartPage(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          End page (0 = all)
          <input
            type="number"
            min={0}
            value={endPage}
            onChange={(event) => setEndPage(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Rotation
          <select
            value={rotation}
            onChange={(event) => setRotation(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {[90, 180, 270].map((deg) => (
              <option key={deg} value={deg}>
                {deg} deg
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => void rotate()}
            disabled={!file || processing}
            className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {processing ? "Rotating..." : "Rotate PDF"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
