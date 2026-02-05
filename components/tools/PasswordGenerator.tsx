"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function randInt(max: number) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [nums, setNums] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const pool = useMemo(() => {
    let p = "";
    if (lower) p += "abcdefghijklmnopqrstuvwxyz";
    if (upper) p += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (nums) p += "0123456789";
    if (symbols) p += "!@#$%^&*()-_=+[]{};:,.<>/?";
    return p;
  }, [lower, upper, nums, symbols]);

  const generate = () => {
    if (!pool) return setPassword("");
    let out = "";
    for (let i = 0; i < length; i++) out += pool[randInt(pool.length)];
    setPassword(out);
  };

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
  };

  return (
    <ToolShell title="Password Generator" description="Generate strong passwords locally in your browser.">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Length: <span className="text-white">{length}</span>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
            Lowercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
            Uppercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={nums} onChange={(e) => setNums(e.target.checked)} />
            Numbers
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
            Symbols
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-sm break-all">
        {password || "Click Generate"}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={generate} className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          Generate
        </button>
        <button
          onClick={copy}
          disabled={!password}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Copy
        </button>
      </div>
    </ToolShell>
  );
}
