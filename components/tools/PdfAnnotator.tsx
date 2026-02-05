"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfAnnotator() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [note, setNote] = useState("Note goes here");
  const [xPercent, setXPercent] = useState(10);
  const [yPercent, setYPercent] = useState(90);
  const [fontSize, setFontSize] = useState(12);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function addNote() {
    if (!file || !note.trim()) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const pages = doc.getPages();
      const index = Math.min(Math.max(pageNumber, 1), pages.length) - 1;
      const page = pages[index];
      if (!page) throw new Error("Page not found.");

      const font = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);
      const { width, height } = page.getSize();
      const x = (Math.max(0, Math.min(100, xPercent)) / 100) * width;
      const y = (Math.max(0, Math.min(100, yPercent)) / 100) * height;

      page.drawText(note, {
        x,
        y,
        size: fontSize,
        font,
        color: window.PDFLib.rgb(0.1, 0.1, 0.1),
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-annotated.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to annotate PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Annotator</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Add a simple text note to a page (local-only overlay).
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
          Page number
          <input
            type="number"
            min={1}
            value={pageNumber}
            onChange={(event) => setPageNumber(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Font size
          <input
            type="number"
            min={8}
            max={36}
            value={fontSize}
            onChange={(event) => setFontSize(Math.max(8, Number(event.target.value) || 8))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          X position (%)
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
          Y position (%)
          <input
            type="number"
            min={0}
            max={100}
            value={yPercent}
            onChange={(event) => setYPercent(Math.max(0, Math.min(100, Number(event.target.value) || 0)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Note text</label>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="mt-1 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <button
        type="button"
        onClick={() => void addNote()}
        disabled={!file || processing || !note.trim()}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Applying..." : "Add Note"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
