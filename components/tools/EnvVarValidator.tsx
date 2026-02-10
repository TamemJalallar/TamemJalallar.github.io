"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

const isValidKey = (key: string) => /^[A-Z0-9_]+$/.test(key);

export default function EnvVarValidator() {
  const [text, setText] = useState("");
  const [required, setRequired] = useState("");

  const report = useMemo(() => {
    const lines = text.split(/\r?\n/);
    const keys: string[] = [];
    const warnings: string[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) {
        warnings.push(`Line ${idx + 1}: Missing '='`);
        return;
      }
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      keys.push(key);
      if (!isValidKey(key)) {
        warnings.push(`Line ${idx + 1}: Invalid key '${key}'`);
      }
      if (value === "") {
        warnings.push(`Line ${idx + 1}: Empty value for '${key}'`);
      }
      if (value.includes(" ") && !(value.startsWith("\"") && value.endsWith("\""))) {
        warnings.push(`Line ${idx + 1}: Value with spaces should be quoted`);
      }
    });

    const duplicates = keys.filter((key, idx) => keys.indexOf(key) !== idx);
    duplicates.forEach((dup) => warnings.push(`Duplicate key '${dup}'`));

    const requiredList = required
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const missingRequired = requiredList.filter((key) => !keys.includes(key));

    return { warnings, missingRequired, total: keys.length };
  }, [text, required]);

  return (
    <ToolShell
      title="Env Var Validator"
      description="Validate .env files for missing keys and formatting issues."
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste .env content here..."
        className="min-h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
      />

      <label className="mt-3 block text-sm text-white/70">
        Required keys (comma separated)
        <input
          type="text"
          value={required}
          onChange={(event) => setRequired(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        />
      </label>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
        <div>Total keys: {report.total}</div>
        {report.missingRequired.length ? (
          <div className="mt-2 text-xs text-amber-300">
            Missing required: {report.missingRequired.join(", ")}
          </div>
        ) : null}
        {report.warnings.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-200">
            {report.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-xs text-emerald-300">No issues detected.</div>
        )}
      </div>
    </ToolShell>
  );
}
