"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Paste some text here.\nThis tool will highlight matches.\nTry pattern: \\b\\w+\\b");
  const [replaceWith, setReplaceWith] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  const parsed = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      return { ok: true as const, re };
    } catch (e: any) {
      return { ok: false as const, error: e?.message ?? "Invalid regex" };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!parsed.ok) return [];
    const re = parsed.re;

    // Ensure global for iterating matches safely
    const globalRe = re.global ? re : new RegExp(re.source, re.flags + "g");

    const out: Array<{ index: number; text: string; groups?: Record<string, string> }> = [];
    let m: RegExpExecArray | null;

    while ((m = globalRe.exec(text)) !== null) {
      out.push({
        index: m.index,
        text: m[0],
        groups: (m.groups as any) || undefined,
      });
      if (m[0] === "") globalRe.lastIndex++; // avoid infinite loop
    }

    return out;
  }, [parsed, text]);

  const highlightedHtml = useMemo(() => {
    if (!parsed.ok) return escapeHtml(text);

    const re = parsed.re;
    const globalRe = re.global ? re : new RegExp(re.source, re.flags + "g");

    let last = 0;
    let html = "";
    let m: RegExpExecArray | null;

    while ((m = globalRe.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;

      html += escapeHtml(text.slice(last, start));
      html += `<mark class="rounded bg-violet-500/30 px-1 py-0.5 text-white">${escapeHtml(m[0] || "")}</mark>`;
      last = end;

      if (m[0] === "") globalRe.lastIndex++;
    }

    html += escapeHtml(text.slice(last));
    return html;
  }, [parsed, text]);

  const replaced = useMemo(() => {
    if (!parsed.ok) return "";
    try {
      return text.replace(parsed.re, replaceWith);
    } catch {
      return "";
    }
  }, [parsed, text, replaceWith]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <ToolShell title="Regex Tester" description="Test regex patterns, highlight matches, and preview replacements.">
      <div className="grid gap-4">
        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Pattern</label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
              placeholder="e.g. \\b\\w+\\b"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">Flags</label>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                placeholder="gimuy"
              />
              <div className="mt-1 text-xs text-white/50">Common: g i m s u y</div>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplace((v) => !v)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
              >
                {showReplace ? "Hide Replace" : "Show Replace"}
              </button>
            </div>
          </div>
        </div>

        {!parsed.ok ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {parsed.error}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Input Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">Highlighted Matches</label>
              <div className="text-xs text-white/50">{matches.length} match{matches.length === 1 ? "" : "es"}</div>
            </div>

            <div className="mt-2 min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </div>
          </div>
        </div>

        {showReplace ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Replace With</label>
                <input
                  value={replaceWith}
                  onChange={(e) => setReplaceWith(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  placeholder="e.g. [$&] or $1"
                />
                <div className="mt-1 text-xs text-white/50">
                  Supports $1, $2… named groups via <code>$&lt;name&gt;</code> in JS.
                </div>
              </div>

              <div className="flex items-end justify-end gap-2">
                <button
                  type="button"
                  onClick={() => copy(replaced)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm hover:bg-white/10"
                  disabled={!parsed.ok}
                >
                  Copy Output
                </button>
              </div>
            </div>

            <label className="mt-4 block text-sm text-white/70">Output</label>
            <textarea
              value={replaced}
              readOnly
              className="mt-2 min-h-[160px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            />
          </div>
        ) : null}

        {parsed.ok && matches.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm font-semibold">Match List</div>
            <div className="grid gap-2">
              {matches.slice(0, 50).map((m, i) => (
                <div key={`${m.index}-${i}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white/70">#{i + 1} @ {m.index}</span>
                    <button
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
                      onClick={() => copy(m.text)}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-white/90 break-all">{m.text || "∅ (empty match)"}</div>
                </div>
              ))}
              {matches.length > 50 ? (
                <div className="text-xs text-white/50">Showing first 50 matches…</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
