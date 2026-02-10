"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";

const randomColor = () => {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 20);
  return `hsl(${h} ${s}% ${l}%)`;
};

const makeGradient = () => {
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${randomColor()}, ${randomColor()})`;
};

export default function GradientGalleryGenerator() {
  const [count, setCount] = useState(12);
  const [gradients, setGradients] = useState<string[]>(() =>
    Array.from({ length: 12 }, () => makeGradient()),
  );
  const [copied, setCopied] = useState<string | null>(null);

  const cssOutput = useMemo(
    () => gradients.map((g, idx) => `--gradient-${idx + 1}: ${g};`).join("\n"),
    [gradients],
  );

  const regenerate = () => {
    setGradients(Array.from({ length: count }, () => makeGradient()));
  };

  const copyGradient = async (gradient: string) => {
    const ok = await copyToClipboard(gradient);
    if (ok) {
      setCopied(gradient);
      setTimeout(() => setCopied(null), 1200);
    }
  };

  const copyAll = async () => {
    const ok = await copyToClipboard(`:root {\n${cssOutput}\n}`);
    if (ok) {
      setCopied("all");
      setTimeout(() => setCopied(null), 1200);
    }
  };

  return (
    <ToolShell
      title="Gradient Gallery"
      description="Generate a gallery of gradients and export CSS presets."
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-white/70">
          Count
          <input
            type="number"
            min={6}
            max={24}
            value={count}
            onChange={(event) => setCount(Number(event.target.value) || 12)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={regenerate}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Regenerate
        </button>

        <button
          type="button"
          onClick={() => void copyAll()}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {copied === "all" ? "CSS copied" : "Copy CSS"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gradients.map((gradient, idx) => (
          <button
            key={`${gradient}-${idx}`}
            type="button"
            onClick={() => void copyGradient(gradient)}
            className="rounded-xl border border-white/10 p-3 text-left"
          >
            <div className="h-28 w-full rounded-lg border border-white/10" style={{ background: gradient }} />
            <div className="mt-2 text-xs text-white/70">Gradient {idx + 1}</div>
            <div className="text-[11px] text-white/50">
              {copied === gradient ? "Copied" : "Click to copy"}
            </div>
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
