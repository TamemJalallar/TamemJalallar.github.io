"use client";

import { useState } from "react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  function generate() {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    const value = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    setResult(value);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Random Number Generator</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Min
          <input
            type="number"
            value={min}
            onChange={(event) => setMin(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Max
          <input
            type="number"
            value={max}
            onChange={(event) => setMax(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={generate}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Generate
      </button>

      {result !== null ? (
        <div className="mt-4 text-3xl font-semibold">{result}</div>
      ) : null}
    </div>
  );
}
