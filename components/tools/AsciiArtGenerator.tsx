"use client";

import { useEffect, useState } from "react";
import { copyToClipboard, loadScript } from "./tool-utils";

const FIGLET_URL = "https://cdn.jsdelivr.net/npm/figlet@1.8.0/figlet.min.js";

const FONTS = ["Standard", "Slant", "Big"];

declare global {
  interface Window {
    figlet?: {
      text: (value: string, options: { font: string }, cb: (err: Error | null, out?: string) => void) => void;
    };
  }
}

export default function AsciiArtGenerator() {
  const [input, setInput] = useState("Hello");
  const [font, setFont] = useState("Standard");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    loadScript(FIGLET_URL)
      .then(() => {
        if (!active) return;
        if (!window.figlet) throw new Error("ASCII engine did not load.");
        window.figlet.text(input || " ", { font }, (err, out) => {
          if (!active) return;
          if (err || !out) {
            setError("Font not available in this bundle.");
            setOutput("");
            return;
          }
          setError("");
          setOutput(out);
        });
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Failed to load ASCII engine.");
        setOutput("");
      });

    return () => {
      active = false;
    };
  }, [input, font]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">ASCII Art Generator</h2>
        <select
          value={font}
          onChange={(event) => setFont(event.target.value)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          {FONTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-4 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <textarea
        readOnly
        value={output}
        className="mt-4 min-h-40 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
      />

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
