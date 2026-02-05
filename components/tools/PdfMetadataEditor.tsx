"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

export default function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [creator, setCreator] = useState("");
  const [producer, setProducer] = useState("");
  const [updateDates, setUpdateDates] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function applyMetadata() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);

      if (title.trim()) doc.setTitle(title.trim());
      if (author.trim()) doc.setAuthor(author.trim());
      if (subject.trim()) doc.setSubject(subject.trim());
      if (keywords.trim()) {
        doc.setKeywords(
          keywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        );
      }
      if (creator.trim()) doc.setCreator(creator.trim());
      if (producer.trim()) doc.setProducer(producer.trim());
      if (updateDates) {
        const now = new Date();
        doc.setCreationDate(now);
        doc.setModificationDate(now);
      }

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-metadata.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to update metadata.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Metadata Editor</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Update document metadata locally (title, author, keywords, etc).
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Author
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Keywords (comma separated)
          <input
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Creator
          <input
            value={creator}
            onChange={(event) => setCreator(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Producer
          <input
            value={producer}
            onChange={(event) => setProducer(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <label className="mt-4 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
        <input
          type="checkbox"
          checked={updateDates}
          onChange={(event) => setUpdateDates(event.target.checked)}
        />
        Update creation/modification dates to now
      </label>

      <button
        type="button"
        onClick={() => void applyMetadata()}
        disabled={!file || processing}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Saving..." : "Save Metadata"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
