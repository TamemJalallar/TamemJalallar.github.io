"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Row = Record<string, string>;

export default function JsonTableViewer() {
  const [input, setInput] = useState("[]");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [copied, setCopied] = useState(false);

  function loadJson() {
    setError("");

    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects.");
      const nextColumns = new Set<string>();
      const nextRows: Row[] = parsed.map((item) => {
        if (typeof item !== "object" || item === null || Array.isArray(item)) {
          throw new Error("Each item must be an object.");
        }
        const row: Row = {};
        Object.entries(item as Record<string, any>).forEach(([key, value]) => {
          nextColumns.add(key);
          row[key] = value == null ? "" : String(value);
        });
        return row;
      });

      setColumns(Array.from(nextColumns));
      setRows(nextRows);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Invalid JSON.");
    }
  }

  function updateCell(rowIndex: number, key: string, value: string) {
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [key]: value };
      return next;
    });
  }

  function addRow() {
    setRows((prev) => [...prev, {}]);
  }

  function addColumn() {
    const key = newColumn.trim();
    if (!key || columns.includes(key)) return;
    setColumns((prev) => [...prev, key]);
    setRows((prev) => prev.map((row) => ({ ...row, [key]: row[key] ?? "" })));
    setNewColumn("");
  }

  const outputJson = useMemo(() => {
    if (!rows.length) return "";
    const data = rows.map((row) => {
      const obj: Record<string, string> = {};
      columns.forEach((col) => {
        obj[col] = row[col] ?? "";
      });
      return obj;
    });
    return JSON.stringify(data, null, 2);
  }, [rows, columns]);

  async function copy() {
    if (!outputJson) return;
    const ok = await copyToClipboard(outputJson);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">JSON ↔ Table</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Paste an array of objects to edit it in a table view.
      </p>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input JSON</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder='[{"name":"Ava"}]'
        className="mt-1 min-h-28 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm font-mono dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={loadJson}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Load JSON
        </button>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Add row
        </button>
        <input
          value={newColumn}
          onChange={(event) => setNewColumn(event.target.value)}
          placeholder="New column"
          className="rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
        />
        <button
          type="button"
          onClick={addColumn}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Add column
        </button>
      </div>

      {columns.length ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border-b border-gray-200/80 px-2 py-2 text-left font-semibold dark:border-white/10">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {columns.map((col) => (
                    <td key={`${rowIndex}-${col}`} className="border-b border-gray-200/80 px-2 py-2 dark:border-white/10">
                      <input
                        value={row[col] ?? ""}
                        onChange={(event) => updateCell(rowIndex, col, event.target.value)}
                        className="w-full rounded-md border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!outputJson}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      {outputJson ? (
        <textarea
          value={outputJson}
          readOnly
          className="mt-3 min-h-28 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-xs font-mono dark:border-white/20 dark:bg-grey-900"
        />
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
