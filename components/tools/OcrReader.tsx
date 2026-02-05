"use client";

import { useState } from "react";

export default function OcrReader() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">OCR Reader</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Extract text from images. This tool needs an OCR engine to run locally.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="mt-4 block w-full text-xs"
      />

      <button
        type="button"
        disabled
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white opacity-50 dark:bg-white dark:text-black"
      >
        Run OCR
      </button>

      <p className="mt-3 text-xs text-black/50 dark:text-white/50">
        OCR requires a dependency (for example, tesseract.js). If you want full OCR support,
        tell me and I will wire it in.
      </p>

      <textarea
        value={file ? "OCR output will appear here once enabled." : ""}
        readOnly
        className="mt-3 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />
    </div>
  );
}
