"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import Papa from "papaparse";

const inferType = (values: string[]) => {
  const trimmed = values.map((v) => v.trim()).filter(Boolean);
  if (!trimmed.length) return "empty";

  const isNumber = trimmed.every((v) => !Number.isNaN(Number(v)));
  if (isNumber) return "number";

  const lower = trimmed.map((v) => v.toLowerCase());
  const isBool = lower.every((v) => v === "true" || v === "false");
  if (isBool) return "boolean";

  const isDate = trimmed.every((v) => !Number.isNaN(Date.parse(v)));
  if (isDate) return "date";

  return "string";
};

const quantile = (values: number[], q: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base] ?? 0;
};

export default function CsvProfiler() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState("");

  const analyze = () => {
    setError("");
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      setError(parsed.errors[0]?.message || "Failed to parse CSV.");
      return;
    }

    setRows(parsed.data || []);
  };

  const columns = rows.length ? Object.keys(rows[0] ?? {}) : [];

  const stats = columns.map((col) => {
    const values = rows.map((row) => row[col] ?? "");
    const missing = values.filter((v) => v === "" || v == null).length;
    const filled = values.filter((v) => v !== "" && v != null);
    const type = inferType(values);
    const unique = new Set(filled.map((v) => String(v))).size;

    let numericStats: { min: number; max: number; mean: number; outliers: number } | null = null;
    if (type === "number") {
      const nums = filled.map((v) => Number(v)).filter((v) => !Number.isNaN(v));
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const mean = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
      const q1 = quantile(nums, 0.25);
      const q3 = quantile(nums, 0.75);
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      const outliers = nums.filter((n) => n < lower || n > upper).length;
      numericStats = { min, max, mean: Number(mean.toFixed(2)), outliers };
    }

    return { col, missing, unique, type, numericStats };
  });

  return (
    <ToolShell
      title="CSV Profiler"
      description="Profile columns for types, missing values, and outliers."
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste CSV with headers..."
        className="min-h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={analyze}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Analyze
        </button>
      </div>

      {stats.length ? (
        <div className="mt-4 grid gap-3">
          {stats.map((stat) => (
            <div key={stat.col} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{stat.col}</div>
                <div className="text-xs text-white/50">{stat.type}</div>
              </div>
              <div className="mt-2 text-xs text-white/50">
                Missing: {stat.missing} · Unique: {stat.unique}
              </div>
              {stat.numericStats ? (
                <div className="mt-2 text-xs text-white/50">
                  Min: {stat.numericStats.min} · Max: {stat.numericStats.max} · Mean: {stat.numericStats.mean} · Outliers: {stat.numericStats.outliers}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
