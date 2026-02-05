"use client";

import { useState } from "react";
import { copyToClipboard } from "./tool-utils";

const FACTS = [
  "Bananas are berries, but strawberries are not (botanically).",
  "Octopuses have three hearts.",
  "A day on Venus is longer than its year.",
  "Honey can last for years without spoiling.",
  "Wombat poop is cube-shaped.",
  "Humans and giraffes both have seven neck vertebrae.",
  "The smallest prime number is 2.",
  "A leap year has 366 days.",
  "Water expands when it freezes.",
  "An octagon has eight sides.",
  "There are 60 minutes in an hour and 60 seconds in a minute.",
  "A hexagon has six sides.",
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export default function FunFactGenerator() {
  const [fact, setFact] = useState("Click generate to get a fun fact.");
  const [copied, setCopied] = useState(false);

  function generate() {
    setFact(pick(FACTS));
  }

  async function copy() {
    if (!fact || fact.startsWith("Click generate")) return;
    const ok = await copyToClipboard(fact);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Fun Fact Generator</h2>
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
          disabled={fact.startsWith("Click generate")}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {fact}
      </div>

      <p className="mt-3 text-xs text-black/50 dark:text-white/50">For fun only. Verify before relying on a fact.</p>
    </div>
  );
}
