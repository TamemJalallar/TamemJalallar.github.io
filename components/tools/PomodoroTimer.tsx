"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ToolShell from "./_ToolShell";

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(mm)}:${pad(ss)}`;
}

export default function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [running, setRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(workMin * 60 * 1000);

  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    // when not running, update remaining when durations change
    if (running) return;
    setRemainingMs((mode === "work" ? workMin : breakMin) * 60 * 1000);
  }, [workMin, breakMin, mode, running]);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (endAtRef.current == null) return;
      const ms = endAtRef.current - Date.now();
      setRemainingMs(ms);

      if (ms <= 0) {
        const nextMode = mode === "work" ? "break" : "work";
        setMode(nextMode);
        const nextMs = (nextMode === "work" ? workMin : breakMin) * 60 * 1000;
        endAtRef.current = Date.now() + nextMs;
        setRemainingMs(nextMs);
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running, mode, workMin, breakMin]);

  const start = () => {
    endAtRef.current = Date.now() + remainingMs;
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
    endAtRef.current = null;
  };

  const reset = () => {
    setRunning(false);
    endAtRef.current = null;
    setMode("work");
    setRemainingMs(workMin * 60 * 1000);
  };

  const switchMode = () => {
    const next = mode === "work" ? "break" : "work";
    setMode(next);
    setRunning(false);
    endAtRef.current = null;
    setRemainingMs((next === "work" ? workMin : breakMin) * 60 * 1000);
  };

  const label = useMemo(() => (mode === "work" ? "Work" : "Break"), [mode]);

  return (
    <ToolShell title="Pomodoro Timer" description="Work/break timer with adjustable durations.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Work minutes</label>
          <input
            type="number"
            min={1}
            value={workMin}
            onChange={(e) => setWorkMin(Math.max(1, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Break minutes</label>
          <input
            type="number"
            min={1}
            value={breakMin}
            onChange={(e) => setBreakMin(Math.max(1, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            disabled={running}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
        <div className="text-sm text-white/70">{label}</div>
        <div className="mt-1 text-4xl font-mono">{fmt(remainingMs)}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={running ? pause : start}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={switchMode} className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          Switch
        </button>
        <button onClick={reset} className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          Reset
        </button>
      </div>
    </ToolShell>
  );
}
