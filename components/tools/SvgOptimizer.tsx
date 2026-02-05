"use client";

import { useMemo, useState } from "react";
import { copyToClipboard, downloadBlob } from "./tool-utils";

function optimizeSvg(input: string) {
  return input
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<\?xml([\s\S]*?)\?>/g, "")
    .replace(/<metadata([\s\S]*?)<\/metadata>/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function SvgOptimizer() {
  const [input, setInput] = useState("<svg width=\"100\" height=\"100\"></svg>");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => optimizeSvg(input), [input]);
  const originalSize = input.length;
  const optimizedSize = output.length;

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">SVG Optimizer</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input SVG</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-1 min-h-40 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-3 text-xs text-black/60 dark:text-white/60">
        {originalSize.toLocaleString()} chars → {optimizedSize.toLocaleString()} chars
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Optimized SVG</label>
      <textarea
        readOnly
        value={output}
        className="mt-1 min-h-40 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />

      <button
        type="button"
        onClick={() => downloadBlob(new Blob([output], { type: "image/svg+xml" }), "optimized.svg")}
        className="mt-3 rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
      >
        Download SVG
      </button>
    </div>
  );
}
