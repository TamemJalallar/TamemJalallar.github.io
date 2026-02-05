"use client";

import { useMemo, useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

function uint8ToBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const fileCount = useMemo(() => files.length, [files]);

  async function convert() {
    if (!files.length) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const doc = await window.PDFLib.PDFDocument.create();

      for (const file of files) {
        const bytes = await readFileAsArrayBuffer(file);
        const isPng = file.type.includes("png") || file.name.toLowerCase().endsWith(".png");
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const { width, height } = image.scale(1);

        const page = doc.addPage([width, height]);
        page.drawImage(image, { x: 0, y: 0, width, height });
      }

      const pdfBytes = await doc.save();
      setResult(new Blob([uint8ToBuffer(pdfBytes)], { type: "application/pdf" }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to create PDF from images.");
      setResult(null);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Images to PDF</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Combine JPG/PNG images into a single PDF. Order matches the file picker.
      </p>

      <input
        type="file"
        accept="image/png,image/jpeg"
        multiple
        onChange={(event) => {
          setFiles(Array.from(event.target.files || []));
          setResult(null);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      {fileCount ? (
        <div className="mt-3 text-xs text-black/60 dark:text-white/60">
          {fileCount} image{fileCount === 1 ? "" : "s"} selected
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void convert()}
        disabled={!files.length || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Building PDF..." : "Create PDF"}
      </button>

      {result ? (
        <button
          type="button"
          onClick={() =>
            downloadBlob(result, `${sanitizeFilename(files[0]?.name || "images")}.pdf`)
          }
          className="ml-3 mt-4 rounded-lg border border-gray-300/80 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Download PDF
        </button>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
