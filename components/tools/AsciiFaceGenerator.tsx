"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const FACES = [
  ":)",
  ":-)",
  ":D",
  ":-D",
  ";)",
  ";-)",
  ":P",
  ":-P",
  ":-O",
  ":-|",
  ":-\\",
  "^_^",
  "^-^",
  "-_-",
  "o_O",
  "O_o",
  ">(._.)",
  "(>_<)",
  "(T_T)",
  "(*_*)",
  "(o_o)",
  "(._.)",
  "(='.'=)",
  "(=^.^=)",
  "<3",
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export default function AsciiFaceGenerator() {
  const [count, setCount] = useState(6);
  const [faces, setFaces] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const next = Array.from({ length: count }, () => pick(FACES));
    setFaces(next);
  }

  const output = useMemo(() => faces.join("\n"), [faces]);

  async function copy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">ASCII Face Generator</h2>
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!faces.length}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Count
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(event) => setCount(Math.max(1, Math.min(30, Number(event.target.value) || 1)))}
            className="ml-2 w-16 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      {faces.length ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <ul className="space-y-1">
            {faces.map((face, idx) => (
              <li key={`${face}-${idx}`}>{face}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">Generate a set of ASCII faces.</p>
      )}
    </div>
  );
}
