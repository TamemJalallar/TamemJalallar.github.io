"use client";

import React, { useMemo, useRef, useState } from "react";
import ToolShell from "./_ToolShell";

function secureIndex(max: number) {
  const u = new Uint32Array(1);
  crypto.getRandomValues(u);
  return u[0] % max;
}

export default function WheelSpinner() {
  const [input, setInput] = useState("Team 1\nTeam 2\nTeam 3\nTeam 4\nTeam 5");
  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const items = useMemo(
    () => input.split("\n").map((s) => s.trim()).filter(Boolean),
    [input]
  );

  const spin = () => {
    if (items.length < 2 || spinning) return;

    setSpinning(true);
    setWinner(null);

    const target = secureIndex(items.length);
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 3);

      const steps = Math.floor(eased * (items.length * 12 + target));
      setHighlight(steps % items.length);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setHighlight(target);
        setWinner(items[target]);
        setSpinning(false);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setSpinning(false);
  };

  return (
    <ToolShell title="Wheel Spinner" description="Spin through a list and land on a winner.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        placeholder="One item per line…"
      />

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="mb-2 text-sm text-white/70">Spin</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x, i) => (
            <div
              key={`${x}-${i}`}
              className={`rounded-xl border border-white/10 p-3 text-sm ${
                highlight === i ? "bg-white/10" : "bg-white/5"
              }`}
            >
              {x}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm text-white/70">Winner</div>
          <div className="mt-1 text-2xl font-semibold">{winner ?? "—"}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={spin}
          disabled={items.length < 2 || spinning}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {spinning ? "Spinning…" : "Spin"}
        </button>
        <button
          onClick={stop}
          disabled={!spinning}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Stop
        </button>
      </div>
    </ToolShell>
  );
}
