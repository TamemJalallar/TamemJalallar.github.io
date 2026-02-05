"use client";

import { useState } from "react";

export default function CoinFlip() {
  const [result, setResult] = useState("Ready to flip");

  function flip() {
    const next = Math.random() < 0.5 ? "Heads" : "Tails";
    setResult(next);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Coin Flip</h2>
      <button
        type="button"
        onClick={flip}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Flip
      </button>
      <div className="mt-4 text-2xl font-semibold">{result}</div>
    </div>
  );
}
