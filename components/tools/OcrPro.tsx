"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard, formatBytes } from "./tool-utils";

const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ita", label: "Italian" },
];

type WorkerRef = {
  worker: any | null;
  lang: string | null;
};

export default function OcrPro() {
  const workerRef = useRef<WorkerRef>({ worker: null, lang: null });
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (workerRef.current.worker) {
        workerRef.current.worker.terminate();
        workerRef.current.worker = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(timer);
  }, [copied]);

  const runOcr = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setError("");
    setText("");

    try {
      const { createWorker } = await import("tesseract.js");
      let worker = workerRef.current.worker;

      if (!worker) {
        worker = await createWorker({
          logger: (message: { status: string; progress?: number }) => {
            if (message.status === "recognizing text" && typeof message.progress === "number") {
              setProgress(Math.round(message.progress * 100));
            }
          },
        });
        workerRef.current.worker = worker;
      }

      if (workerRef.current.lang !== language) {
        await worker.loadLanguage(language);
        await worker.initialize(language);
        workerRef.current.lang = language;
      }

      const result = await worker.recognize(file);
      setText(result?.data?.text?.trim() || "No text detected.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "OCR failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) setCopied(true);
  };

  return (
    <ToolShell
      title="OCR Pro"
      description="Extract text from images locally using Tesseract.js."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Language
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void runOcr()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Running..." : "Run OCR"}
        </button>

        <button
          type="button"
          onClick={() => void handleCopy()}
          disabled={!text}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {copied ? "Copied" : "Copy text"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          <div>Type: {file.type || "unknown"}</div>
        </div>
      ) : null}

      {busy ? (
        <div className="mt-4">
          <div className="text-xs text-white/60">Progress: {progress}%</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-emerald-400/80" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      <textarea
        value={text}
        readOnly
        placeholder="OCR output will appear here."
        className="mt-4 min-h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
      />

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
