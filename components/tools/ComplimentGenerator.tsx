"use client";

import { useState } from "react";
import { copyToClipboard } from "./tool-utils";

const COMPLIMENTS = [
  "You're doing great work.",
  "Your attention to detail is impressive.",
  "You bring a calm, focused energy to the team.",
  "You have a great sense of timing.",
  "You make complex things feel simple.",
  "Your creativity is contagious.",
  "You ask smart questions.",
  "You have a knack for solving tricky problems.",
  "You communicate clearly and kindly.",
  "You show up with a great attitude.",
  "You're thoughtful and reliable.",
  "You make progress feel effortless.",
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export default function ComplimentGenerator() {
  const [compliment, setCompliment] = useState("Click generate to get a compliment.");
  const [copied, setCopied] = useState(false);

  function generate() {
    setCompliment(pick(COMPLIMENTS));
  }

  async function copy() {
    if (!compliment || compliment.startsWith("Click generate")) return;
    const ok = await copyToClipboard(compliment);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Compliment Generator</h2>
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
          disabled={compliment.startsWith("Click generate")}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {compliment}
      </div>
    </div>
  );
}
