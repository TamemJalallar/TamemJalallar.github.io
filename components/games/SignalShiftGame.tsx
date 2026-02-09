"use client";

import { useMemo, useState } from "react";

const TARGETS = [
  "BRAVE",
  "CLOUD",
  "FRAME",
  "LIGHT",
  "PLANT",
  "SHINE",
  "SOUND",
  "STACK",
  "TRACK",
  "WATER",
];

const ROWS = 3;

type Column = string[];

type Puzzle = {
  target: string;
  columns: Column[];
};

function buildPuzzle(): Puzzle {
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)] ?? "BRAVE";
  const columns: Column[] = target.split("").map((letter) => {
    const randLetters = Array.from({ length: ROWS - 1 }, () => {
      const code = 65 + Math.floor(Math.random() * 26);
      return String.fromCharCode(code);
    });
    const column = [...randLetters, letter];
    for (let i = column.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [column[i], column[j]] = [column[j], column[i]];
    }
    return column;
  });

  return { target, columns };
}

export default function SignalShiftGame() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle());
  const [moves, setMoves] = useState(0);

  const middleRow = useMemo(() => {
    return puzzle.columns.map((col) => col[1] ?? " ").join("");
  }, [puzzle.columns]);

  const solved = middleRow === puzzle.target;

  const shiftColumn = (index: number, direction: "up" | "down") => {
    setPuzzle((prev) => {
      const nextCols = prev.columns.map((col, idx) => {
        if (idx !== index) return col;
        if (direction === "down") {
          return [col[col.length - 1] ?? " ", ...col.slice(0, -1)];
        }
        return [...col.slice(1), col[0] ?? " "];
      });
      return { ...prev, columns: nextCols };
    });
    setMoves((prev) => prev + 1);
  };

  const reset = () => {
    setPuzzle(buildPuzzle());
    setMoves(0);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Signal Shift</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Shift columns to align the center row with the target word.
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

        <div className="mt-5 rounded-2xl border border-gray-200/70 bg-white/80 p-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-black/70 dark:border-white/10 dark:bg-grey-900/50 dark:text-white/70">
          Target: {puzzle.target}
        </div>

        <div className="mt-6 grid grid-cols-5 gap-3">
          {puzzle.columns.map((col, idx) => (
            <div key={`col-${idx}`} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => shiftColumn(idx, "up")}
                className="rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
              >
                ▲
              </button>
              <div className="grid gap-2">
                {col.map((letter, rowIdx) => (
                  <div
                    key={`cell-${idx}-${rowIdx}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-semibold uppercase ${
                      rowIdx === 1
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-300/70 bg-white dark:border-white/20 dark:bg-grey-900"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => shiftColumn(idx, "down")}
                className="rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-black/70 dark:text-white/70">
          {solved ? "Signal locked! Nice work." : `Middle row: ${middleRow}`}
        </div>
      </div>
    </div>
  );
}
