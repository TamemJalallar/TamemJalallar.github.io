"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

type Zone = { id: string; label: string };

const ZONES: Zone[] = [
  { id: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { id: "America/Denver", label: "Denver (MT)" },
  { id: "America/Chicago", label: "Chicago (CT)" },
  { id: "America/New_York", label: "New York (ET)" },
  { id: "Europe/London", label: "London (UK)" },
  { id: "Europe/Paris", label: "Paris (CET)" },
  { id: "Asia/Dubai", label: "Dubai (GST)" },
  { id: "Asia/Tehran", label: "Tehran (IRST)" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Tokyo", label: "Tokyo (JST)" },
  { id: "Australia/Sydney", label: "Sydney (AET)" },
];

function fmtInZone(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return dtf.format(date);
}

function parseLocalDateTime(input: string): Date | null {
  // expects "YYYY-MM-DDTHH:mm" from <input type="datetime-local" />
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function TimeZoneConverter() {
  const nowLocal = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }, []);

  const [baseTime, setBaseTime] = useState(nowLocal);
  const [baseZone, setBaseZone] = useState("America/New_York");
  const [compareZones, setCompareZones] = useState<string[]>([
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tehran",
  ]);

  const baseDate = useMemo(() => parseLocalDateTime(baseTime), [baseTime]);

  const rows = useMemo(() => {
    if (!baseDate) return [];
    // baseTime is interpreted in user's local zone, but we want it to represent "baseZone".
    // We can safely compute by formatting baseDate "as if" in baseZone by using:
    // - Get the wall-clock parts in baseZone and reconstruct a Date in UTC.
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: baseZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(baseDate);

    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    const y = get("year");
    const m = get("month");
    const d = get("day");
    const hh = get("hour");
    const mi = get("minute");

    // Interpret those parts as if they were a UTC time (anchor), then format into each zone.
    const anchor = new Date(`${y}-${m}-${d}T${hh}:${mi}:00Z`);

    return [
      { zone: baseZone, label: "Base", value: fmtInZone(anchor, baseZone) },
      ...compareZones.map((z) => ({ zone: z, label: "Compare", value: fmtInZone(anchor, z) })),
    ];
  }, [baseDate, baseZone, compareZones]);

  const toggleZone = (z: string) => {
    setCompareZones((prev) =>
      prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]
    );
  };

  return (
    <ToolShell title="Time Zone Converter" description="Convert a date/time across common time zones.">
      <div className="grid gap-3 lg:grid-cols-3">
        <div>
          <label className="text-sm text-white/70">Date & time</label>
          <input
            type="datetime-local"
            value={baseTime}
            onChange={(e) => setBaseTime(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Base zone</label>
          <select
            value={baseZone}
            onChange={(e) => setBaseZone(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Compare zones</label>
          <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              {ZONES.filter((z) => z.id !== baseZone).map((z) => (
                <label key={z.id} className="flex items-center gap-2 text-white/70">
                  <input
                    type="checkbox"
                    checked={compareZones.includes(z.id)}
                    onChange={() => toggleZone(z.id)}
                  />
                  {z.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
        {rows.length === 0 ? (
          <div className="text-white/70">Pick a valid date/time.</div>
        ) : (
          <ul className="space-y-2">
            {rows.map((r, idx) => (
              <li key={`${r.zone}-${idx}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-white/80">{r.zone}</span>
                <span className="font-mono text-white/70">{r.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolShell>
  );
}
