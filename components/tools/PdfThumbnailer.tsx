"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";

export default function PdfThumbnailer() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(0.6);

  const generate = async () => {
    if (!file) return;
    setBusy(true);
    setThumbs([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const out: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

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

        out.push(canvas.toDataURL("image/png"));
      }

      setThumbs(out);
    } catch (err) {
      console.error(err);
      alert("PDF thumbnailing failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF Thumbnailer"
      description="Generate a quick grid of PDF page thumbnails."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Scale
          <select
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {[0.4, 0.6, 0.8, 1].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={generate}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Generating..." : "Generate"}
        </button>
      </div>

      {thumbs.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {thumbs.map((src, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="mb-2 text-xs text-white/60">Page {idx + 1}</div>
              <img src={src} alt={`page ${idx + 1}`} className="w-full rounded-lg border border-white/10" />
            </div>
          ))}
        </div>
      ) : null}
    </ToolShell>
  );
}
