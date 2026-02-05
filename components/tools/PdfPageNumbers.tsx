"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

type Position = "left" | "center" | "right";

export default function PdfPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [position, setPosition] = useState<Position>("right");
  const [includeTotal, setIncludeTotal] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function addNumbers() {
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

      pages.forEach((page: any, idx: number) => {
        const { width } = page.getSize();
        const number = startNumber + idx;
        const label = includeTotal ? `${number} / ${pages.length}` : String(number);
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x = 24;
        if (position === "center") x = (width - textWidth) / 2;
        if (position === "right") x = Math.max(24, width - textWidth - 24);

        page.drawText(label, {
          x,
          y: 24,
          size: fontSize,
          font,
          color: window.PDFLib.rgb(0.2, 0.2, 0.2),
        });
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-numbered.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to add page numbers.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Page Numbers</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Add page numbers to the bottom of each page.
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
          Start number
          <input
            type="number"
            min={1}
            value={startNumber}
            onChange={(event) => setStartNumber(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Font size
          <input
            type="number"
            min={8}
            max={24}
            value={fontSize}
            onChange={(event) => setFontSize(Math.max(8, Number(event.target.value) || 8))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Position
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value as Position)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>

        <label className="mt-6 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
          <input
            type="checkbox"
            checked={includeTotal}
            onChange={(event) => setIncludeTotal(event.target.checked)}
          />
          Include total pages
        </label>
      </div>

      <button
        type="button"
        onClick={() => void addNumbers()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Applying..." : "Add Page Numbers"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
