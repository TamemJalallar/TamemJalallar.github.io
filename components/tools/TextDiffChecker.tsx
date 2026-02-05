"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function diffLines(a: string, b: string) {
  const A = a.split("\n");
  const B = b.split("\n");
  const out: Array<{ type: "same" | "add" | "del"; text: string }> = [];

  const m = A.length;
  const n = B.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) {
      out.push({ type: "same", text: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", text: A[i] });
      i++;
    } else {
      out.push({ type: "add", text: B[j] });
      j++;
    }
  }
  while (i < m) out.push({ type: "del", text: A[i++] });
  while (j < n) out.push({ type: "add", text: B[j++] });

  return out;
}

export default function TextDiffChecker() {
  const [left, setLeft] = useState("line 1\nline 2\nline 3");
  const [right, setRight] = useState("line 1\nline 2 changed\nline 3\nline 4");

  const diff = useMemo(() => diffLines(left, right), [left, right]);

  return (
    <ToolShell title="Text Diff Checker" description="Compare two texts line-by-line.">
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          className="min-h-[260px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
        <textarea
          value={right}
          onChange={(e) => setRight(e.target.value)}
          className="min-h-[260px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm font-mono overflow-auto">
        {diff.map((d, idx) => (
          <div key={idx} className={d.type === "add" ? "text-green-300" : d.type === "del" ? "text-red-300" : "text-white/70"}>
            {d.type === "add" ? "+ " : d.type === "del" ? "- " : "  "}
            {d.text}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
