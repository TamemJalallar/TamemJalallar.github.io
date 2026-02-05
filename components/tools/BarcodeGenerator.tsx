"use client";

import { useEffect, useRef, useState } from "react";
import { downloadUrl, loadScript } from "./tool-utils";

const JSBARCODE_URL = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";

declare global {
  interface Window {
    JsBarcode?: (element: SVGElement | HTMLCanvasElement, value: string, options?: any) => void;
  }
}

export default function BarcodeGenerator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [height, setHeight] = useState(80);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    loadScript(JSBARCODE_URL)
      .then(() => {
        if (!active) return;
        if (!window.JsBarcode || !svgRef.current) return;
        setError("");
        window.JsBarcode(svgRef.current, value || " ", {
          format,
          height,
          displayValue: true,
        });
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Failed to load barcode library.");
      });

    return () => {
      active = false;
    };
  }, [value, format, height]);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Barcode Generator</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-black/60 dark:text-white/60">
          Value
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN-13</option>
            <option value="UPC">UPC</option>
            <option value="CODE39">CODE39</option>
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Height
          <input
            type="number"
            min={40}
            max={180}
            value={height}
            onChange={(event) => setHeight(Math.max(40, Number(event.target.value) || 40))}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-grey-900/70">
        <svg ref={svgRef} style={{ height }} />
      </div>

      <button
        type="button"
        onClick={() => {
          if (!svgRef.current) return;
          const svg = new XMLSerializer().serializeToString(svgRef.current);
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          downloadUrl(url, "barcode.svg");
          setTimeout(() => URL.revokeObjectURL(url), 200);
        }}
        className="mt-4 rounded-lg border border-gray-300/80 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
      >
        Download SVG
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
