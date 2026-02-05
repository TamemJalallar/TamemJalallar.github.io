"use client";

import React, { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import JsBarcode from "jsbarcode";

export default function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState<"CODE128" | "EAN13">("CODE128");
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value || " ", { format, displayValue: true });
    } catch {
      // ignore
    }
  }, [value, format]);

  const download = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current.outerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barcode.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  return (
    <ToolShell title="Barcode Generator" description="Generate CODE128 or EAN13 barcodes.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Value</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN13</option>
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 overflow-auto">
        <svg ref={svgRef} />
      </div>

      <button onClick={download} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Download SVG
      </button>
    </ToolShell>
  );
}
