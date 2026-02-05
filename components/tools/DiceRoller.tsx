"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type RollResult = {
  rolls: number[];
  modifier: number;
  total: number;
};

function parseExpression(input: string) {
  const match = input.trim().match(/^\s*(\d*)\s*d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i);
  if (!match) return null;

  const count = Number(match[1] || 1);
  const sides = Number(match[2] || 0);
  const modifier = match[3] ? Number(match[3].replace(/\s+/g, "")) : 0;

  if (!Number.isFinite(count) || !Number.isFinite(sides) || count < 1 || sides < 2) return null;
  return { count, sides, modifier };
}

export default function DiceRoller() {
  const [expression, setExpression] = useState("2d6+1");
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseExpression(expression), [expression]);

  function roll() {
    if (!parsed) return;

    const rolls = Array.from({ length: parsed.count }, () =>
      Math.floor(Math.random() * parsed.sides) + 1,
    );
    const subtotal = rolls.reduce((sum, value) => sum + value, 0);
    const total = subtotal + parsed.modifier;
    const result = { rolls, modifier: parsed.modifier, total };

    setLastRoll(result);
    setHistory((prev) => [result, ...prev].slice(0, 5));
  }

  async function copy() {
    if (!lastRoll) return;
    const ok = await copyToClipboard(`Rolls: ${lastRoll.rolls.join(", ")} | Total: ${lastRoll.total}`);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Dice Roller</h2>
        <button
          type="button"
          onClick={roll}
          disabled={!parsed}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Roll
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!lastRoll}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Expression (e.g. 2d6+1)</label>
      <input
        value={expression}
        onChange={(event) => setExpression(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
      />

      {!parsed ? (
        <p className="mt-2 text-xs text-red-600 dark:text-red-300">Enter a valid dice expression.</p>
      ) : null}

      {lastRoll ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <div>Rolls: {lastRoll.rolls.join(", ")}</div>
          <div>Modifier: {lastRoll.modifier >= 0 ? "+" : ""}{lastRoll.modifier}</div>
          <div className="mt-1 text-base font-semibold">Total: {lastRoll.total}</div>
        </div>
      ) : null}

      {history.length ? (
        <div className="mt-4 text-xs text-black/60 dark:text-white/60">
          Recent totals: {history.map((item) => item.total).join(", ")}
        </div>
      ) : null}
    </div>
  );
}
