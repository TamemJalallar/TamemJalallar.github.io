"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob } from "./tool-utils";
import { PDFDocument } from "pdf-lib";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) || 0;
  const g = Number.parseInt(normalized.slice(2, 4), 16) || 0;
  const b = Number.parseInt(normalized.slice(4, 6), 16) || 0;
  return { r, g, b };
};

export default function PdfRedactByColor() {
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState("#ff0000");
  const [tolerance, setTolerance] = useState(18);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const redact = async () => {
    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const outPdf = await PDFDocument.create();
      const target = hexToRgb(color);
      const cutoff = clamp(tolerance, 0, 100) * 2.55;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

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
        const pixels = imageData.data;

        for (let p = 0; p < pixels.length; p += 4) {
          const r = pixels[p] ?? 0;
          const g = pixels[p + 1] ?? 0;
          const b = pixels[p + 2] ?? 0;
          const dr = r - target.r;
          const dg = g - target.g;
          const db = b - target.b;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          if (dist <= cutoff) {
            pixels[p] = 0;
            pixels[p + 1] = 0;
            pixels[p + 2] = 0;
            pixels[p + 3] = 255;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");
        const bytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
        const embedded = await outPdf.embedPng(bytes);
        const pageWidth = page.getViewport({ scale: 1 }).width;
        const pageHeight = page.getViewport({ scale: 1 }).height;
        const outPage = outPdf.addPage([pageWidth, pageHeight]);
        outPage.drawImage(embedded, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
        });
      }

      const outBytes = await outPdf.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, "redacted.pdf");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to redact PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF Redact by Color"
      description="Remove pixels matching a color and export a new PDF."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-white/70">
          Color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>

        <label className="text-sm text-white/70">
          Tolerance
          <input
            type="range"
            min={0}
            max={100}
            value={tolerance}
            onChange={(event) => setTolerance(Number(event.target.value) || 0)}
            className="ml-2"
          />
          <span className="ml-2 text-xs text-white/50">{tolerance}</span>
        </label>

        <button
          type="button"
          onClick={() => void redact()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Redacting..." : "Redact"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
