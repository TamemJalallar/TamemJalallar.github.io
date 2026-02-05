"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Mode = "encode" | "decode";

type Strategy = "component" | "full-url";

export default function UrlEncoderDecoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [strategy, setStrategy] = useState<Strategy>("component");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };

    try {
      if (mode === "encode") {
        return {
          output: strategy === "component" ? encodeURIComponent(input) : encodeURI(input),
          error: "",
        };
      }

      return {
        output: strategy === "component" ? decodeURIComponent(input) : decodeURI(input),
        error: "",
      };
    } catch {
      return { output: "", error: "Invalid URL encoding." };
    }
  }, [input, mode, strategy]);

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">URL Encoder / Decoder</h2>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            checked={mode === "encode"}
            onChange={() => setMode("encode")}
          />
          Encode
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            checked={mode === "decode"}
            onChange={() => setMode("decode")}
          />
          Decode
        </label>

        <select
          value={strategy}
          onChange={(event) => setStrategy(event.target.value as Strategy)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          <option value="component">Path/query component</option>
          <option value="full-url">Full URL</option>
        </select>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-1 min-h-28 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm outline-none ring-black/10 focus:ring dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="text-xs text-black/60 dark:text-white/60">Output</label>
        <button
          type="button"
          onClick={() => void handleCopy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <textarea
        readOnly
        value={output}
        className="mt-1 min-h-28 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
