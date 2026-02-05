"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import Papa from "papaparse";

export default function JsonToCsv() {
  const [jsonText, setJsonText] = useState(`[
  {"name":"Tom","age":30},
  {"name":"Yassie","age":28}
]`);

  const csv = useMemo(() => {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) return "JSON must be an array of objects.";
      return Papa.unparse(data);
    } catch {
      return "Invalid JSON";
    }
  }, [jsonText]);

  const copy = async () => navigator.clipboard.writeText(csv);

  return (
    <ToolShell title="JSON → CSV" description="Convert JSON array of objects into CSV.">
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
        <div className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm overflow-auto">
          <pre className="whitespace-pre-wrap break-words">{csv}</pre>
        </div>
      </div>

      <button onClick={copy} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Copy CSV
      </button>
    </ToolShell>
  );
}
