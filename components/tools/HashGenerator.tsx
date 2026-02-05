"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

type Algo = "SHA-256" | "SHA-1" | "SHA-384" | "SHA-512";

function toHex(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export default function HashGenerator() {
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [input, setInput] = useState("hello world");
  const [format, setFormat] = useState<"hex" | "base64">("hex");

  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string>("");

  const canUseWebCrypto = typeof window !== "undefined" && !!window.crypto?.subtle;

  useMemo(() => {
    let alive = true;

    const run = async () => {
      if (!canUseWebCrypto) {
        setOut("WebCrypto not available in this environment.");
        return;
      }
      setBusy(true);
      try {
        const data = new TextEncoder().encode(input);
        const hash = await crypto.subtle.digest(algo, data);
        const v = format === "hex" ? toHex(hash) : toBase64(hash);
        if (alive) setOut(v);
      } catch (e: any) {
        if (alive) setOut(e?.message ?? "Failed to hash.");
      } finally {
        if (alive) setBusy(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [algo, input, format, canUseWebCrypto]);

  const copy = async () => {
    await navigator.clipboard.writeText(out);
  };

  return (
    <ToolShell title="Hash Generator" description="Generate secure hashes locally using WebCrypto.">
      <div className="grid gap-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <div>
            <label className="text-sm text-white/70">Algorithm</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as Algo)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            >
              <option value="hex">Hex</option>
              <option value="base64">Base64</option>
            </select>
          </div>

          <div className="flex items-end justify-end gap-2">
            <button
              onClick={copy}
              disabled={!out || busy}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-2 min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            placeholder="Type/paste text to hash…"
          />
          <div className="mt-2 text-xs text-white/50">
            {busy ? "Hashing…" : "Updates automatically as you type."}{" "}
            {algo === "SHA-1" ? "SHA-1 is legacy; prefer SHA-256 or SHA-512." : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm text-white/70">Output</div>
          <div className="mt-2 font-mono text-sm break-all text-white/90">
            {out || "—"}
          </div>
        </div>

        {!canUseWebCrypto ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            WebCrypto isn’t available here. This tool requires a modern browser context.
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
