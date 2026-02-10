"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";

type Token = { id: string; name: string; color: string };

const makeToken = (name: string, color: string): Token => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name,
  color,
});

const sanitizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "color";

export default function BrandColorTokensGenerator() {
  const [tokens, setTokens] = useState<Token[]>([
    makeToken("Primary", "#5f6cff"),
    makeToken("Secondary", "#ff6b6b"),
    makeToken("Accent", "#22c55e"),
  ]);
  const [copied, setCopied] = useState<"css" | "json" | null>(null);

  const cssOutput = useMemo(() => {
    return `:root {\n${tokens
      .map((token) => `  --${sanitizeName(token.name)}: ${token.color};`)
      .join("\n")}\n}`;
  }, [tokens]);

  const jsonOutput = useMemo(() => {
    const obj: Record<string, string> = {};
    tokens.forEach((token) => {
      obj[sanitizeName(token.name)] = token.color;
    });
    return JSON.stringify(obj, null, 2);
  }, [tokens]);

  const handleCopy = async (type: "css" | "json") => {
    const ok = await copyToClipboard(type === "css" ? cssOutput : jsonOutput);
    if (ok) {
      setCopied(type);
      setTimeout(() => setCopied(null), 1200);
    }
  };

  const addToken = () => {
    setTokens((prev) => [...prev, makeToken("New Color", "#ffffff")]);
  };

  const updateToken = (id: string, partial: Partial<Token>) => {
    setTokens((prev) => prev.map((token) => (token.id === id ? { ...token, ...partial } : token)));
  };

  const removeToken = (id: string) => {
    if (tokens.length <= 1) return;
    setTokens((prev) => prev.filter((token) => token.id !== id));
  };

  return (
    <ToolShell
      title="Brand Color Tokens"
      description="Generate CSS variables and JSON tokens for your brand palette."
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addToken}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Add color
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("css")}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {copied === "css" ? "CSS copied" : "Copy CSS"}
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("json")}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          {copied === "json" ? "JSON copied" : "Copy JSON"}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <input
              type="text"
              value={token.name}
              onChange={(event) => updateToken(token.id, { name: event.target.value })}
              className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <input
              type="color"
              value={token.color}
              onChange={(event) => updateToken(token.id, { color: event.target.value })}
              className="h-10 w-14 rounded-md border border-white/10 bg-black/20"
            />
            <div className="text-xs text-white/60">{sanitizeName(token.name)}</div>
            <button
              type="button"
              onClick={() => removeToken(token.id)}
              disabled={tokens.length <= 1}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">CSS</div>
          <pre className="whitespace-pre-wrap text-xs text-white/70">{cssOutput}</pre>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">JSON</div>
          <pre className="whitespace-pre-wrap text-xs text-white/70">{jsonOutput}</pre>
        </div>
      </div>
    </ToolShell>
  );
}
