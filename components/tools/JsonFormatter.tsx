"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, text: "" };
    try {
      const parsed = JSON.parse(input);
      return { ok: true as const, text: JSON.stringify(parsed, null, indent) };
    } catch (e: any) {
      return { ok: false as const, text: e?.message ?? "Invalid JSON" };
    }
  }, [input, indent]);

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {}
  };

  return (
    <ToolShell
      title="JSON Formatter"
      description="Validate, prettify, and minify JSON."
      right={
        <div className="flex items-center gap-2">
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {[2, 4, 8].map((n) => (
              <option key={n} value={n}>
                Indent {n}
              </option>
            ))}
          </select>
          <button
            onClick={minify}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Minify
          </button>
        </div>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-56 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-white/20"
          placeholder='Paste JSON… e.g. {"a":1}'
        />
        <div className="h-56 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
          {!input.trim() ? (
            <div className="text-white/60">Output…</div>
          ) : result.ok ? (
            <pre className="h-full overflow-auto whitespace-pre-wrap break-words">
              {result.text}
            </pre>
          ) : (
            <div className="text-red-300">{result.text}</div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
