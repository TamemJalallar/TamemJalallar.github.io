"use client";

import { useMemo, useState } from "react";

const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#eab308", "#ec4899", "#8b5cf6", "#14b8a6", "#f43f5e"];

function parseItems(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function WheelSpinner() {
  const [input, setInput] = useState("Option A\nOption B\nOption C\nOption D");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");

  const items = useMemo(() => parseItems(input), [input]);

  const gradient = useMemo(() => {
    if (!items.length) return "#111827";
    const slice = 360 / items.length;
    return `conic-gradient(${items
      .map((_, idx) => {
        const start = idx * slice;
        const end = (idx + 1) * slice;
        const color = COLORS[idx % COLORS.length];
        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  }, [items]);

  function spin() {
    if (!items.length) return;
    const index = Math.floor(Math.random() * items.length);
    const slice = 360 / items.length;
    const target = index * slice + slice / 2;

    setSpinning(true);
    setWinner("");

    setRotation((prev) => prev + 360 * 5 + (360 - target));

    window.setTimeout(() => {
      setWinner(items[index] || "");
      setSpinning(false);
    }, 2200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Wheel Spinner</h2>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-4 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={spin}
          disabled={spinning || !items.length}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="relative">
          <div
            className="h-56 w-56 rounded-full border border-gray-200/80"
            style={{ backgroundImage: gradient, transform: `rotate(${rotation}deg)`, transition: "transform 2.2s ease-out" }}
          />
          <div className="absolute left-1/2 top-[-6px] h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-black" />
        </div>
        {winner ? (
          <div className="rounded-xl border border-gray-200/80 bg-white/80 px-4 py-2 text-lg font-semibold dark:border-white/10 dark:bg-grey-900/70">
            Winner: {winner}
          </div>
        ) : null}
      </div>
    </div>
  );
}
