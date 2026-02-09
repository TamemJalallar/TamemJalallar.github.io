"use client";

import { useMemo, useState } from "react";

const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#f59e0b"];
const STACK_SIZE = 5;
const EMPTY_STACKS = 1;

function isSolved(stacks: string[][]) {
  return stacks.every((stack) => {
    if (stack.length === 0) return true;
    if (stack.length !== STACK_SIZE) return false;
    return stack.every((item) => item === stack[0]);
  });
}

function createSolvedStacks() {
  return COLORS.map((color) => Array(STACK_SIZE).fill(color));
}

function shuffleStacks(seedStacks: string[][], moves = 140) {
  const stacks = seedStacks.map((stack) => [...stack]);

  for (let i = 0; i < moves; i += 1) {
    const fromIndex = Math.floor(Math.random() * stacks.length);
    const toIndex = Math.floor(Math.random() * stacks.length);
    if (fromIndex === toIndex) continue;

    const from = stacks[fromIndex];
    const to = stacks[toIndex];
    if (from.length === 0) continue;
    if (to.length >= STACK_SIZE) continue;

    const moving = from[from.length - 1];
    if (to.length === 0 || to[to.length - 1] === moving) {
      to.push(moving);
      from.pop();
    }
  }

  return stacks;
}

export default function StackLogicGame() {
  const [stacks, setStacks] = useState(() => {
    const base = createSolvedStacks();
    for (let i = 0; i < EMPTY_STACKS; i += 1) {
      base.push([]);
    }
    return shuffleStacks(base);
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => isSolved(stacks), [stacks]);

  const reset = () => {
    const base = createSolvedStacks();
    for (let i = 0; i < EMPTY_STACKS; i += 1) {
      base.push([]);
    }
    setStacks(shuffleStacks(base));
    setSelected(null);
    setMoves(0);
  };

  const handleStackClick = (index: number) => {
    if (solved) return;
    const stack = stacks[index];
    if (selected === null) {
      if (stack.length === 0) return;
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    const from = stacks[selected];
    const to = stacks[index];
    if (!from.length) {
      setSelected(null);
      return;
    }

    const moving = from[from.length - 1];
    const canMove = to.length < STACK_SIZE && (to.length === 0 || to[to.length - 1] === moving);

    if (!canMove) {
      setSelected(null);
      return;
    }

    const next = stacks.map((stack, idx) => {
      if (idx === selected) return stack.slice(0, -1);
      if (idx === index) return [...stack, moving];
      return stack;
    });

    setStacks(next);
    setMoves((prev) => prev + 1);
    setSelected(null);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-sky-500 to-violet-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Stack Logic</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
            Sort the stacks so each column is one color.
          </p>
        </div>
          <div className="text-sm text-black/70 dark:text-white/70">Moves: {moves}</div>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            New puzzle
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stacks.map((stack, idx) => {
            const isSelected = selected === idx;
            return (
              <button
                key={`stack-${idx}`}
                type="button"
                onClick={() => handleStackClick(idx)}
                className={`flex h-56 flex-col-reverse items-center justify-start rounded-2xl border p-3 transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-gray-200/70 bg-white/60 dark:border-white/10 dark:bg-grey-900/40"
                }`}
              >
                {Array.from({ length: STACK_SIZE }).map((_, slotIndex) => {
                  const color = stack[slotIndex];
                  return (
                    <div
                      key={`slot-${idx}-${slotIndex}`}
                      className="mb-2 h-8 w-16 rounded-xl border border-white/10"
                      style={{ backgroundColor: color ?? "transparent" }}
                    />
                  );
                })}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-black/70 dark:text-white/70">
          {solved
            ? "Solved! Great sorting."
            : "Click a stack to pick a block, then click a target stack."}
        </div>
      </div>
    </div>
  );
}
