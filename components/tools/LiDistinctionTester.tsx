"use client";

import { useMemo, useState } from "react";

export default function LiDistinctionTester() {
  const [input, setInput] = useState("IllIililI1lL");

  const stats = useMemo(() => {
    const counts = { upperI: 0, lowerL: 0, one: 0 };
    for (const char of input) {
      if (char === "I") counts.upperI += 1;
      if (char === "l") counts.lowerL += 1;
      if (char === "1") counts.one += 1;
    }
    return counts;
  }, [input]);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">L / I Distinction Tester</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Highlight confusing characters in a monospace view.
      </p>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-4 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-4 font-mono text-sm whitespace-pre-wrap dark:border-white/10 dark:bg-grey-900/70">
        {Array.from(input).map((char, idx) => {
          let className = "";
          if (char === "I") className = "bg-blue-200 text-blue-900";
          if (char === "l") className = "bg-amber-200 text-amber-900";
          if (char === "1") className = "bg-rose-200 text-rose-900";
          return (
            <span key={`${char}-${idx}`} className={`${className} rounded px-0.5`}>
              {char === " " ? String.fromCharCode(160) : char}
            </span>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-black/60 dark:text-white/60">
        I: {stats.upperI} | l: {stats.lowerL} | 1: {stats.one}
      </div>
    </div>
  );
}
