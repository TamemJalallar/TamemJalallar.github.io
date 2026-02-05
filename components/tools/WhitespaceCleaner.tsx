"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

export default function WhitespaceCleaner() {
  const [input, setInput] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [tabsToSpaces, setTabsToSpaces] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    let text = input.replace(/\r\n/g, "\n");
    if (tabsToSpaces) text = text.replace(/\t/g, "  ");

    let lines = text.split("\n");
    if (trimLines) lines = lines.map((line) => line.trim());
    if (collapseSpaces) lines = lines.map((line) => line.replace(/\s{2,}/g, " "));
    if (removeEmptyLines) lines = lines.filter((line) => line.length > 0);

    return lines.join("\n");
  }, [input, trimLines, collapseSpaces, removeEmptyLines, tabsToSpaces]);

  async function copy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Whitespace Cleaner</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Normalize whitespace with a few quick cleanup options.
      </p>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={trimLines} onChange={(event) => setTrimLines(event.target.checked)} />
          Trim lines
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={collapseSpaces} onChange={(event) => setCollapseSpaces(event.target.checked)} />
          Collapse spaces
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={removeEmptyLines} onChange={(event) => setRemoveEmptyLines(event.target.checked)} />
          Remove empty lines
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={tabsToSpaces} onChange={(event) => setTabsToSpaces(event.target.checked)} />
          Tabs to spaces
        </label>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Output</label>
      <textarea
        value={output}
        readOnly
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />
    </div>
  );
}
