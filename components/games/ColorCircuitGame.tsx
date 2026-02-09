"use client";

import { useEffect, useMemo, useState } from "react";

type Coord = { x: number; y: number };

type ColorKey = "red" | "blue" | "green" | "yellow";

type Puzzle = {
  size: number;
  endpoints: Record<ColorKey, [Coord, Coord]>;
};

const COLORS: Record<
  ColorKey,
  { label: string; solid: string; soft: string; ring: string }
> = {
  red: { label: "Red", solid: "bg-rose-500", soft: "bg-rose-500/20", ring: "ring-rose-500/40" },
  blue: { label: "Blue", solid: "bg-sky-500", soft: "bg-sky-500/20", ring: "ring-sky-500/40" },
  green: {
    label: "Green",
    solid: "bg-emerald-500",
    soft: "bg-emerald-500/20",
    ring: "ring-emerald-500/40",
  },
  yellow: {
    label: "Yellow",
    solid: "bg-amber-400",
    soft: "bg-amber-400/20",
    ring: "ring-amber-400/40",
  },
};

const PUZZLE_SIZE = 5;
const CIRCUIT_COUNT = 10;
const COLOR_ORDER: ColorKey[] = ["red", "blue", "green", "yellow"];

function coordsEqual(a: Coord, b: Coord) {
  return a.x === b.x && a.y === b.y;
}

function isAdjacent(a: Coord, b: Coord) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function coordKey(coord: Coord) {
  return `${coord.x}-${coord.y}`;
}

type Transform = (coord: Coord, size: number) => Coord;

const TRANSFORMS: Transform[] = [
  (coord) => coord,
  (coord, size) => ({ x: size - 1 - coord.x, y: coord.y }),
  (coord, size) => ({ x: coord.x, y: size - 1 - coord.y }),
  (coord, size) => ({ x: size - 1 - coord.x, y: size - 1 - coord.y }),
  (coord, size) => ({ x: coord.y, y: size - 1 - coord.x }),
  (coord, size) => ({ x: size - 1 - coord.y, y: coord.x }),
  (coord) => ({ x: coord.y, y: coord.x }),
  (coord, size) => ({ x: size - 1 - coord.y, y: size - 1 - coord.x }),
];

function createRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function buildSerpentinePath(size: number) {
  const path: Coord[] = [];
  for (let y = 0; y < size; y += 1) {
    if (y % 2 === 0) {
      for (let x = 0; x < size; x += 1) path.push({ x, y });
    } else {
      for (let x = size - 1; x >= 0; x -= 1) path.push({ x, y });
    }
  }
  return path;
}

function buildSegmentLengths(
  total: number,
  segments: number,
  minLen: number,
  rng: () => number
) {
  const lengths = Array.from({ length: segments }, () => minLen);
  let remaining = total - segments * minLen;
  while (remaining > 0) {
    const index = Math.floor(rng() * segments);
    lengths[index] += 1;
    remaining -= 1;
  }
  return lengths;
}

function buildPuzzles(size: number, count: number): Puzzle[] {
  const basePath = buildSerpentinePath(size);
  const puzzles: Puzzle[] = [];

  for (let i = 0; i < count; i += 1) {
    const rng = createRng(1337 + i * 97);
    const transform = TRANSFORMS[i % TRANSFORMS.length] ?? TRANSFORMS[0];
    const lengths = buildSegmentLengths(basePath.length, COLOR_ORDER.length, 3, rng);
    let offset = 0;
    const endpoints = {} as Record<ColorKey, [Coord, Coord]>;

    COLOR_ORDER.forEach((color, index) => {
      const segment = basePath
        .slice(offset, offset + lengths[index])
        .map((coord) => transform(coord, size));
      endpoints[color] = [segment[0], segment[segment.length - 1]];
      offset += lengths[index];
    });

    puzzles.push({ size, endpoints });
  }

  return puzzles;
}

function colorAtCoord(paths: Record<ColorKey, Coord[]>, coord: Coord) {
  const colors = Object.keys(paths) as ColorKey[];
  for (const color of colors) {
    if (paths[color].some((point) => coordsEqual(point, coord))) return color;
  }
  return null;
}

export default function ColorCircuitGame() {
  const puzzles = useMemo(() => buildPuzzles(PUZZLE_SIZE, CIRCUIT_COUNT), []);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = puzzles[puzzleIndex] ?? puzzles[0];

  const buildPaths = (source: Puzzle) => ({
    red: [source.endpoints.red[0]],
    blue: [source.endpoints.blue[0]],
    green: [source.endpoints.green[0]],
    yellow: [source.endpoints.yellow[0]],
  });

  const [paths, setPaths] = useState<Record<ColorKey, Coord[]>>(() =>
    puzzle ? buildPaths(puzzle) : { red: [], blue: [], green: [], yellow: [] }
  );
  const [activeColor, setActiveColor] = useState<ColorKey | null>(null);
  const [dragging, setDragging] = useState(false);

  const endpoints = puzzle.endpoints;

  const endpointMap = useMemo(() => {
    const map = new Map<string, ColorKey>();
    (Object.keys(endpoints) as ColorKey[]).forEach((color) => {
      endpoints[color].forEach((coord) => {
        map.set(coordKey(coord), color);
      });
    });
    return map;
  }, [endpoints]);

  const cellColor = useMemo(() => {
    const map = new Map<string, ColorKey>();
    (Object.keys(paths) as ColorKey[]).forEach((color) => {
      paths[color].forEach((coord) => {
        map.set(coordKey(coord), color);
      });
    });
    return map;
  }, [paths]);

  useEffect(() => {
    setPaths(buildPaths(puzzle));
    setActiveColor(null);
    setDragging(false);
  }, [puzzle]);

  const reset = () => {
    setPaths(buildPaths(puzzle));
    setActiveColor(null);
    setDragging(false);
  };

  const nextPuzzle = () => {
    setPuzzleIndex((prev) => (prev + 1) % puzzles.length);
  };

  const handleStart = (color: ColorKey, coord: Coord) => {
    setPaths((prev) => ({ ...prev, [color]: [coord] }));
    setActiveColor(color);
    setDragging(true);
  };

  const handleCellEnter = (coord: Coord) => {
    if (!dragging || !activeColor) return;

    setPaths((prev) => {
      const currentPath = prev[activeColor];
      const last = currentPath[currentPath.length - 1];
      if (!last || !isAdjacent(last, coord)) return prev;

      const existingColor = colorAtCoord(prev, coord);
      const endpointColor = endpointMap.get(coordKey(coord));
      const isEndpoint = Boolean(endpointColor);

      let next = { ...prev };

      if (existingColor && existingColor !== activeColor && isEndpoint) {
        return prev;
      }

      if (existingColor && existingColor !== activeColor && !isEndpoint) {
        next[existingColor] = [endpoints[existingColor][0]];
      }

      if (currentPath.length >= 2 && coordsEqual(coord, currentPath[currentPath.length - 2])) {
        next[activeColor] = currentPath.slice(0, -1);
        return next;
      }

      if (currentPath.some((point) => coordsEqual(point, coord))) return prev;

      next[activeColor] = [...currentPath, coord];
      return next;
    });
  };

  const completed = useMemo(() => {
    const totalCells = puzzle.size * puzzle.size;
    if (cellColor.size !== totalCells) return false;

    return (Object.keys(endpoints) as ColorKey[]).every((color) => {
      const path = paths[color];
      const [start, end] = endpoints[color];
      return (
        path.length > 1 &&
        coordsEqual(path[0], start) &&
        coordsEqual(path[path.length - 1], end)
      );
    });
  }, [cellColor.size, endpoints, paths]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-sky-500 to-emerald-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Color Circuit</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Connect matching dots without crossing paths.
            </p>
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            Circuit {puzzleIndex + 1}/{puzzles.length}
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={nextPuzzle}
            className="rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm text-black dark:border-white/20 dark:bg-grey-900 dark:text-white"
          >
            New circuit
          </button>
        </div>

        <div
          className="mt-6 grid touch-none gap-2"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
          onPointerUp={() => {
            setDragging(false);
            setActiveColor(null);
          }}
          onPointerLeave={() => {
            setDragging(false);
            setActiveColor(null);
          }}
          onPointerCancel={() => {
            setDragging(false);
            setActiveColor(null);
          }}
        >
          {Array.from({ length: puzzle.size }).map((_, y) =>
            Array.from({ length: puzzle.size }).map((__, x) => {
              const coord = { x, y };
              const color = cellColor.get(coordKey(coord));
              const endpointColor = endpointMap.get(coordKey(coord));
              const fillColor = color ?? endpointColor;
              const fillClass = fillColor
                ? color
                  ? COLORS[fillColor].solid
                  : COLORS[fillColor].soft
                : "bg-white/80 dark:bg-grey-900/60";
              const ringClass = endpointColor ? `ring-2 ${COLORS[endpointColor].ring}` : "";

              return (
                <div
                  key={coordKey(coord)}
                  onPointerDown={(event) => {
                    if (endpointColor) {
                      event.preventDefault();
                      handleStart(endpointColor, coord);
                    }
                  }}
                  onPointerEnter={() => handleCellEnter(coord)}
                  onPointerMove={() => handleCellEnter(coord)}
                  className={`relative flex h-12 items-center justify-center rounded-xl border border-gray-300/70 ${fillClass} ${ringClass} transition-colors dark:border-white/10`}
                >
                  {endpointColor ? (
                    <div className={`h-3 w-3 rounded-full ${COLORS[endpointColor].solid} shadow`} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 text-sm text-black/70 dark:text-white/70">
          {completed ? "Circuit complete!" : "Drag from a dot to connect its pair."}
        </div>
      </div>
    </div>
  );
}
