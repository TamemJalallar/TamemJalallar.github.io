"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

export default function LiDistinctionTester() {
  const [text, setText] = useState("IlIlIlIl lIlIlIlI IIlIlIlI");

  const analysis = useMemo(() => {
    const chars = text.split("");
    const counts = { I: 0, l: 0, other: 0 };
    for (const c of chars) {
      if (c === "I") counts.I++;
      else if (c === "l") counts.l++;
      else counts.other++;
    }
    return counts;
  }, [text]);

  return (
    <ToolShell title="L/I Distinction Tester" description="Spot confusing lowercase L vs uppercase I.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[180px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="text-white/70">Uppercase I</div>
          <div className="mt-1 font-mono text-xl">{analysis.I}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="text-white/70">Lowercase l</div>
          <div className="mt-1 font-mono text-xl">{analysis.l}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="text-white/70">Other</div>
          <div className="mt-1 font-mono text-xl">{analysis.other}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-sm text-white/70 mb-2">High-contrast preview</div>
        <div className="text-lg font-mono tracking-wide bg-white text-black rounded-lg p-3 overflow-auto">
          {text || "—"}
        </div>
      </div>
    </ToolShell>
  );
}
