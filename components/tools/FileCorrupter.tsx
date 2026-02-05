"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function corruptBytes(bytes: Uint8Array, pct: number) {
  const out = new Uint8Array(bytes);
  const flips = Math.max(1, Math.floor((out.length * pct) / 100));
  for (let i = 0; i < flips; i++) {
    const idxArr = new Uint32Array(1);
    crypto.getRandomValues(idxArr);
    const idx = idxArr[0] % out.length;

    const valArr = new Uint8Array(1);
    crypto.getRandomValues(valArr);
    out[idx] = valArr[0];
  }
  return out;
}

export default function FileCorrupter() {
  const [file, setFile] = useState<File | null>(null);
  const [pct, setPct] = useState(1);

  const info = useMemo(() => {
    if (!file) return null;
    return { name: file.name, size: file.size, type: file.type || "unknown" };
  }, [file]);

  const corruptAndDownload = async () => {
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const out = corruptBytes(bytes, pct);
    const blob = new Blob([out], { type: file.type || "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corrupted_${file.name}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  };

  return (
    <ToolShell
      title="File Corrupter"
      description="Corrupt a file for QA/testing (changes random bytes). This is destructive—use copies."
    >
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block text-sm"
      />

      {info ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
          <div><span className="text-white/80">File:</span> {info.name}</div>
          <div><span className="text-white/80">Size:</span> {info.size.toLocaleString()} bytes</div>
          <div><span className="text-white/80">Type:</span> {info.type}</div>
        </div>
      ) : (
        <div className="mt-3 text-sm text-white/70">Choose a file to corrupt.</div>
      )}

      <div className="mt-4">
        <label className="text-sm text-white/70">
          Corruption %
          <span className="ml-2 text-white/80">{pct}%</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <div className="mt-1 text-xs text-white/50">
          Tip: 1–2% usually breaks many formats without totally shredding the file.
        </div>
      </div>

      <button
        onClick={corruptAndDownload}
        disabled={!file}
        className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
      >
        Corrupt & Download
      </button>
    </ToolShell>
  );
}
