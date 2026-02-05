"use client";

import { useEffect, useState } from "react";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type Mode = "work" | "break";

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [mode, setMode] = useState<Mode>("work");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const nextMode = mode === "work" ? "break" : "work";
          setMode(nextMode);
          return (nextMode === "work" ? workMinutes : breakMinutes) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, mode, workMinutes, breakMinutes]);

  function applyDurations() {
    const base = (mode === "work" ? workMinutes : breakMinutes) * 60;
    setRemaining(base);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Pomodoro Timer</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Mode: {mode === "work" ? "Focus" : "Break"}
      </p>

      <div className="mt-4 text-4xl font-semibold tabular-nums">{formatTime(remaining)}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRunning(true)}
          disabled={running}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => setRunning(false)}
          disabled={!running}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("work");
            setRemaining(workMinutes * 60);
            setRunning(false);
          }}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Work minutes
          <input
            type="number"
            min={5}
            value={workMinutes}
            onChange={(event) => setWorkMinutes(Math.max(5, Number(event.target.value) || 5))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Break minutes
          <input
            type="number"
            min={1}
            value={breakMinutes}
            onChange={(event) => setBreakMinutes(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={applyDurations}
        className="mt-3 rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
      >
        Apply durations
      </button>
    </div>
  );
}
