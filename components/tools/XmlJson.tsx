"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Direction = "xml-to-json" | "json-to-xml";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function elementToObject(element: Element): any {
  const children = Array.from(element.children);
  const obj: Record<string, any> = {};

  if (element.attributes.length) {
    const attrs: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      attrs[attr.name] = attr.value;
    });
    obj["@attributes"] = attrs;
  }

  if (!children.length) {
    const text = (element.textContent || "").trim();
    if (Object.keys(obj).length) {
      if (text) obj["#text"] = text;
      return obj;
    }
    return text || "";
  }

  children.forEach((child) => {
    const value = elementToObject(child);
    if (obj[child.tagName]) {
      if (!Array.isArray(obj[child.tagName])) {
        obj[child.tagName] = [obj[child.tagName]];
      }
      obj[child.tagName].push(value);
    } else {
      obj[child.tagName] = value;
    }
  });

  return obj;
}

function objectToXml(value: any, nodeName: string): string {
  if (Array.isArray(value)) {
    return value.map((item) => objectToXml(item, nodeName)).join("");
  }

  if (value && typeof value === "object") {
    const attrs = value["@attributes"] || {};
    const text = value["#text"] ? escapeXml(String(value["#text"])) : "";
    const children = Object.keys(value)
      .filter((key) => key !== "@attributes" && key !== "#text")
      .map((key) => objectToXml(value[key], key))
      .join("");

    const attrString = Object.entries(attrs)
      .map(([key, val]) => ` ${key}="${escapeXml(String(val))}"`)
      .join("");

    return `<${nodeName}${attrString}>${text}${children}</${nodeName}>`;
  }

  return `<${nodeName}>${escapeXml(String(value ?? ""))}</${nodeName}>`;
}

export default function XmlJson() {
  const [direction, setDirection] = useState<Direction>("xml-to-json");
  const [rootName, setRootName] = useState("root");
  const [input, setInput] = useState("<person><name>Ada</name><role>Mathematician</role></person>");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      if (!input.trim()) return { output: "", error: "" };

      if (direction === "xml-to-json") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, "application/xml");
        if (doc.getElementsByTagName("parsererror").length) {
          return { output: "", error: "Invalid XML." };
        }
        const root = doc.documentElement;
        const obj = { [root.tagName]: elementToObject(root) };
        return { output: JSON.stringify(obj, null, 2), error: "" };
      }

      const json = JSON.parse(input);
      let xml = "";
      if (json && typeof json === "object" && !Array.isArray(json)) {
        const keys = Object.keys(json);
        if (keys.length === 1) {
          const key = keys[0] || rootName;
          xml = objectToXml(json[key], key);
        } else {
          xml = objectToXml(json, rootName);
        }
      } else {
        xml = objectToXml(json, rootName);
      }

      return { output: xml, error: "" };
    } catch (err: any) {
      return { output: "", error: err?.message ?? "Conversion failed." };
    }
  }, [input, direction, rootName]);

  async function copy() {
    const ok = await copyToClipboard(output);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">XML ⇄ JSON</h2>
        <select
          value={direction}
          onChange={(event) => setDirection(event.target.value as Direction)}
          className="rounded-lg border border-gray-300/80 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
        >
          <option value="xml-to-json">XML → JSON</option>
          <option value="json-to-xml">JSON → XML</option>
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

      {direction === "json-to-xml" ? (
        <div className="mt-3">
          <label className="text-xs text-black/60 dark:text-white/60">Root element</label>
          <input
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </div>
      ) : null}

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
    </div>
  );
}
