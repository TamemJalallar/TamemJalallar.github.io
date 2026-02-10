"use client";

import React, { useState } from "react";
import { pdfBytesToBlob } from "./_pdfBlob";
import ToolShell from "./_ToolShell";

export default function MergePdfs() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const merge = async () => {
    if (files.length < 2) return;
    setBusy(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const outDoc = await PDFDocument.create();

      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await outDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => outDoc.addPage(p));
      }

      const mergedBytes: Uint8Array = await outDoc.save();
      const blob = pdfBytesToBlob(mergedBytes);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    } catch (err) {
      console.error(err);
      alert("Merge failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Merge PDFs" description="Select multiple PDFs and merge them into one file.">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="block text-sm"
      />

      <div className="mt-3 text-sm text-white/70">
        {files.length ? `${files.length} file(s) selected` : "Select at least 2 PDFs."}
      </div>

      {files.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
          {files.map((f) => (
            <li key={`${f.name}-${f.lastModified}`}>{f.name}</li>
          ))}
        </ul>
      ) : null}

      <button
        onClick={merge}
        disabled={files.length < 2 || busy}
        className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
      >
        {busy ? "Merging..." : "Merge & Download"}
      </button>
    </ToolShell>
  );
}
