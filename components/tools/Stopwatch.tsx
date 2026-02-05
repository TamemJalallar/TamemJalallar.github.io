"use client";

import React, { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";

function formatMs(ms: number) {
  const t = Math.max(0, ms);
  const totalSeconds = Math.floor(t / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((t % 1000) / 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(minutes)}:${pad(seconds)}.${pad(millis)}`;
}

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (startAtRef.current == null) return;
      setElapsedMs(Date.now() - startAtRef.current);
    };

    tick();
    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [running]);

  const start = () => {
    startAtRef.current = Date.now() - elapsedMs;
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setElapsedMs(0);
    setLaps([]);
    startAtRef.current = null;
  };

  const lap = () => {
    if (!running) return;
    setLaps((prev) => [elapsedMs, ...prev]);
  };

  return (
    <ToolShell title="Stopwatch" description="Stopwatch with laps.">
      <div className="mt-1 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
        <div className="text-4xl font-mono">{formatMs(elapsedMs)}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={running ? pause : start}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={lap}
          disabled={!running}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Lap
        </button>
        <button onClick={reset} className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          Reset
        </button>
      </div>

      {laps.length > 0 ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
          <div className="mb-2 text-white/70">Laps</div>
          <ul className="space-y-1 font-mono">
            {laps.map((ms, idx) => (
              <li key={idx} className="flex justify-between text-white/70">
                <span>#{laps.length - idx}</span>
                <span>{formatMs(ms)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </ToolShell>
  );
}
