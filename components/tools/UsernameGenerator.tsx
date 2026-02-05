"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const ADJECTIVES = [
  "swift",
  "quiet",
  "bright",
  "mellow",
  "brave",
  "lucky",
  "cosmic",
  "clever",
  "bold",
  "cozy",
  "nimble",
  "sunny",
  "chill",
  "vivid",
  "sly",
  "gentle",
  "zesty",
  "rapid",
  "fuzzy",
  "minty",
];

const NOUNS = [
  "fox",
  "otter",
  "panda",
  "tiger",
  "koala",
  "falcon",
  "comet",
  "river",
  "forest",
  "breeze",
  "rocket",
  "pixel",
  "signal",
  "cactus",
  "orbit",
  "ember",
  "shadow",
  "noodle",
  "galaxy",
  "sparrow",
];

const SEPARATORS = [
  { label: "None", value: "" },
  { label: "_", value: "_" },
  { label: "-", value: "-" },
  { label: ".", value: "." },
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function buildUsername(separator: string, includeNumber: boolean) {
  const joiner = separator;
  const base = [pick(ADJECTIVES), pick(NOUNS)].join(joiner);
  if (!includeNumber) return base.toLowerCase();
  const number = Math.floor(Math.random() * 90) + 10;
  return (joiner ? `${base}${joiner}${number}` : `${base}${number}`).toLowerCase();
}

export default function UsernameGenerator() {
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("_");
  const [includeNumber, setIncludeNumber] = useState(true);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const next = Array.from({ length: count }, () => buildUsername(separator, includeNumber));
    setUsernames(next);
  }

  const output = useMemo(() => usernames.join("\n"), [usernames]);

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
        <h2 className="mr-auto text-lg font-semibold">Username Generator</h2>
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
          disabled={!usernames.length}
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
          Separator
          <select
            value={separator}
            onChange={(event) => setSeparator(event.target.value)}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            {SEPARATORS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeNumber}
            onChange={(event) => setIncludeNumber(event.target.checked)}
          />
          Include number
        </label>
      </div>

      {usernames.length ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <ul className="space-y-1">
            {usernames.map((name, idx) => (
              <li key={`${name}-${idx}`}>{name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">Generate usernames to get started.</p>
      )}
    </div>
  );
}
