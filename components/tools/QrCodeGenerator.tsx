"use client";

import { useState } from "react";
import { copyToClipboard, downloadUrl, loadScript } from "./tool-utils";

const QR_URL = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";

declare global {
  interface Window {
    QRCode?: {
      toDataURL: (text: string, options?: { width?: number; margin?: number }) => Promise<string>;
    };
  }
}

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(240);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError("");
    setDataUrl("");
    try {
      await loadScript(QR_URL);
      if (!window.QRCode) throw new Error("QR generator failed to load.");
      const url = await window.QRCode.toDataURL(text, { width: size, margin: 1 });
      setDataUrl(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to generate QR code.");
    }
  }

  async function copy() {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Text or URL</label>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-1 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Size
          <input
            type="number"
            min={120}
            max={800}
            value={size}
            onChange={(event) => setSize(Math.max(120, Number(event.target.value) || 120))}
            className="ml-2 w-20 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <button
          type="button"
          onClick={() => void generate()}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy text"}
        </button>
      </div>

      {dataUrl ? (
        <div className="mt-4 space-y-3">
          <img src={dataUrl} alt="QR code" className="h-48 w-48 rounded-xl border border-gray-200/80" />
          <button
            type="button"
            onClick={() => downloadUrl(dataUrl, "qr-code.png")}
            className="rounded-lg border border-gray-300/80 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
          >
            Download PNG
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
