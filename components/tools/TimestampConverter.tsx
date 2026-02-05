"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampConverter() {
  const [epoch, setEpoch] = useState("");
  const [isMs, setIsMs] = useState(true);

  const parsed = useMemo(() => {
    const num = Number(epoch.trim());
    if (!epoch.trim()) return null;
    if (!Number.isFinite(num)) return { error: "Not a number" as const };
    const ms = isMs ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return { error: "Invalid date" as const };
    return {
      date: d,
      iso: d.toISOString(),
      local: formatLocal(d),
      utc: d.toUTCString(),
      ms,
      s: Math.floor(ms / 1000),
    };
  }, [epoch, isMs]);

  const now = () => {
    const ms = Date.now();
    setEpoch(String(isMs ? ms : Math.floor(ms / 1000)));
  };

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert Unix epoch seconds/milliseconds to human-readable time."
      right={
        <button
          onClick={now}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Use Now
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={epoch}
          onChange={(e) => setEpoch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/20"
          placeholder={isMs ? "Epoch (ms) e.g. 1738700000000" : "Epoch (s) e.g. 1738700000"}
        />
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={isMs}
            onChange={(e) => setIsMs(e.target.checked)}
          />
          Milliseconds
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
        {!parsed ? (
          <div className="text-white/60">Enter a timestamp…</div>
        ) : "error" in parsed ? (
          <div className="text-red-300">{parsed.error}</div>
        ) : (
          <div className="grid gap-2">
            <div><span className="text-white/60">ISO:</span> {parsed.iso}</div>
            <div><span className="text-white/60">Local:</span> {parsed.local}</div>
            <div><span className="text-white/60">UTC:</span> {parsed.utc}</div>
            <div><span className="text-white/60">Epoch (ms):</span> {parsed.ms}</div>
            <div><span className="text-white/60">Epoch (s):</span> {parsed.s}</div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
