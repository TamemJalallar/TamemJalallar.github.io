"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

export default function FindAndReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [global, setGlobal] = useState(true);

  const output = useMemo(() => {
    if (!find) return text;

    try {
      if (useRegex) {
        const flags = `${global ? "g" : ""}${matchCase ? "" : "i"}`;
        const re = new RegExp(find, flags);
        return text.replace(re, replace);
      } else {
        if (!global) {
          if (matchCase) return text.replace(find, replace);
          // case-insensitive single replace
          const idx = text.toLowerCase().indexOf(find.toLowerCase());
          if (idx === -1) return text;
          return text.slice(0, idx) + replace + text.slice(idx + find.length);
        }

        // global replace (string) with optional case-insensitive
        if (matchCase) {
          return text.split(find).join(replace);
        } else {
          const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(escaped, "gi");
          return text.replace(re, replace);
        }
      }
    } catch (e: any) {
      return `Error: ${e?.message ?? "Invalid pattern"}`;
    }
  }, [text, find, replace, useRegex, matchCase, global]);

  return (
    <ToolShell title="Find & Replace" description="Supports plain text and regex.">
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={find}
          onChange={(e) => setFind(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/20"
          placeholder={useRegex ? "Find (regex)..." : "Find..."}
        />
        <input
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/20"
          placeholder="Replace with..."
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
            Regex
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} />
            Match case
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={global} onChange={(e) => setGlobal(e.target.checked)} />
            Global
          </label>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-56 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-white/20"
          placeholder="Original text…"
        />
        <textarea
          readOnly
          value={output}
          className="h-56 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
          placeholder="Updated text…"
        />
      </div>
    </ToolShell>
  );
}
