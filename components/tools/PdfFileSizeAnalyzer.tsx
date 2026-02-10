"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";

const toInches = (points: number) => points / 72;

export default function PdfFileSizeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ width: number; height: number; area: number }[]>([]);
  const [largestImage, setLargestImage] = useState<{ page: number; width: number; height: number } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const analyze = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setPages([]);
    setLargestImage(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const pageSizes: { width: number; height: number; area: number }[] = [];
      let largest: { page: number; width: number; height: number } | null = null;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const width = viewport.width;
        const height = viewport.height;
        pageSizes.push({ width, height, area: width * height });

        try {
          const opList = await page.getOperatorList();
          const ops = (pdfjsLib as any).OPS || {};
          const imageOps = new Set([
            ops.paintImageXObject,
            ops.paintImageXObjectRepeat,
            ops.paintInlineImageXObject,
          ]);

          for (let j = 0; j < opList.fnArray.length; j++) {
            const fnId = opList.fnArray[j];
            if (!imageOps.has(fnId)) continue;
            const args = opList.argsArray[j];
            const imageName = args?.[0];
            const image = await resolvePageImage(page as any, imageName);
            if (image && image.width && image.height) {
              if (!largest || image.width * image.height > largest.width * largest.height) {
                largest = { page: i, width: image.width, height: image.height };
              }
            }
          }
        } catch {
          // best effort
        }
      }

      setPages(pageSizes);
      setLargestImage(largest);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to analyze PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="PDF File Size Analyzer"
      description="Inspect page dimensions and estimate the largest embedded image."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setPages([]);
            setLargestImage(null);
            setError("");
          }}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void analyze()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {pages.length ? (
        <div className="mt-4 space-y-2">
          {pages.map((page, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
              <div>Page {idx + 1}</div>
              <div className="text-xs text-white/50">
                {page.width.toFixed(0)} × {page.height.toFixed(0)} pt · {toInches(page.width).toFixed(2)} × {toInches(page.height).toFixed(2)} in
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {largestImage ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          Largest image: Page {largestImage.page} · {largestImage.width} × {largestImage.height} px
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}

async function resolvePageImage(page: any, name: any) {
  if (!page?.objs || !name) return null;
  const objs = page.objs;
  if (typeof objs.get !== "function") return null;

  try {
    const obj = objs.get(name);
    if (obj) return obj;
  } catch {
    // ignore
  }

  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) resolve(null);
    }, 200);

    try {
      if (objs.get.length >= 2) {
        objs.get(name, (obj: any) => {
          resolved = true;
          clearTimeout(timeout);
          resolve(obj || null);
        });
      } else {
        clearTimeout(timeout);
        resolve(null);
      }
    } catch {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}
