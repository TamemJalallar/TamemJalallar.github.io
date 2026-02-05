"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i] || "";
    const next = text[i + 1] || "";

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      current.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      current.push(field);
      rows.push(current);
      current = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length || current.length) {
    current.push(field);
    rows.push(current);
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
}

export default function CsvToJson() {
  const [input, setInput] = useState("name,role\nAda Lovelace,Mathematician");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      const rows = parseCsv(input);
      if (!rows.length) return { output: "", error: "No CSV rows found." };
      const [headers, ...rest] = rows;
      const normalizedHeaders = headers.map((h, idx) => h.trim() || `column_${idx + 1}`);

      const data = rest.map((row) => {
        const obj: Record<string, string> = {};
        normalizedHeaders.forEach((header, idx) => {
          obj[header] = row[idx] ?? "";
        });
        return obj;
      });

      return { output: JSON.stringify(data, null, 2), error: "" };
    } catch {
      return { output: "", error: "Failed to parse CSV." };
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
        <h2 className="mr-auto text-lg font-semibold">CSV to JSON</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">CSV input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>

        <div>
          <label className="text-xs text-black/60 dark:text-white/60">JSON output</label>
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
