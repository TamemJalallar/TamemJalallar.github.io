"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureText, setSignatureText] = useState("Signed by ...");
  const [pageNumber, setPageNumber] = useState(1);
  const [xPercent, setXPercent] = useState(10);
  const [yPercent, setYPercent] = useState(10);
  const [width, setWidth] = useState(180);
  const [fontSize, setFontSize] = useState(14);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function sign() {
    if (!file) return;
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

      const { width: pageWidth, height: pageHeight } = page.getSize();
      const x = (Math.max(0, Math.min(100, xPercent)) / 100) * pageWidth;
      const y = (Math.max(0, Math.min(100, yPercent)) / 100) * pageHeight;

      if (signatureFile) {
        const imgBytes = await readFileAsArrayBuffer(signatureFile);
        const isPng = signatureFile.type.includes("png");
        const image = isPng
          ? await doc.embedPng(imgBytes)
          : await doc.embedJpg(imgBytes);
        const scale = width / image.width;
        const height = image.height * scale;
        page.drawImage(image, {
          x,
          y,
          width,
          height,
        });
      } else if (signatureText.trim()) {
        const font = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);
        page.drawText(signatureText, {
          x,
          y,
          size: fontSize,
          font,
          color: window.PDFLib.rgb(0.1, 0.1, 0.1),
        });
      } else {
        throw new Error("Provide a signature image or text.");
      }

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-signed.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to sign PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Sign PDF</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Add a visual signature (not a cryptographic signature).
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
          Signature image (PNG/JPG)
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => setSignatureFile(event.target.files?.[0] || null)}
            className="mt-1 block w-full text-xs"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Signature text (used if no image)
          <input
            value={signatureText}
            onChange={(event) => setSignatureText(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
        <label className="text-xs text-black/60 dark:text-white/60">
          Image width (px)
          <input
            type="number"
            min={60}
            max={400}
            value={width}
            onChange={(event) => setWidth(Math.max(60, Number(event.target.value) || 60))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Text font size
          <input
            type="number"
            min={10}
            max={32}
            value={fontSize}
            onChange={(event) => setFontSize(Math.max(10, Number(event.target.value) || 10))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void sign()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Signing..." : "Apply Signature"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
