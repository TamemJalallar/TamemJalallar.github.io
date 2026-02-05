"use client";

import { useEffect, useState } from "react";
import { copyToClipboard, loadScript } from "./tool-utils";

const MARKED_URL = "https://cdn.jsdelivr.net/npm/marked@12.0.1/marked.min.js";

declare global {
  interface Window {
    marked?: { parse: (input: string) => string };
  }
}

export default function MarkdownToHtml() {
  const [input, setInput] = useState("# Hello\n\nType markdown here.");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    loadScript(MARKED_URL)
      .then(() => {
        if (!active) return;
        if (!window.marked) throw new Error("Markdown engine did not load.");
        const html = window.marked.parse(input);
        setOutput(html);
        setError("");
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Failed to load markdown engine.");
        setOutput("");
      });

    return () => {
      active = false;
    };
  }, [input]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Markdown to HTML</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy HTML"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Markdown</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>

        <div>
          <label className="text-xs text-black/60 dark:text-white/60">HTML output</label>
          <textarea
            readOnly
            value={output}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-grey-900/70">
        <p className="text-xs text-black/60 dark:text-white/60">Preview</p>
        {output ? (
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        ) : (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">No preview yet.</p>
        )}
      </div>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
