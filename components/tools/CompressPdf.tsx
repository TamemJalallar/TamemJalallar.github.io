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

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const savings = useMemo(() => {
    if (!file || !result) return null;
    const saved = Math.max(file.size - result.size, 0);
    const percent = file.size ? (saved / file.size) * 100 : 0;
    return { saved, percent };
  }, [file, result]);

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const compressedBytes = await doc.save();
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      setResult(blob);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to compress PDF.");
      setResult(null);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Compress PDF</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Re-saves the PDF locally to reduce size where possible. Results vary by file.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setResult(null);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <button
        type="button"
        onClick={() => void compress()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Compressing..." : "Compress PDF"}
      </button>

      {file ? (
        <div className="mt-3 text-xs text-black/60 dark:text-white/60">
          Original: {formatBytes(file.size)}
        </div>
      ) : null}

      {result ? (
        <div className="mt-3 space-y-2 text-xs text-black/60 dark:text-white/60">
          <div>Compressed: {formatBytes(result.size)}</div>
          {savings ? (
            <div className="text-emerald-700 dark:text-emerald-300">
              Saved {formatBytes(savings.saved)} ({savings.percent.toFixed(1)}%)
            </div>
          ) : null}
          <button
            type="button"
            onClick={() =>
              downloadBlob(result, `${sanitizeFilename(file?.name || "document")}-compressed.pdf`)
            }
            className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
          >
            Download compressed PDF
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
