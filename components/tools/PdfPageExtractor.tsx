"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, downloadUrl } from "./tool-utils";
import { PDFDocument } from "pdf-lib";

type OutputType = "pdf" | "png" | "jpg";

type PageInfo = { index: number; width: number; height: number };

export default function PdfPageExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [output, setOutput] = useState<OutputType>("pdf");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadPdf = async (nextFile: File | null) => {
    setFile(nextFile);
    setPageCount(0);
    setPageNumber(1);
    setError("");
    setPageInfo(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    if (!nextFile) return;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await nextFile.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      setPageCount(pdf.numPages);

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      setPageInfo({ index: 1, width: viewport.width, height: viewport.height });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load PDF.");
    }
  };

  const extract = async () => {
    if (!file || pageNumber < 1 || pageNumber > pageCount) return;
    setBusy(true);
    setError("");

    try {
      if (output === "pdf") {
        const originalBytes = await file.arrayBuffer();
        const source = await PDFDocument.load(originalBytes);
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(source, [pageNumber - 1]);
        pages.forEach((page) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        downloadBlob(blob, `page-${pageNumber}.pdf`);
        return;
      }

      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await (page.render as any)({
        canvasContext: ctx,
        viewport,
        canvas,
      }).promise;
      const dataUrl = canvas.toDataURL(output === "png" ? "image/png" : "image/jpeg", 0.92);
      downloadUrl(dataUrl, `page-${pageNumber}.${output}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to extract page.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF Page Extractor"
      description="Extract a single page as PDF, PNG, or JPG."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => void loadPdf(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Page
          <input
            type="number"
            min={1}
            max={pageCount || 1}
            value={pageNumber}
            onChange={(event) => setPageNumber(Number(event.target.value) || 1)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Output
          <select
            value={output}
            onChange={(event) => setOutput(event.target.value as OutputType)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="pdf">PDF</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => void extract()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Extracting..." : "Extract"}
        </button>
      </div>

      {pageCount ? (
        <div className="mt-3 text-xs text-white/60">
          Pages: {pageCount}
          {pageInfo ? ` · Page size: ${Math.round(pageInfo.width)} × ${Math.round(pageInfo.height)} pt` : ""}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
