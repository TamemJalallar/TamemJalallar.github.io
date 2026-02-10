"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";

type PatchOp = {
  op: "add" | "remove" | "replace";
  path: string;
  value?: any;
};

const isObject = (value: any) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const diffJson = (a: any, b: any, path: string, ops: PatchOp[]) => {
  if (a === b) return;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      ops.push({ op: "replace", path, value: b });
    }
    return;
  }

  if (isObject(a) && isObject(b)) {
    const keys = new Set<string>([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach((key) => {
      const nextPath = `${path}/${key}`;
      if (!(key in b)) {
        ops.push({ op: "remove", path: nextPath });
        return;
      }
      if (!(key in a)) {
        ops.push({ op: "add", path: nextPath, value: b[key] });
        return;
      }
      diffJson(a[key], b[key], nextPath, ops);
    });
    return;
  }

  ops.push({ op: "replace", path, value: b });
};

export default function JsonDiffPatchViewer() {
  const [left, setLeft] = useState("{\n  \"name\": \"Alpha\",\n  \"count\": 3\n}");
  const [right, setRight] = useState("{\n  \"name\": \"Beta\",\n  \"count\": 5,\n  \"active\": true\n}");
  const [patch, setPatch] = useState<PatchOp[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const compare = () => {
    setError("");
    setPatch([]);
    try {
      const leftJson = JSON.parse(left);
      const rightJson = JSON.parse(right);
      const ops: PatchOp[] = [];
      diffJson(leftJson, rightJson, "", ops);
      setPatch(ops);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Invalid JSON.");
    }
  };

  const copyPatch = async () => {
    const ok = await copyToClipboard(JSON.stringify(patch, null, 2));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <ToolShell
      title="JSON Diff & Patch"
      description="Compare two JSON payloads and generate a patch preview."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          value={left}
          onChange={(event) => setLeft(event.target.value)}
          className="min-h-48 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
        />
        <textarea
          value={right}
          onChange={(event) => setRight(event.target.value)}
          className="min-h-48 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={compare}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={() => void copyPatch()}
          disabled={!patch.length}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {copied ? "Copied" : "Copy patch"}
        </button>
      </div>

      {patch.length ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">Patch operations</div>
          <pre className="whitespace-pre-wrap text-xs text-white/70">
            {JSON.stringify(patch, null, 2)}
          </pre>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
