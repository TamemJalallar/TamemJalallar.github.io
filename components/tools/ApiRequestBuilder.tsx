"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";

type Pair = { id: string; key: string; value: string };

type BodyMode = "none" | "json" | "text";

const makePair = (): Pair => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  key: "",
  value: "",
});

export default function ApiRequestBuilder() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Pair[]>([makePair()]);
  const [params, setParams] = useState<Pair[]>([makePair()]);
  const [bodyMode, setBodyMode] = useState<BodyMode>("none");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => {
    const query = params
      .filter((p) => p.key)
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    if (!query) return url;
    return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
  }, [url, params]);

  const curl = useMemo(() => {
    const parts: string[] = ["curl", "-X", method, `"${fullUrl}"`];
    const headerList = headers.filter((h) => h.key);

    const hasJsonHeader = headerList.some((h) => h.key.toLowerCase() === "content-type");
    if (bodyMode === "json" && !hasJsonHeader) {
      parts.push("-H", '"Content-Type: application/json"');
    }

    headerList.forEach((h) => {
      parts.push("-H", `"${h.key}: ${h.value}"`);
    });

    if (bodyMode !== "none" && body.trim()) {
      parts.push("--data-raw", `"${body.replace(/\"/g, '\\\"')}"`);
    }

    return parts.join(" ");
  }, [method, fullUrl, headers, bodyMode, body]);

  const copyCurl = async () => {
    const ok = await copyToClipboard(curl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const updatePair = (list: Pair[], setList: (value: Pair[]) => void, id: string, partial: Partial<Pair>) => {
    setList(list.map((item) => (item.id === id ? { ...item, ...partial } : item)));
  };

  const removePair = (list: Pair[], setList: (value: Pair[]) => void, id: string) => {
    if (list.length <= 1) return;
    setList(list.filter((item) => item.id !== id));
  };

  const addPair = (list: Pair[], setList: (value: Pair[]) => void) => {
    setList([...list, makePair()]);
  };

  return (
    <ToolShell
      title="API Request Builder"
      description="Build requests and export a ready-to-run curl command."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-white/70">
          Method
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            {[
              "GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE",
              "OPTIONS",
              "HEAD",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-white/70">
          URL
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://api.example.com/resource"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-xs text-white/60">Query Params</div>
          <div className="space-y-2">
            {params.map((param) => (
              <div key={param.id} className="flex gap-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(event) => updatePair(params, setParams, param.id, { key: event.target.value })}
                  placeholder="key"
                  className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(event) => updatePair(params, setParams, param.id, { value: event.target.value })}
                  placeholder="value"
                  className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => removePair(params, setParams, param.id)}
                  className="rounded-lg bg-white/5 px-3 text-xs hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPair(params, setParams)}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Add param
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs text-white/60">Headers</div>
          <div className="space-y-2">
            {headers.map((header) => (
              <div key={header.id} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(event) => updatePair(headers, setHeaders, header.id, { key: event.target.value })}
                  placeholder="Header"
                  className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(event) => updatePair(headers, setHeaders, header.id, { value: event.target.value })}
                  placeholder="Value"
                  className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => removePair(headers, setHeaders, header.id)}
                  className="rounded-lg bg-white/5 px-3 text-xs hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPair(headers, setHeaders)}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Add header
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs text-white/60">Body</div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={bodyMode}
            onChange={(event) => setBodyMode(event.target.value as BodyMode)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            <option value="none">None</option>
            <option value="json">JSON</option>
            <option value="text">Text</option>
          </select>
        </div>
        {bodyMode !== "none" ? (
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={bodyMode === "json" ? "{\n  \"key\": \"value\"\n}" : "Raw body"}
            className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
          />
        ) : null}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        <div className="mb-2">curl command</div>
        <pre className="whitespace-pre-wrap">{curl}</pre>
        <button
          type="button"
          onClick={() => void copyCurl()}
          className="mt-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy curl"}
        </button>
      </div>
    </ToolShell>
  );
}
