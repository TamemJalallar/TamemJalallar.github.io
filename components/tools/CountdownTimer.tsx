"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ToolShell from "./_ToolShell";

function formatMs(ms: number) {
  const t = Math.max(0, ms);
  const s = Math.floor(t / 1000);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(10);
  const [secs, setSecs] = useState(0);

  const [running, setRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  const endAtRef = useRef<number | null>(null);

  const initialMs = useMemo(
    () => (hours * 3600 + mins * 60 + secs) * 1000,
    [hours, mins, secs]
  );

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (endAtRef.current == null) return;
      const ms = endAtRef.current - Date.now();
      setRemainingMs(ms);

      if (ms <= 0) {
        setRunning(false);
        endAtRef.current = null;
        setRemainingMs(0);
      }
    };

    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running]);

  const start = () => {
    const ms = remainingMs > 0 ? remainingMs : initialMs;
    if (ms <= 0) return;
    endAtRef.current = Date.now() + ms;
    setRemainingMs(ms);
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
    endAtRef.current = null;
  };

  const reset = () => {
    setRunning(false);
    endAtRef.current = null;
    setRemainingMs(0);
  };

  const display = running || remainingMs > 0 ? formatMs(remainingMs) : formatMs(initialMs);

  return (
    <ToolShell title="Countdown Timer" description="Simple countdown timer with start/pause/reset.">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm text-white/70">Hours</label>
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Minutes</label>
          <input
            type="number"
            min={0}
            value={mins}
            onChange={(e) => setMins(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Seconds</label>
          <input
            type="number"
            min={0}
            value={secs}
            onChange={(e) => setSecs(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            disabled={running}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
        <div className="text-3xl font-mono">{display}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={start}
          disabled={running}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Start
        </button>
        <button
          onClick={pause}
          disabled={!running}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Reset
        </button>
      </div>
    </ToolShell>
  );
}
