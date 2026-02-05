"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

function parseItems(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RandomPicker() {
  const [input, setInput] = useState("Apple\nBanana\nCherry");
  const [winner, setWinner] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => parseItems(input), [input]);

  function pick() {
    if (!items.length) return;
    const choice = items[Math.floor(Math.random() * items.length)] || "";
    setWinner(choice);
    setHistory((prev) => [choice, ...prev].slice(0, 5));
  }

  async function copy() {
    if (!winner) return;
    const ok = await copyToClipboard(winner);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Random Picker</h2>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-4 min-h-28 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={pick}
          disabled={!items.length}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Pick random
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!winner}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy winner"}
        </button>
      </div>

      {winner ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-lg font-semibold dark:border-white/10 dark:bg-grey-900/70">
          {winner}
        </div>
      ) : null}

      {history.length ? (
        <div className="mt-4 text-xs text-black/60 dark:text-white/60">
          Recent picks: {history.join(", ")}
        </div>
      ) : null}
    </div>
  );
}
