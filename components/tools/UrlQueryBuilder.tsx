"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Param = { key: string; value: string };

export default function UrlQueryBuilder() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState("");
  const [params, setParams] = useState<Param[]>([]);
  const [copied, setCopied] = useState(false);

  function parse() {
    const [basePart, queryString = ""] = input.split("?");
    setBase(basePart);
    const search = new URLSearchParams(queryString);
    const list: Param[] = [];
    search.forEach((value, key) => {
      list.push({ key, value });
    });
    setParams(list.length ? list : [{ key: "", value: "" }]);
  }

  function updateParam(index: number, key: string, value: string) {
    setParams((prev) => {
      const next = [...prev];
      next[index] = { key, value };
      return next;
    });
  }

  function addParam() {
    setParams((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeParam(index: number) {
    setParams((prev) => prev.filter((_, idx) => idx !== index));
  }

  const output = useMemo(() => {
    const search = new URLSearchParams();
    params.forEach((param) => {
      if (!param.key) return;
      search.set(param.key, param.value ?? "");
    });
    const query = search.toString();
    if (!base) return query ? `?${query}` : "";
    return query ? `${base}?${query}` : base;
  }, [base, params]);

  async function copy() {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">URL Query Builder</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Parse and edit query parameters quickly.
      </p>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Input URL</label>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="https://example.com?utm=campaign"
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={parse}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Parse
        </button>
        <button
          type="button"
          onClick={addParam}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Add param
        </button>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Base URL</label>
      <input
        value={base}
        onChange={(event) => setBase(event.target.value)}
        placeholder="https://example.com"
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 space-y-2">
        {params.map((param, idx) => (
          <div key={`param-${idx}`} className="flex flex-wrap items-center gap-2">
            <input
              value={param.key}
              onChange={(event) => updateParam(idx, event.target.value, param.value)}
              placeholder="key"
              className="flex-1 rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
            />
            <input
              value={param.value}
              onChange={(event) => updateParam(idx, param.key, event.target.value)}
              placeholder="value"
              className="flex-1 rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
            />
            <button
              type="button"
              onClick={() => removeParam(idx)}
              className="rounded-lg border border-gray-300/80 px-3 py-2 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy URL"}
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-xs dark:border-white/10 dark:bg-grey-900/70">
        {output || "Output will appear here."}
      </div>
    </div>
  );
}
