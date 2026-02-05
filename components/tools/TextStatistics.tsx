"use client";

import { useMemo, useState } from "react";

function estimateReadingTime(words: number) {
  if (!words) return "0 min";
  const minutes = words / 200;
  if (minutes < 1) {
    const seconds = Math.max(1, Math.round(minutes * 60));
    return `${seconds} sec`;
  }
  return `${Math.ceil(minutes)} min`;
}

export default function TextStatistics() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const paragraphs = text
      ? text
          .split(/\n\s*\n/)
          .map((chunk) => chunk.trim())
          .filter(Boolean).length
      : 0;
    const sentences = text
      ? text
          .split(/[.!?]+/)
          .map((chunk) => chunk.trim())
          .filter(Boolean).length
      : 0;

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s+/g, "").length,
      words,
      lines,
      paragraphs,
      sentences,
      readingTime: estimateReadingTime(words),
    };
  }, [text]);

  const items = [
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Reading time", value: stats.readingTime },
  ];

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Text Statistics</h2>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste your text here..."
        className="mt-4 min-h-32 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2 text-sm dark:border-white/10 dark:bg-grey-900/70"
          >
            <p className="text-xs text-black/60 dark:text-white/60">{item.label}</p>
            <p className="mt-1 text-base font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
