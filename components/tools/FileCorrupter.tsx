"use client";

import { useMemo, useState } from "react";
import { downloadBlob, formatBytes, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

function secureRandomInt(max: number) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

export default function FileCorrupter() {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState(1);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  const totalBytes = file?.size ?? 0;
  const bytesToCorrupt = useMemo(() => {
    if (!totalBytes) return 0;
    return Math.max(1, Math.floor((percent / 100) * totalBytes));
  }, [percent, totalBytes]);

  async function corrupt() {
    if (!file || !file.size) return;
    setError("");

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const data = new Uint8Array(buffer);

      for (let i = 0; i < bytesToCorrupt; i += 1) {
        const idx = secureRandomInt(data.length);
        data[idx] = secureRandomInt(256);
      }

      setResult(new Blob([data], { type: file.type || "application/octet-stream" }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to corrupt file.");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">File Corrupter</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Mutates random bytes for QA testing. Keep backups of important files.
      </p>

      <input
        type="file"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setResult(null);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      {file ? (
        <div className="mt-3 text-xs text-black/60 dark:text-white/60">
          {file.name} ({formatBytes(file.size)})
        </div>
      ) : null}

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">
        Corrupt {percent}% (~{formatBytes(bytesToCorrupt)})
        <input
          type="range"
          min={1}
          max={20}
          value={percent}
          onChange={(event) => setPercent(Number(event.target.value))}
          className="mt-1 w-full"
        />
      </label>

      <button
        type="button"
        onClick={() => void corrupt()}
        disabled={!file}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        Corrupt file
      </button>

      {result ? (
        <button
          type="button"
          onClick={() =>
            downloadBlob(
              result,
              `${sanitizeFilename(file?.name || "file")}-corrupt.${file?.name.split(".").pop() || "bin"}`,
            )
          }
          className="ml-3 mt-4 rounded-lg border border-gray-300/80 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Download corrupted file
        </button>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
