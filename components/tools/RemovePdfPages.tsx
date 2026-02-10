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

function parsePageList(value: string, max: number) {
  const parts = value
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const pages = new Set<number>();

  for (const part of parts) {
    if (part.includes("-")) {
      const [rawStart, rawEnd] = part.split("-");
      const start = Number(rawStart);
      const end = Number(rawEnd);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error(`Invalid range: ${part}`);
      }
      const step = start <= end ? 1 : -1;
      for (let page = start; step > 0 ? page <= end : page >= end; page += step) {
        if (page < 1 || page > max) throw new Error("Page number out of range.");
        pages.add(page);
      }
    } else {
      const page = Number(part);
      if (!Number.isFinite(page)) throw new Error(`Invalid page: ${part}`);
      if (page < 1 || page > max) throw new Error("Page number out of range.");
      pages.add(page);
    }
  }

  if (!pages.size) throw new Error("Enter at least one page number.");
  return pages;
}

export default function RemovePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [removeInput, setRemoveInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(next: File | null) {
    setFile(next);
    setError("");
    setPageCount(0);
    setRemoveInput("");

    if (!next) return;

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");
      const bytes = await readFileAsArrayBuffer(next);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to read PDF.");
    }
  }

  async function removePages() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const count = doc.getPageCount();
      const removeSet = parsePageList(removeInput, count);

      const outDoc = await window.PDFLib.PDFDocument.create();
      const keepIndices: number[] = [];
      for (let index = 0; index < count; index += 1) {
        if (!removeSet.has(index + 1)) keepIndices.push(index);
      }
      if (!keepIndices.length) throw new Error("Cannot remove all pages.");

      const pages = await outDoc.copyPages(doc, keepIndices);
      pages.forEach((page: any) => outDoc.addPage(page));

      const outBytes = await outDoc.save();
      const blob = pdfBytesToBlob(outBytes);
      downloadBlob(blob, `${sanitizeFilename(file.name)}-removed-pages.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to remove pages.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Remove PDF Pages</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Remove specific pages (use commas or ranges like 2-4).
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => void handleFile(event.target.files?.[0] || null)}
        className="mt-4 block w-full text-xs"
      />

      {pageCount ? (
        <p className="mt-2 text-xs text-black/60 dark:text-white/60">
          Detected {pageCount} page{pageCount === 1 ? "" : "s"}.
        </p>
      ) : null}

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Pages to remove</label>
      <input
        value={removeInput}
        onChange={(event) => setRemoveInput(event.target.value)}
        placeholder="2,4,6-8"
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <button
        type="button"
        onClick={() => void removePages()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Removing..." : "Remove Pages"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
