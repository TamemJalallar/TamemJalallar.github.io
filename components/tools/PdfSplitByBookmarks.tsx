"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, sanitizeFilename } from "./tool-utils";
import { pdfBytesToBlob } from "./_pdfBlob";
import { PDFDocument } from "pdf-lib";

type SplitResult = {
  title: string;
  start: number;
  end: number;
  blob: Blob;
};

type OutlineItem = {
  title: string;
  dest?: any;
  items?: OutlineItem[];
};

export default function PdfSplitByBookmarks() {
  const [file, setFile] = useState<File | null>(null);
  const [splits, setSplits] = useState<SplitResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      const outline = (await pdf.getOutline()) as OutlineItem[] | null;

      if (!outline || !outline.length) {
        setError("No bookmarks found in this PDF.");
        return;
      }

      const entries: { title: string; dest: any; pageIndex: number }[] = [];

      const flatten = (items: OutlineItem[]) => {
        items.forEach((item) => {
          if (item.dest) {
            entries.push({ title: item.title, dest: item.dest, pageIndex: 0 });
          }
          if (item.items?.length) flatten(item.items);
        });
      };

      flatten(outline);

      for (const entry of entries) {
        let destination = entry.dest;
        if (typeof destination === "string") {
          destination = await pdf.getDestination(destination);
        }
        if (!destination) continue;
        const ref = destination[0];
        const pageIndex = await pdf.getPageIndex(ref);
        entry.pageIndex = pageIndex;
      }

      const filtered = entries
        .filter((e) => Number.isFinite(e.pageIndex))
        .sort((a, b) => a.pageIndex - b.pageIndex);

      const unique: { title: string; pageIndex: number }[] = [];
      const seen = new Set<number>();
      for (const entry of filtered) {
        if (seen.has(entry.pageIndex)) continue;
        seen.add(entry.pageIndex);
        unique.push(entry);
      }

      if (!unique.length) {
        setError("Could not resolve bookmark destinations.");
        return;
      }

      const originalBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(originalBytes);
      const totalPages = sourcePdf.getPageCount();

      const results: SplitResult[] = [];

      for (let i = 0; i < unique.length; i += 1) {
        const start = unique[i]?.pageIndex ?? 0;
        const end = (unique[i + 1]?.pageIndex ?? totalPages) - 1;
        if (start > end) continue;

        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(
          sourcePdf,
          Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
        );
        pages.forEach((page) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        results.push({
          title: unique[i]?.title || `Section ${i + 1}`,
          start,
          end,
          blob: pdfBytesToBlob(bytes),
        });
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
      title="PDF Split by Bookmarks"
      description="Split a PDF using its bookmark outline."
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
          {splits.map((splitItem, idx) => (
            <div
              key={`${splitItem.title}-${idx}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <div className="text-xs text-white/70">{splitItem.title}</div>
                <div className="text-[11px] text-white/50">
                  Pages {splitItem.start + 1}–{splitItem.end + 1}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    splitItem.blob,
                    `${sanitizeFilename(splitItem.title) || "section"}.pdf`,
                  )
                }
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
