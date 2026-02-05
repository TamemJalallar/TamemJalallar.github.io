"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua " +
  "ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure " +
  "dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non " +
  "proident sunt in culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

function makeSentence(wordCount: number) {
  const words = Array.from({ length: wordCount }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [minWords, setMinWords] = useState(40);
  const [maxWords, setMaxWords] = useState(70);

  const text = useMemo(() => {
    const paras = Array.from({ length: Math.max(1, paragraphs) }, () => {
      const sentences = Math.floor(3 + Math.random() * 4);
      const wordsPerSentence = Math.max(6, Math.floor((minWords + maxWords) / 2 / sentences));
      return Array.from({ length: sentences }, () => makeSentence(wordsPerSentence)).join(" ");
    });
    return paras.join("\n\n");
  }, [paragraphs, minWords, maxWords]);

  const copy = async () => navigator.clipboard.writeText(text);

  return (
    <ToolShell
      title="Lorem Ipsum Generator"
      description="Generate placeholder copy quickly."
      right={
        <button
          onClick={copy}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Copy
        </button>
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm text-white/70">
          Paragraphs
          <input
            type="number"
            min={1}
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Min words (approx)
          <input
            type="number"
            min={10}
            value={minWords}
            onChange={(e) => setMinWords(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Max words (approx)
          <input
            type="number"
            min={10}
            value={maxWords}
            onChange={(e) => setMaxWords(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <textarea
        readOnly
        value={text}
        className="mt-4 h-64 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
      />
    </ToolShell>
  );
}
