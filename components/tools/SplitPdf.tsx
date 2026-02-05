"use client";

import { useMemo, useState } from "react";
import {
  downloadBlob,
  formatBytes,
  loadScript,
  readFileAsArrayBuffer,
  sanitizeFilename,
} from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

type SplitPage = {
  pageNumber: number;
  blob: Blob;
};

function uint8ToBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SplitPage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(0);

  const totalSize = useMemo(
    () => pages.reduce((sum, page) => sum + page.blob.size, 0),
    [pages],
  );

  async function split() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const source = await window.PDFLib.PDFDocument.load(bytes);
      const pageCount = source.getPageCount();

      const start = Math.max(1, startPage);
      const end = endPage <= 0 ? pageCount : Math.min(pageCount, endPage);

      if (start > end) {
        throw new Error("Start page must be less than or equal to end page.");
      }

      const splitPages: SplitPage[] = [];

      for (let pageIndex = start - 1; pageIndex < end; pageIndex += 1) {
        const newDoc = await window.PDFLib.PDFDocument.create();
        const [page] = await newDoc.copyPages(source, [pageIndex]);
        newDoc.addPage(page);
        const newBytes = await newDoc.save();
        const blob = new Blob([uint8ToBuffer(newBytes)], { type: "application/pdf" });
        splitPages.push({ pageNumber: pageIndex + 1, blob });
      }

      setPages(splitPages);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to split PDF.");
      setPages([]);
    } finally {
      setProcessing(false);
    }
  }

  function downloadAll() {
    const base = sanitizeFilename(file?.name || "document");
    pages.forEach((page, idx) => {
      window.setTimeout(() => {
        downloadBlob(page.blob, `${base}-page-${page.pageNumber}.pdf`);
      }, idx * 120);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Split PDF</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Split a PDF into individual pages or a specific range.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setPages([]);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => void split()}
            disabled={!file || processing}
            className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {processing ? "Splitting..." : "Split PDF"}
          </button>
        </div>
      </div>

      {pages.length ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-black/60 dark:text-white/60">
            <span>{pages.length} page{pages.length === 1 ? "" : "s"} created</span>
            <span>Total size: {formatBytes(totalSize)}</span>
            <button
              type="button"
              onClick={downloadAll}
              className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
            >
              Download all
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                type="button"
                onClick={() =>
                  downloadBlob(
                    page.blob,
                    `${sanitizeFilename(file?.name || "document")}-page-${page.pageNumber}.pdf`,
                  )
                }
                className="rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:border-white/10 dark:bg-grey-900/70 dark:hover:bg-white/10"
              >
                Page {page.pageNumber} ({formatBytes(page.blob.size)})
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
