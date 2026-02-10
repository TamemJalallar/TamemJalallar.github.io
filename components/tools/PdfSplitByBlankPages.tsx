"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob } from "./tool-utils";
import { PDFDocument } from "pdf-lib";

const isBlankPage = (pixels: Uint8ClampedArray, threshold: number) => {
  let bright = 0;
  const total = pixels.length / 4;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 255;
    const g = pixels[i + 1] ?? 255;
    const b = pixels[i + 2] ?? 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance >= threshold) bright += 1;
  }
  return bright / total >= 0.985;
};

export default function PdfSplitByBlankPages() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.96);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [splits, setSplits] = useState<{ start: number; end: number; blob: Blob }[]>([]);

  const split = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setSplits([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const blankPages: number[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await (page.render as any)({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (isBlankPage(imageData.data, threshold)) {
          blankPages.push(i);
        }
      }

      if (!blankPages.length) {
        setError("No blank pages detected.");
        return;
      }

      const originalBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(originalBytes);
      const totalPages = sourcePdf.getPageCount();

      const splitRanges: { start: number; end: number }[] = [];
      let start = 0;
      for (const blankPage of blankPages) {
        const end = blankPage - 2;
        if (end >= start) splitRanges.push({ start, end });
        start = blankPage; // skip blank page (0-based index)
      }
      if (start < totalPages) splitRanges.push({ start, end: totalPages - 1 });

      const results: { start: number; end: number; blob: Blob }[] = [];
      for (const range of splitRanges) {
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(
          sourcePdf,
          Array.from({ length: range.end - range.start + 1 }, (_, idx) => range.start + idx),
        );
        pages.forEach((page) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        results.push({ start: range.start, end: range.end, blob: new Blob([bytes], { type: "application/pdf" }) });
      }

      setSplits(results);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to split PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Smart PDF Split (Blank Pages)"
      description="Split a PDF into sections using blank pages as separators."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setSplits([]);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Blank threshold
          <input
            type="number"
            min={0.9}
            max={0.99}
            step={0.01}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value) || 0.96)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void split()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Splitting..." : "Split"}
        </button>
      </div>

      {splits.length ? (
        <div className="mt-4 grid gap-3">
          {splits.map((item, idx) => (
            <div
              key={`${item.start}-${item.end}-${idx}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <div className="text-xs text-white/70">Section {idx + 1}</div>
                <div className="text-[11px] text-white/50">
                  Pages {item.start + 1}–{item.end + 1}
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(item.blob, `section-${idx + 1}.pdf`)}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
