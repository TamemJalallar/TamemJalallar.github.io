"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

function escapeCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function JsonToCsv() {
  const [input, setInput] = useState('[{"name":"Ada","role":"Mathematician"}]');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];

      if (!rows.length) return { output: "", error: "No JSON rows found." };

      if (typeof rows[0] !== "object" || rows[0] === null) {
        const lines = rows.map((item) => escapeCell(String(item)));
        return { output: ["value", ...lines].join("\n"), error: "" };
      }

      const objectRows = rows as Record<string, unknown>[];
      const headers = Array.from(
        objectRows.reduce((set: Set<string>, row) => {
          Object.keys(row || {}).forEach((key) => set.add(key));
          return set;
        }, new Set<string>()),
      );

      const headerLine = headers.map((h) => escapeCell(h)).join(",");
      const dataLines = objectRows.map((row) =>
        headers.map((h) => escapeCell(String(row?.[h] ?? ""))).join(","),
      );

      return { output: [headerLine, ...dataLines].join("\n"), error: "" };
    } catch {
      return { output: "", error: "Invalid JSON." };
    }
  }, [input]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">JSON to CSV</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy CSV"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">JSON input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>

        <div>
          <label className="text-xs text-black/60 dark:text-white/60">CSV output</label>
          <textarea
            readOnly
            value={output}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
