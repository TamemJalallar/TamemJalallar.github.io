"use client";

import React, { useState } from "react";
import ToolShell from "./_ToolShell";

export default function ColorPicker() {
  const [color, setColor] = useState("#22c55e");

  const copy = async () => navigator.clipboard.writeText(color);

  return (
    <ToolShell
      title="Color Picker"
      description="Pick a color and copy the hex."
      right={
        <button
          onClick={copy}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Copy Hex
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-12 w-20 rounded-lg border border-white/10 bg-transparent p-1"
        />
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-48 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        />
        <div className="h-12 w-48 rounded-xl border border-white/10" style={{ background: color }} />
      </div>
    </ToolShell>
  );
}
