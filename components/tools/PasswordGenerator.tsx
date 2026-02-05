"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

function secureRandomInt(max: number) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffle<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => {
    let next = "";
    if (includeLower) next += LOWER;
    if (includeUpper) next += UPPER;
    if (includeNumbers) next += NUMBERS;
    if (includeSymbols) next += SYMBOLS;

    if (excludeSimilar) {
      next = next.replace(/[Il1O0]/g, "");
    }

    return next;
  }, [includeLower, includeUpper, includeNumbers, includeSymbols, excludeSimilar]);

  function generate() {
    if (!pool) {
      setPassword("");
      return;
    }

    const picks: string[] = [];

    const mustSets: string[] = [];
    if (includeLower) mustSets.push(LOWER);
    if (includeUpper) mustSets.push(UPPER);
    if (includeNumbers) mustSets.push(NUMBERS);
    if (includeSymbols) mustSets.push(SYMBOLS);

    mustSets.forEach((set) => {
      const safeSet = excludeSimilar ? set.replace(/[Il1O0]/g, "") : set;
      if (!safeSet) return;
      picks.push(safeSet[secureRandomInt(safeSet.length)] || "");
    });

    while (picks.length < length) {
      picks.push(pool[secureRandomInt(pool.length)] || "");
    }

    const final = shuffle(picks).slice(0, length).join("");
    setPassword(final);
  }

  async function copy() {
    if (!password) return;
    const ok = await copyToClipboard(password);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Password Generator</h2>
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!password}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <input
        readOnly
        value={password}
        placeholder="Click generate to create a password"
        className="mt-4 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Length: {length}
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="mt-1 w-full"
          />
        </label>

        <div className="grid gap-2 text-xs">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} />
            Include lowercase
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} />
            Include uppercase
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
            Include numbers
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
            Include symbols
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} />
            Exclude similar (I, l, 1, O, 0)
          </label>
        </div>
      </div>
    </div>
  );
}
