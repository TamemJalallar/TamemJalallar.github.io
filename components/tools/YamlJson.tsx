"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Direction = "yaml-to-json" | "json-to-yaml";

type Line = { indent: number; content: string };

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (!Number.isNaN(Number(trimmed)) && /^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function preprocessYaml(input: string): Line[] {
  return input
    .split(/\r?\n/)
    .map((raw) => raw.replace(/\t/g, "  "))
    .map((raw) => {
      const withoutComment = raw.replace(/\s+#.*$/, "");
      const indent = (withoutComment.match(/^\s*/) || [""])[0].length;
      return { indent, content: withoutComment.trim() };
    })
    .filter((line) => line.content.length > 0 && !line.content.startsWith("#"));
}

function parseYaml(input: string) {
  const lines = preprocessYaml(input);
  if (!lines.length) return {};

  let index = 0;

  function parseBlock(currentIndent: number): any {
    if (index >= lines.length) return {};

    const isArray = lines[index].indent === currentIndent && lines[index].content.startsWith("- ");

    if (isArray) {
      const arr: any[] = [];
      while (
        index < lines.length &&
        lines[index].indent === currentIndent &&
        lines[index].content.startsWith("- ")
      ) {
        const item = lines[index].content.slice(2).trim();
        if (!item) {
          index += 1;
          if (index < lines.length && lines[index].indent > currentIndent) {
            arr.push(parseBlock(lines[index].indent));
          } else {
            arr.push(null);
          }
          continue;
        }

        if (item.includes(":")) {
          const colonIndex = item.indexOf(":");
          const key = item.slice(0, colonIndex).trim();
          const valueText = item.slice(colonIndex + 1).trim();
          const obj: Record<string, any> = {};
          if (valueText) {
            obj[key] = parseScalar(valueText);
            index += 1;
          } else {
            index += 1;
            if (index < lines.length && lines[index].indent > currentIndent) {
              obj[key] = parseBlock(lines[index].indent);
            } else {
              obj[key] = "";
            }
          }
          arr.push(obj);
        } else {
          arr.push(parseScalar(item));
          index += 1;
        }
      }
      return arr;
    }

    const obj: Record<string, any> = {};
    while (index < lines.length && lines[index].indent === currentIndent) {
      const line = lines[index].content;
      if (line.startsWith("- ")) break;
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) {
        obj[line] = true;
        index += 1;
        continue;
      }
      const key = line.slice(0, colonIndex).trim();
      const valueText = line.slice(colonIndex + 1).trim();
      if (valueText) {
        obj[key] = parseScalar(valueText);
        index += 1;
      } else {
        index += 1;
        if (index < lines.length && lines[index].indent > currentIndent) {
          obj[key] = parseBlock(lines[index].indent);
        } else {
          obj[key] = "";
        }
      }
    }
    return obj;
  }

  return parseBlock(lines[0].indent);
}

function formatYaml(value: any, indent = 0): string {
  const space = " ".repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return `${space}-\n${formatYaml(item, indent + 2)}`;
        }
        return `${space}- ${formatYaml(item, 0).trim()}`;
      })
      .join("\n");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => {
        if (typeof val === "object" && val !== null) {
          return `${space}${key}:\n${formatYaml(val, indent + 2)}`;
        }
        return `${space}${key}: ${formatYaml(val, 0).trim()}`;
      })
      .join("\n");
  }

  if (typeof value === "string") {
    if (value === "" || /[#:]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
      return JSON.stringify(value);
    }
    return value;
  }

  if (value === null || value === undefined) return "null";
  return String(value);
}

export default function YamlJson() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState("name: Ada\nrole: Mathematician");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      if (!input.trim()) return { output: "", error: "" };
      if (direction === "yaml-to-json") {
        const obj = parseYaml(input);
        return { output: JSON.stringify(obj, null, 2), error: "" };
      }
      const json = JSON.parse(input);
      return { output: formatYaml(json), error: "" };
    } catch (err: any) {
      return { output: "", error: err?.message ?? "Conversion failed." };
    }
  }, [input, direction]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">YAML ⇄ JSON</h2>
        <select
          value={direction}
          onChange={(event) => setDirection(event.target.value as Direction)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          <option value="yaml-to-json">YAML → JSON</option>
          <option value="json-to-yaml">JSON → YAML</option>
        </select>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!output}
          className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 min-h-44 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>
        <div>
          <label className="text-xs text-black/60 dark:text-white/60">Output</label>
          <textarea
            readOnly
            value={output}
            className="mt-1 min-h-44 w-full rounded-xl border border-gray-300/70 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-white/20 dark:bg-grey-800"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
      <p className="mt-3 text-xs text-black/50 dark:text-white/50">
        Supports basic YAML (keys, arrays, and nested indentation).
      </p>
    </div>
  );
}
