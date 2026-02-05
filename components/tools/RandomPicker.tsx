"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function securePick<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const u = new Uint32Array(1);
  crypto.getRandomValues(u);
  return arr[u[0] % arr.length];
}

export default function RandomPicker() {
  const [input, setInput] = useState("Tom\nYassie\nAman\nUzbek Mafia\nBijan");
  const [picked, setPicked] = useState<string | null>(null);

  const items = useMemo(() => {
    return input
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [input]);

  const pick = () => setPicked(securePick(items));

  return (
    <ToolShell title="Random Picker" description="Paste a list, pick a random item.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[240px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        placeholder="One item per line…"
      />

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
        <div className="text-sm text-white/70">Result</div>
        <div className="mt-2 text-2xl font-semibold">{picked ?? "—"}</div>
        <div className="mt-2 text-xs text-white/50">{items.length} item(s)</div>
      </div>

      <button onClick={pick} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Pick Random
      </button>
    </ToolShell>
  );
}
