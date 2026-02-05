"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import Papa from "papaparse";

export default function CsvToJson() {
  const [csv, setCsv] = useState("name,age\nTom,30\nYassie,28");

  const json = useMemo(() => {
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) return JSON.stringify(parsed.errors, null, 2);
    return JSON.stringify(parsed.data, null, 2);
  }, [csv]);

  const copy = async () => navigator.clipboard.writeText(json);

  return (
    <ToolShell title="CSV → JSON" description="Convert CSV into JSON array of objects.">
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
        <div className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm overflow-auto">
          <pre className="whitespace-pre-wrap break-words">{json}</pre>
        </div>
      </div>

      <button onClick={copy} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Copy JSON
      </button>
    </ToolShell>
  );
}
