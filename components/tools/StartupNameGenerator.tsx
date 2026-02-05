"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const PREFIXES = [
  "Nova",
  "Pixel",
  "Cloud",
  "Bright",
  "Swift",
  "Luna",
  "Echo",
  "Nimble",
  "Pulse",
  "Vector",
  "Atlas",
  "Spark",
  "Forge",
  "Drift",
  "Orbit",
  "Zen",
];

const ROOTS = [
  "Flow",
  "Stack",
  "Labs",
  "Nest",
  "Works",
  "Hive",
  "Wave",
  "Loop",
  "Bridge",
  "Foundry",
  "Deck",
  "Pilot",
  "Base",
  "Signal",
  "Field",
  "Lane",
];

const SUFFIXES = [
  "ly",
  "io",
  "ify",
  "hub",
  "labs",
  "works",
  "stack",
  "base",
  "space",
  "port",
  "shift",
  "path",
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function buildName(style: string) {
  const prefix = pick(PREFIXES);
  const root = pick(ROOTS);
  const suffix = pick(SUFFIXES);

  if (style === "compound") return `${prefix}${root}`;
  if (style === "suffix") return `${root}${suffix}`;
  return Math.random() > 0.5 ? `${prefix}${root}` : `${root}${suffix}`;
}

export default function StartupNameGenerator() {
  const [count, setCount] = useState(6);
  const [style, setStyle] = useState("mixed");
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const next = Array.from({ length: count }, () => buildName(style));
    setNames(next);
  }

  const output = useMemo(() => names.join("\n"), [names]);

  async function copy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Startup Name Generator</h2>
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
          disabled={!names.length}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Count
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(event) => setCount(Math.max(1, Math.min(30, Number(event.target.value) || 1)))}
            className="ml-2 w-16 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label>
          Style
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            <option value="mixed">Mixed</option>
            <option value="compound">Prefix + Root</option>
            <option value="suffix">Root + Suffix</option>
          </select>
        </label>
      </div>

      {names.length ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <ul className="space-y-1">
            {names.map((name, idx) => (
              <li key={`${name}-${idx}`}>{name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">Generate ideas to get started.</p>
      )}
    </div>
  );
}
