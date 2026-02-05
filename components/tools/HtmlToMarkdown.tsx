"use client";

import { useEffect, useState } from "react";
import { copyToClipboard, loadScript } from "./tool-utils";

const TURNDOWN_URL = "https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js";

declare global {
  interface Window {
    TurndownService?: new () => { turndown: (input: string) => string };
  }
}

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("<h1>Hello</h1><p>Paste HTML here.</p>");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    loadScript(TURNDOWN_URL)
      .then(() => {
        if (!active) return;
        if (!window.TurndownService) throw new Error("HTML converter did not load.");
        const service = new window.TurndownService();
        const markdown = service.turndown(input);
        setOutput(markdown);
        setError("");
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Failed to load converter.");
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
        <h2 className="mr-auto text-lg font-semibold">HTML to Markdown</h2>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">HTML input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>

        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Markdown output</label>
          <textarea
            readOnly
            value={output}
            className="mt-1 min-h-48 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
