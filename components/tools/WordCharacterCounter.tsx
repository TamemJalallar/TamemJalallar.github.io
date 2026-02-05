"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

export default function WordCharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = (text.trim().match(/\S+/g) ?? []).length;
    const lines = text.length ? text.split(/\r\n|\r|\n/).length : 0;
    const paragraphs = (text.trim().match(/(.+)(\r\n|\r|\n){2,}/g)?.length ?? 0) + (text.trim() ? 1 : 0);
    return { chars, charsNoSpaces, words, lines, paragraphs };
  }, [text]);

  return (
    <ToolShell title="Word & Character Counter" description="Quick text statistics.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-56 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-white/20"
        placeholder="Paste text…"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Words", stats.words],
          ["Chars", stats.chars],
          ["Chars (no spaces)", stats.charsNoSpaces],
          ["Lines", stats.lines],
          ["Paragraphs", stats.paragraphs],
        ].map(([label, val]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="text-xs text-white/60">{label}</div>
            <div className="mt-1 text-lg font-semibold">{val as any}</div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
