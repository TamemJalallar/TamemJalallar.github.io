"use client";

import { useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob } from "./tool-utils";
import { pdfBytesToBlob } from "./_pdfBlob";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) || 0;
  const g = Number.parseInt(normalized.slice(2, 4), 16) || 0;
  const b = Number.parseInt(normalized.slice(4, 6), 16) || 0;
  return { r: r / 255, g: g / 255, b: b / 255 };
};

export default function PdfWatermarkDesigner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });

  const [file, setFile] = useState<File | null>(null);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.35);
  const [rotation, setRotation] = useState(-25);
  const [color, setColor] = useState("#ffffff");
  const [pos, setPos] = useState({ x: 60, y: 60 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadPreview = async (nextFile: File | null) => {
    setFile(nextFile);
    setError("");
    setPreviewSize(null);

    if (!nextFile) return;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await nextFile.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      setPreviewSize({ width: canvas.width, height: canvas.height });
      setPos({ x: canvas.width * 0.2, y: canvas.height * 0.2 });

      await (page.render as any)({
        canvasContext: ctx,
        viewport,
        canvas,
      }).promise;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to render preview.");
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dragRef.current.active = true;
    dragRef.current.offsetX = event.clientX - rect.left - pos.x;
    dragRef.current.offsetY = event.clientY - rect.top - pos.y;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const overlay = overlayRef.current;
    const overlayWidth = overlay?.offsetWidth ?? 0;
    const overlayHeight = overlay?.offsetHeight ?? 0;
    const nextX = clamp(event.clientX - rect.left - dragRef.current.offsetX, 0, rect.width - overlayWidth);
    const nextY = clamp(event.clientY - rect.top - dragRef.current.offsetY, 0, rect.height - overlayHeight);
    setPos({ x: nextX, y: nextY });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const applyWatermark = async () => {
    if (!file || !previewSize) return;

    setBusy(true);
    setError("");

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const colorRgb = hexToRgb(color);

      const xNorm = pos.x / previewSize.width;
      const yNorm = pos.y / previewSize.height;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const x = xNorm * width;
        const y = (1 - yNorm) * height - fontSize;
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          rotate: degrees(rotation),
          opacity,
        });
      });

      const outBytes = await pdfDoc.save();
      const blob = pdfBytesToBlob(outBytes);
      downloadBlob(blob, "watermarked.pdf");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to apply watermark.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF Watermark Designer"
      description="Drag the watermark on the preview, then apply across the PDF."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => void loadPreview(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void applyWatermark()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Applying..." : "Apply Watermark"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm text-white/70">
          Text
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Font size
          <input
            type="number"
            min={8}
            max={120}
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value) || 32)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Opacity
          <input
            type="number"
            min={0.05}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value) || 0.35)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Rotation
          <input
            type="number"
            min={-90}
            max={90}
            value={rotation}
            onChange={(event) => setRotation(Number(event.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="mt-1 h-10 w-16 rounded-md border border-white/10 bg-black/20"
          />
        </label>
      </div>

      <div
        ref={containerRef}
        className="mt-4 relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <canvas ref={canvasRef} className="block w-full" />
        {previewSize ? (
          <div
            ref={overlayRef}
            onPointerDown={onPointerDown}
            className="absolute cursor-move select-none rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90"
            style={{
              left: pos.x,
              top: pos.y,
              opacity,
              color,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {text}
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
