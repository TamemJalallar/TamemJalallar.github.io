"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadUrl } from "./tool-utils";

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(2);

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setImages([]);

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

        out.push(canvas.toDataURL("image/jpeg", 0.92));
      }

      setImages(out);
    } catch (err) {
      console.error(err);
      alert("PDF conversion failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  const download = (dataUrl: string, name: string) => {
    downloadUrl(dataUrl, name);
  };

  return (
    <ToolShell title="PDF → JPG" description="Convert each PDF page into a JPG image.">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Scale
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {[1, 1.5, 2, 3].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={convert}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Converting..." : "Convert"}
        </button>
      </div>

      {images.length ? (
        <div className="mt-4 grid gap-3">
          {images.map((src, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="text-white/70">Page {idx + 1}</div>
                <button
                  onClick={() => download(src, `page-${idx + 1}.jpg`)}
                  className="rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10"
                >
                  Download
                </button>
              </div>
              <img
                src={src}
                alt={`page ${idx + 1}`}
                className="w-full rounded-lg border border-white/10"
              />
            </div>
          ))}
        </div>
      ) : null}
    </ToolShell>
  );
}
