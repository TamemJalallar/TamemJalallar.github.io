"use client";

import { useState } from "react";

const PROMPTS = [
  "Would you rather travel to the past or the future?",
  "Would you rather have a personal chef or a personal trainer?",
  "Would you rather always be early or always be late?",
  "Would you rather live by the beach or in the mountains?",
  "Would you rather be able to fly or be invisible?",
];

export default function WouldYouRather() {
  const [prompt, setPrompt] = useState("Ready for a tough choice?");

  function pick() {
    const next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)] || "";
    setPrompt(next);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Would You Rather</h2>
      <button
        type="button"
        onClick={pick}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        New prompt
      </button>
      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {prompt}
      </div>
    </div>
  );
}
