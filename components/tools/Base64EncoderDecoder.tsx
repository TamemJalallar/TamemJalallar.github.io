"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Mode = "encode" | "decode";

function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64(value: string) {
  return decodeURIComponent(escape(atob(value)));
}

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };

    try {
      return {
        output: mode === "encode" ? encodeBase64(input) : decodeBase64(input),
        error: "",
      };
    } catch {
      return { output: "", error: "Invalid input for Base64 decode." };
    }
  }, [input, mode]);

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Base64 Encoder / Decoder</h2>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as Mode)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          <option value="encode">Encode to Base64</option>
          <option value="decode">Decode from Base64</option>
        </select>
      </div>

      <label className="text-xs text-black/60 dark:text-white/60">Input</label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={mode === "encode" ? "Type plain text..." : "Paste Base64 string..."}
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm outline-none ring-black/10 focus:ring dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="text-xs text-black/60 dark:text-white/60">Output</label>
        <button
          type="button"
          disabled={!output}
          onClick={() => void handleCopy()}
          className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <textarea
        readOnly
        value={output}
        className="mt-1 min-h-32 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
