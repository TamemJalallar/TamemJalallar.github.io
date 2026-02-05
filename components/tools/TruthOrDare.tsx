"use client";

import { useState } from "react";

const TRUTHS = [
  "What is a hobby you wish you were better at?",
  "What is your most used app right now?",
  "What is a goal you want to hit this year?",
  "What is a random skill you are proud of?",
  "What song have you played on repeat lately?",
];

const DARES = [
  "Do 10 jumping jacks.",
  "Say the alphabet backwards as fast as you can.",
  "Send a kind message to someone.",
  "Do your best robot dance for 10 seconds.",
  "Share a fun fact you know.",
];

export default function TruthOrDare() {
  const [prompt, setPrompt] = useState("Pick Truth or Dare to get started.");

  function pickTruth() {
    const next = TRUTHS[Math.floor(Math.random() * TRUTHS.length)] || "";
    setPrompt(`Truth: ${next}`);
  }

  function pickDare() {
    const next = DARES[Math.floor(Math.random() * DARES.length)] || "";
    setPrompt(`Dare: ${next}`);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Truth or Dare</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pickTruth}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Truth
        </button>
        <button
          type="button"
          onClick={pickDare}
          className="rounded-lg border border-gray-300/80 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
        >
          Dare
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {prompt}
      </div>
    </div>
  );
}
