"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    startRef.current = performance.now();

    const interval = window.setInterval(() => {
      if (startRef.current === null) return;
      const delta = performance.now() - startRef.current;
      setElapsed(accumulatedRef.current + delta);
    }, 50);

    return () => window.clearInterval(interval);
  }, [running]);

  function start() {
    if (running) return;
    setRunning(true);
  }

  function pause() {
    if (!running) return;
    accumulatedRef.current = elapsed;
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    accumulatedRef.current = 0;
    startRef.current = null;
  }

  function addLap() {
    if (!running) return;
    setLaps((prev) => [elapsed, ...prev]);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Stopwatch</h2>

      <div className="mt-4 text-4xl font-semibold tabular-nums">{formatTime(elapsed)}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Start
        </button>
        <button
          type="button"
          onClick={pause}
          disabled={!running}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={addLap}
          disabled={!running}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Lap
        </button>
      </div>

      {laps.length ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <p className="text-xs text-black/60 dark:text-white/60">Laps</p>
          <ol className="mt-2 space-y-1">
            {laps.map((lap, idx) => (
              <li key={`${lap}-${idx}`} className="flex justify-between">
                <span>Lap {laps.length - idx}</span>
                <span className="font-mono">{formatTime(lap)}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
