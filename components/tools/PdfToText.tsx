"use client";

import { useState } from "react";
import { copyToClipboard, downloadBlob, sanitizeFilename } from "./tool-utils";

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [includePageHeaders, setIncludePageHeaders] = useState(true);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError("");
    setText("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const chunks: string[] = [];

      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines = (content.items as any[]).map((item) => item.str).filter(Boolean);
        const pageText = lines.join(" ");
        if (includePageHeaders) {
          chunks.push(`Page ${i}`);
          chunks.push(pageText);
          chunks.push("");
        } else {
          chunks.push(pageText);
        }
      }

      setText(chunks.join("\n"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to extract text.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function download() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    downloadBlob(blob, `${sanitizeFilename(file?.name || "document")}.txt`);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">PDF to Text</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!text}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={!text}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Download .txt
        </button>
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setText("");
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={includePageHeaders}
            onChange={(event) => setIncludePageHeaders(event.target.checked)}
          />
          Include page headers
        </label>
        <button
          type="button"
          onClick={() => void convert()}
          disabled={!file || busy}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {busy ? "Extracting..." : "Extract Text"}
        </button>
      </div>

      <textarea
        value={text}
        readOnly
        placeholder="Extracted text will appear here."
        className="mt-4 min-h-56 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
