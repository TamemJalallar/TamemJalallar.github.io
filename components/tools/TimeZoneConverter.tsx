"use client";

import { useEffect, useMemo, useState } from "react";
import { loadScript } from "./tool-utils";

const LUXON_URL = "https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js";

const ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

declare global {
  interface Window {
    luxon?: { DateTime: any };
  }
}

function toLocalInput(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function TimeZoneConverter() {
  const [ready, setReady] = useState(false);
  const [fromZone, setFromZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [toZone, setToZone] = useState("UTC");
  const [input, setInput] = useState(() => toLocalInput(new Date()));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    loadScript(LUXON_URL)
      .then(() => {
        if (!active) return;
        setReady(Boolean(window.luxon?.DateTime));
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Failed to load time zone engine.");
      });

    return () => {
      active = false;
    };
  }, []);

  const output = useMemo(() => {
    if (!ready || !window.luxon?.DateTime) return "";

    try {
      const dt = window.luxon.DateTime.fromISO(input, { zone: fromZone });
      if (!dt.isValid) return "Invalid date";
      const converted = dt.setZone(toZone);
      return converted.toFormat("yyyy-LL-dd HH:mm ZZZZ");
    } catch {
      return "Invalid date";
    }
  }, [input, fromZone, toZone, ready]);

  const zoneList = useMemo(() => {
    const set = new Set([...ZONES, fromZone, toZone]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [fromZone, toZone]);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Time Zone Converter</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-black/60 dark:text-white/60">
          Date and time
          <input
            type="datetime-local"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          From zone
          <select
            value={fromZone}
            onChange={(event) => setFromZone(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {zoneList.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          To zone
          <select
            value={toZone}
            onChange={(event) => setToZone(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {zoneList.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        <p className="text-black/60 dark:text-white/60">Converted time</p>
        <p className="mt-1 text-base font-semibold">{output || "-"}</p>
      </div>

      {!ready ? <p className="mt-3 text-xs text-black/60 dark:text-white/60">Loading time zone engine...</p> : null}
      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
