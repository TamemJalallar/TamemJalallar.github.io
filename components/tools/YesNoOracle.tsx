"use client";

import { useState } from "react";

const RESPONSES = [
  "Yes",
  "No",
  "Maybe",
  "Ask again later",
  "Definitely",
  "Probably not",
  "It depends",
];

export default function YesNoOracle() {
  const [answer, setAnswer] = useState("Ask a yes/no question...");

  function ask() {
    const next = RESPONSES[Math.floor(Math.random() * RESPONSES.length)] || "";
    setAnswer(next);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Yes / No Oracle</h2>
      <button
        type="button"
        onClick={ask}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Ask
      </button>
      <div className="mt-4 text-2xl font-semibold">{answer}</div>
    </div>
  );
}
