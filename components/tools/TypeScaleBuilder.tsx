"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";

type ScaleItem = { label: string; size: number };

export default function TypeScaleBuilder() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.2);
  const [steps, setSteps] = useState(6);
  const [copied, setCopied] = useState(false);

  const scale = useMemo(() => {
    const items: ScaleItem[] = [];
    for (let i = -2; i <= steps; i += 1) {
      const size = base * ratio ** i;
      const label = i === 0 ? "base" : i > 0 ? `+${i}` : `${i}`;
      items.push({ label, size: Number(size.toFixed(2)) });
    }
    return items;
  }, [base, ratio, steps]);

  const cssOutput = useMemo(() => {
    return `:root {\n${scale
      .map((item) => `  --type-${item.label.replace("+", "up-")}: ${item.size}px;`)
      .join("\n")}\n}`;
  }, [scale]);

  const copyCss = async () => {
    const ok = await copyToClipboard(cssOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <ToolShell
      title="Type Scale Builder"
      description="Build a modular type scale and copy CSS variables."
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-white/70">
          Base (px)
          <input
            type="number"
            min={10}
            max={32}
            value={base}
            onChange={(event) => setBase(Number(event.target.value) || 16)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Ratio
          <input
            type="number"
            min={1.1}
            max={1.6}
            step={0.01}
            value={ratio}
            onChange={(event) => setRatio(Number(event.target.value) || 1.2)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Steps
          <input
            type="number"
            min={3}
            max={10}
            value={steps}
            onChange={(event) => setSteps(Number(event.target.value) || 6)}
            className="ml-2 w-16 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void copyCss()}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy CSS"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">Preview</div>
          <div className="space-y-2">
            {scale.map((item) => (
              <div key={item.label} style={{ fontSize: `${item.size}px` }}>
                <span className="text-xs text-white/50 mr-2">{item.label}</span>
                The quick brown fox
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">CSS Variables</div>
          <pre className="whitespace-pre-wrap text-xs text-white/70">{cssOutput}</pre>
        </div>
      </div>
    </ToolShell>
  );
}
