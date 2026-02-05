"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(time: number) {
  let out = "";
  let value = time;
  for (let i = 0; i < 10; i += 1) {
    out = CROCKFORD[value % 32] + out;
    value = Math.floor(value / 32);
  }
  return out;
}

function encodeRandom(bytes: Uint8Array) {
  let out = "";
  let buffer = 0;
  let bits = 0;
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      const index = (buffer >>> (bits - 5)) & 31;
      out += CROCKFORD[index];
      bits -= 5;
    }
  }
  if (bits > 0) {
    const index = (buffer << (5 - bits)) & 31;
    out += CROCKFORD[index];
  }
  return out.slice(0, 16);
}

function generateUlid() {
  const time = Date.now();
  const random = new Uint8Array(10);
  crypto.getRandomValues(random);
  return `${encodeTime(time)}${encodeRandom(random)}`;
}

function generateUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const hex = Array.from(bytes, toHex).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidUlidGenerator() {
  const [mode, setMode] = useState<"uuid" | "ulid">("uuid");
  const [count, setCount] = useState(5);
  const [values, setValues] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const next = Array.from({ length: count }, () => (mode === "uuid" ? generateUuid() : generateUlid()));
    setValues(next);
  }

  const output = useMemo(() => values.join("\n"), [values]);

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
        <h2 className="mr-auto text-lg font-semibold">UUID / ULID Generator</h2>
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
          disabled={!values.length}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Type
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as "uuid" | "ulid")}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            <option value="uuid">UUID v4</option>
            <option value="ulid">ULID</option>
          </select>
        </label>
        <label>
          Count
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(event) => setCount(Math.max(1, Math.min(50, Number(event.target.value) || 1)))}
            className="ml-2 w-16 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      {values.length ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <ul className="space-y-1 font-mono text-xs">
            {values.map((value, idx) => (
              <li key={`${value}-${idx}`}>{value}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">Generate IDs to get started.</p>
      )}
    </div>
  );
}
