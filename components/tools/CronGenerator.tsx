"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Mode = "every" | "specific";

type FieldState = {
  mode: Mode;
  value: string;
  label: string;
  hint: string;
};

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily at 9 AM", value: "0 9 * * *" },
  { label: "Weekdays at 9 AM", value: "0 9 * * 1-5" },
  { label: "Weekly (Mon 9 AM)", value: "0 9 * * 1" },
];

function buildField(value: FieldState) {
  return value.mode === "every" ? "*" : value.value.trim() || "*";
}

function fieldFromToken(token: string, label: string, hint: string): FieldState {
  if (token === "*") return { mode: "every", value: "", label, hint };
  return { mode: "specific", value: token, label, hint };
}

export default function CronGenerator() {
  const [preset, setPreset] = useState("");
  const [minute, setMinute] = useState<FieldState>({
    mode: "every",
    value: "",
    label: "Minute",
    hint: "0-59 or */5",
  });
  const [hour, setHour] = useState<FieldState>({
    mode: "every",
    value: "",
    label: "Hour",
    hint: "0-23",
  });
  const [dayOfMonth, setDayOfMonth] = useState<FieldState>({
    mode: "every",
    value: "",
    label: "Day of month",
    hint: "1-31",
  });
  const [month, setMonth] = useState<FieldState>({
    mode: "every",
    value: "",
    label: "Month",
    hint: "1-12 or jan-dec",
  });
  const [dayOfWeek, setDayOfWeek] = useState<FieldState>({
    mode: "every",
    value: "",
    label: "Day of week",
    hint: "0-6 (sun-sat)",
  });
  const [copied, setCopied] = useState(false);

  const cron = useMemo(() => {
    return [
      buildField(minute),
      buildField(hour),
      buildField(dayOfMonth),
      buildField(month),
      buildField(dayOfWeek),
    ].join(" ");
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  function applyPreset(value: string) {
    const parts = value.split(" ");
    if (parts.length !== 5) return;
    setMinute(fieldFromToken(parts[0] || "*", "Minute", minute.hint));
    setHour(fieldFromToken(parts[1] || "*", "Hour", hour.hint));
    setDayOfMonth(fieldFromToken(parts[2] || "*", "Day of month", dayOfMonth.hint));
    setMonth(fieldFromToken(parts[3] || "*", "Month", month.hint));
    setDayOfWeek(fieldFromToken(parts[4] || "*", "Day of week", dayOfWeek.hint));
  }

  async function copy() {
    const ok = await copyToClipboard(cron);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  const fields = [
    { state: minute, setState: setMinute },
    { state: hour, setState: setHour },
    { state: dayOfMonth, setState: setDayOfMonth },
    { state: month, setState: setMonth },
    { state: dayOfWeek, setState: setDayOfWeek },
  ];

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Cron Generator</h2>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4">
        <label className="text-xs text-black/60 dark:text-white/60">Presets</label>
        <select
          value={preset}
          onChange={(event) => {
            const value = event.target.value;
            setPreset(value);
            if (value) applyPreset(value);
          }}
          className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
        >
          <option value="">Custom...</option>
          {PRESETS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(({ state, setState }) => (
          <div key={state.label} className="rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
            <label className="text-xs text-black/60 dark:text-white/60">{state.label}</label>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={state.mode}
                onChange={(event) => setState({ ...state, mode: event.target.value as Mode })}
                className="rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
              >
                <option value="every">Every</option>
                <option value="specific">Specific</option>
              </select>
              <input
                value={state.value}
                onChange={(event) => setState({ ...state, value: event.target.value })}
                disabled={state.mode === "every"}
                placeholder={state.hint}
                className="flex-1 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs disabled:opacity-50 dark:border-white/20 dark:bg-grey-900"
              />
            </div>
            <p className="mt-1 text-[11px] text-black/50 dark:text-white/50">{state.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 font-mono text-sm dark:border-white/10 dark:bg-grey-900/70">
        {cron}
      </div>
    </div>
  );
}
