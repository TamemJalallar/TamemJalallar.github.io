"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomTeamGenerator() {
  const [names, setNames] = useState("Tom\nYassie\nAman\nMike\nJohn\nSara");
  const [teamCount, setTeamCount] = useState(2);

  const teams = useMemo(() => {
    const list = names
      .split(/\r\n|\r|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const n = Math.max(1, teamCount);
    const shuffled = shuffle(list);

    const buckets: string[][] = Array.from({ length: n }, () => []);
    shuffled.forEach((name, idx) => buckets[idx % n].push(name));
    return buckets;
  }, [names, teamCount]);

  return (
    <ToolShell title="Random Team Generator" description="Paste names → generate balanced random teams.">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-white/70">Names (one per line)</label>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="h-56 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-white/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Number of teams</label>
          <input
            type="number"
            min={1}
            value={teamCount}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
            <div className="font-semibold">Teams</div>
            <div className="mt-2 grid gap-2">
              {teams.map((t, i) => (
                <div key={i} className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-white/60">Team {i + 1}</div>
                  <div className="mt-1">{t.join(", ") || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
