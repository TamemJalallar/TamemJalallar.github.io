"use client";

import { useMemo, useState } from "react";

type DiffLine = { type: "same" | "add" | "remove"; text: string };

function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: "same", text: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "remove", text: a[i] });
      i += 1;
    } else {
      result.push({ type: "add", text: b[j] });
      j += 1;
    }
  }

  while (i < n) {
    result.push({ type: "remove", text: a[i] });
    i += 1;
  }

  while (j < m) {
    result.push({ type: "add", text: b[j] });
    j += 1;
  }

  return result;
}

export default function TextDiffChecker() {
  const [left, setLeft] = useState("Line one\nLine two\nLine three");
  const [right, setRight] = useState("Line one\nLine two updated\nLine three");

  const diff = useMemo(() => {
    const leftLines = left.split(/\r?\n/);
    const rightLines = right.split(/\r?\n/);
    return diffLines(leftLines, rightLines);
  }, [left, right]);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Text Diff Checker</h2>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Original</label>
          <textarea
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            className="mt-1 min-h-40 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Updated</label>
          <textarea
            value={right}
            onChange={(event) => setRight(event.target.value)}
            className="mt-1 min-h-40 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-4 font-mono text-sm dark:border-white/10 dark:bg-grey-900/70">
        {diff.map((line, idx) => (
          <div
            key={`${line.type}-${idx}`}
            className={
              line.type === "add"
                ? "text-emerald-700 dark:text-emerald-300"
                : line.type === "remove"
                ? "text-red-600 dark:text-red-300"
                : "text-black/80 dark:text-white/80"
            }
          >
            {line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  "}
            {line.text || "(empty)"}
          </div>
        ))}
      </div>
    </div>
  );
}
