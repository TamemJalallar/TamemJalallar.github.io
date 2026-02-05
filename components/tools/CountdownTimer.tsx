"use client";

import { useEffect, useState } from "react";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CountdownTimer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  function applyDuration() {
    const total = minutes * 60 + seconds;
    setRemaining(total);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Countdown Timer</h2>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-4xl font-semibold tabular-nums">{formatTime(remaining)}</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning(true)}
            disabled={running || remaining === 0}
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
            onClick={() => setRemaining(minutes * 60 + seconds)}
            className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black/60 dark:text-white/60">
          Minutes
          <input
            type="number"
            min={0}
            value={minutes}
            onChange={(event) => setMinutes(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="text-xs text-black/60 dark:text-white/60">
          Seconds
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(event) => setSeconds(Math.max(0, Math.min(59, Number(event.target.value) || 0)))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={applyDuration}
        className="mt-3 rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
      >
        Apply duration
      </button>
    </div>
  );
}
