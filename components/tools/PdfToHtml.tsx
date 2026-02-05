"use client";

import { useState } from "react";
import { copyToClipboard, downloadBlob, sanitizeFilename } from "./tool-utils";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function PdfToHtml() {
  const [file, setFile] = useState<File | null>(null);
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError("");
    setHtml("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { configurePdfJsWorker } = await import("./_pdfjsWorker");
      await configurePdfJsWorker(pdfjsLib);

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const sections: string[] = [];

      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines = (content.items as any[]).map((item) => item.str).filter(Boolean);
        const pageText = escapeHtml(lines.join(" "));
        sections.push(`<section><h2>Page ${i}</h2><p>${pageText}</p></section>`);
      }

      const doc = [
        "<!doctype html>",
        "<html>",
        "<head>",
        "<meta charset=\"utf-8\" />",
        "<title>PDF Export</title>",
        "<style>body{font-family:Arial,sans-serif;line-height:1.5;padding:24px;}section{margin-bottom:24px;}h2{font-size:18px;margin:0 0 8px;}</style>",
        "</head>",
        "<body>",
        sections.join("\n"),
        "</body>",
        "</html>",
      ].join("\n");

      setHtml(doc);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to extract HTML.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!html) return;
    const ok = await copyToClipboard(html);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function download() {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    downloadBlob(blob, `${sanitizeFilename(file?.name || "document")}.html`);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">PDF to HTML</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!html}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={!html}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Download .html
        </button>
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setHtml("");
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <button
        type="button"
        onClick={() => void convert()}
        disabled={!file || busy}
        className="mt-3 rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {busy ? "Extracting..." : "Extract HTML"}
      </button>

      <textarea
        value={html}
        readOnly
        placeholder="Extracted HTML will appear here."
        className="mt-4 min-h-56 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-xs dark:border-white/20 dark:bg-grey-900"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
