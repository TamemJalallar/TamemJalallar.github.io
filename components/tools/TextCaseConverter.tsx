"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

const MODE_LABELS: Record<CaseMode, string> = {
  upper: "UPPERCASE",
  lower: "lowercase",
  title: "Title Case",
  sentence: "Sentence case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
};

function wordsFromText(value: string) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toSentenceCase(value: string) {
  const normalized = value.toLowerCase();
  return normalized.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function convert(value: string, mode: CaseMode) {
  if (!value) return "";
  const words = wordsFromText(value);

  switch (mode) {
    case "upper":
      return value.toUpperCase();
    case "lower":
      return value.toLowerCase();
    case "title":
      return words.map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
    case "sentence":
      return toSentenceCase(value);
    case "camel":
      return words
        .map((word, index) =>
          index === 0 ? word : word[0]?.toUpperCase() + word.slice(1),
        )
        .join("");
    case "pascal":
      return words.map((word) => word[0]?.toUpperCase() + word.slice(1)).join("");
    case "snake":
      return words.join("_");
    case "kebab":
      return words.join("-");
    default:
      return value;
  }
}

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseMode>("title");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convert(input, mode), [input, mode]);

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Text Case Converter</h2>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as CaseMode)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          {(Object.keys(MODE_LABELS) as CaseMode[]).map((item) => (
            <option key={item} value={item}>
              {MODE_LABELS[item]}
            </option>
          ))}
        </select>
      </div>

      <label className="text-xs text-black/60 dark:text-white/60">Input</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type or paste text..."
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm outline-none ring-black/10 transition focus:ring dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="text-xs text-black/60 dark:text-white/60">Output ({MODE_LABELS[mode]})</label>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />
    </div>
  );
}
