"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const BASES = [2, 8, 10, 16] as const;

type Base = (typeof BASES)[number];

function parseValue(input: string, base: Base) {
  const cleaned = input.trim().toLowerCase().replace(/_/g, "");
  if (!cleaned) return null;

  try {
    if (base === 10) return BigInt(cleaned);
    if (base === 16) return BigInt(cleaned.startsWith("0x") ? cleaned : `0x${cleaned}`);
    if (base === 8) return BigInt(cleaned.startsWith("0o") ? cleaned : `0o${cleaned}`);
    if (base === 2) return BigInt(cleaned.startsWith("0b") ? cleaned : `0b${cleaned}`);
    return null;
  } catch {
    return null;
  }
}

function formatValue(value: bigint, base: Base) {
  return value.toString(base).toUpperCase();
}

export default function BaseNumberConverter() {
  const [input, setInput] = useState("FF");
  const [fromBase, setFromBase] = useState<Base>(16);
  const [toBase, setToBase] = useState<Base>(10);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    const parsed = parseValue(input, fromBase);
    if (parsed === null) return { output: "", error: "Invalid number for base." };
    return { output: formatValue(parsed, toBase), error: "" };
  }, [input, fromBase, toBase]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Base Number Converter</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-black/60 dark:text-white/60">
          Input
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          From base
          <select
            value={fromBase}
            onChange={(event) => setFromBase(Number(event.target.value) as Base)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {BASES.map((base) => (
              <option key={base} value={base}>
                Base {base}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          To base
          <select
            value={toBase}
            onChange={(event) => setToBase(Number(event.target.value) as Base)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {BASES.map((base) => (
              <option key={base} value={base}>
                Base {base}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Output</label>
      <input
        readOnly
        value={output}
        className="mt-1 w-full rounded-lg border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
