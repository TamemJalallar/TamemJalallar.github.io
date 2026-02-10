"use client";

import { useState } from "react";
import {
  canvasToBlob,
  downloadBlob,
  formatBytes,
  loadImageFromFile,
  sanitizeFilename,
} from "./tool-utils";

const FORMATS = [
  { label: "JPG", value: "image/jpeg", ext: "jpg", lossy: true },
  { label: "PNG", value: "image/png", ext: "png", lossy: false },
  { label: "WebP", value: "image/webp", ext: "webp" },
  { label: "AVIF", value: "image/avif", ext: "avif", lossy: true },
];

type ResultItem = {
  name: string;
  blob: Blob;
  size: number;
};

export default function ImageFormatConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState(FORMATS[0]?.value ?? "image/webp");
  const [quality, setQuality] = useState(0.85);
  const [background, setBackground] = useState("#ffffff");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (!files.length) return;
    setProcessing(true);
    setError("");
    setResults([]);

    try {
      const nextResults: ResultItem[] = [];

      for (const file of files) {
        const image = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported.");
        if (format === "image/jpeg") {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(image, 0, 0);

        const formatMeta = FORMATS.find((f) => f.value === format);
        const blob = await canvasToBlob(
          canvas,
          format,
          formatMeta?.lossy ? quality : undefined,
        );
        const ext = formatMeta?.ext ?? "img";
        nextResults.push({
          name: `${sanitizeFilename(file.name)}.${ext}`,
          blob,
          size: blob.size,
        });
      }

      setResults(nextResults);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to convert images.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Image Format Converter</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Convert images to JPG, PNG, WebP, or AVIF using local processing.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          setFiles(Array.from(event.target.files ?? []));
          setResults([]);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            {FORMATS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quality
          <input
            type="number"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(event) => setQuality(Math.max(0.1, Math.min(1, Number(event.target.value) || 0.85)))}
            disabled={!FORMATS.find((f) => f.value === format)?.lossy}
            className="ml-2 w-20 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs disabled:opacity-50 dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        {format === "image/jpeg" ? (
          <label className="flex items-center gap-2">
            Background
            <input
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-8 w-10 rounded-md border border-gray-300/70 bg-white dark:border-white/20 dark:bg-grey-900"
            />
          </label>
        ) : null}
        <button
          type="button"
          onClick={() => void convert()}
          disabled={!files.length || processing}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {processing ? "Converting..." : "Convert"}
        </button>
      </div>

      {results.length ? (
        <div className="mt-4 space-y-2">
          {results.map((result) => (
            <div
              key={result.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2 text-sm dark:border-white/10 dark:bg-grey-900/70"
            >
              <div>
                <div className="text-xs text-black/60 dark:text-white/60">{result.name}</div>
                <div className="text-[11px] text-black/40 dark:text-white/40">
                  {formatBytes(result.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(result.blob, result.name)}
                className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
