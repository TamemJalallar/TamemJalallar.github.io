"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const EMOJIS = [
  "😀",
  "😄",
  "😊",
  "😍",
  "🤩",
  "😎",
  "🥳",
  "🤖",
  "👻",
  "🎉",
  "✨",
  "🔥",
  "🌈",
  "🍕",
  "🍩",
  "🍔",
  "🍟",
  "🍣",
  "🥑",
  "🍓",
  "🍉",
  "🥕",
  "🍪",
  "☕",
  "🎧",
  "🎮",
  "🧩",
  "🛹",
  "🚀",
  "🌙",
  "⭐",
  "⚡",
  "🌊",
  "🌸",
  "🌵",
  "🧠",
  "💡",
  "📌",
  "🧪",
  "🔧",
  "🧲",
  "🎲",
  "🏀",
  "⚽",
  "🏆",
  "🎸",
];

const JOINERS = [
  { label: "None", value: "" },
  { label: "Space", value: " " },
  { label: "-", value: "-" },
  { label: "+", value: "+" },
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export default function EmojiCombiner() {
  const [first, setFirst] = useState("😀");
  const [second, setSecond] = useState("✨");
  const [joiner, setJoiner] = useState("");
  const [copied, setCopied] = useState(false);

  const combined = useMemo(() => `${first}${joiner}${second}`, [first, joiner, second]);

  function randomize() {
    setFirst(pick(EMOJIS));
    setSecond(pick(EMOJIS));
  }

  async function copy() {
    const ok = await copyToClipboard(combined);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Emoji Combiner</h2>
        <button
          type="button"
          onClick={randomize}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Randomize
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-black/60 dark:text-white/60">
          First emoji
          <input
            value={first}
            onChange={(event) => setFirst(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-base dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Joiner
          <select
            value={joiner}
            onChange={(event) => setJoiner(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {JOINERS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Second emoji
          <input
            value={second}
            onChange={(event) => setSecond(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-base dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-4 text-3xl dark:border-white/10 dark:bg-grey-900/70">
        {combined}
      </div>
    </div>
  );
}
