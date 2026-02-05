"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

function buildSlug(value: string, separator: string, lower: boolean, trim: boolean) {
  let text = value;
  if (trim) text = text.trim();
  if (lower) text = text.toLowerCase();

  text = text.replace(/[^a-z0-9\s-]/g, "");
  text = text.replace(/[\s_-]+/g, separator);

  const escaped = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  text = text.replace(new RegExp(`^${escaped}+|${escaped}+$`, "g"), "");

  return text;
}

export default function SlugGenerator() {
  const [input, setInput] = useState("My New Blog Post");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => buildSlug(input, separator, lowercase, trim),
    [input, separator, lowercase, trim],
  );

  async function copy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Slug Generator</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-1 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Separator
          <input
            value={separator}
            onChange={(event) => setSeparator(event.target.value || "-")}
            className="ml-2 w-12 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={lowercase} onChange={(event) => setLowercase(event.target.checked)} />
          Lowercase
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} />
          Trim spaces
        </label>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Slug</label>
      <input
        readOnly
        value={output}
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />
    </div>
  );
}
