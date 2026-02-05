"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("alpha\nbeta\nalpha\nGamma\nGamma\n");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [copied, setCopied] = useState(false);

  const { output, removedCount, totalCount } = useMemo(() => {
    const lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const unique: string[] = [];

    lines.forEach((line) => {
      const cleaned = trimLines ? line.trim() : line;
      if (removeEmpty && cleaned.length === 0) return;

      const key = caseSensitive ? cleaned : cleaned.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      unique.push(cleaned);
    });

    return {
      output: unique.join("\n"),
      totalCount: lines.filter((line) => (removeEmpty ? line.trim().length > 0 : true)).length,
      removedCount: Math.max(0, (lines.length || 0) - unique.length),
    };
  }, [input, caseSensitive, trimLines, removeEmpty]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Remove Duplicate Lines</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-4 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} />
          Case sensitive
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={trimLines} onChange={(event) => setTrimLines(event.target.checked)} />
          Trim lines
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={removeEmpty} onChange={(event) => setRemoveEmpty(event.target.checked)} />
          Remove empty lines
        </label>
      </div>

      <div className="mt-3 text-xs text-black/60 dark:text-white/60">
        {totalCount} line{totalCount === 1 ? "" : "s"} → {output ? output.split(/\r?\n/).length : 0} unique ({removedCount} removed)
      </div>

      <textarea
        readOnly
        value={output}
        className="mt-2 min-h-28 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />
    </div>
  );
}
