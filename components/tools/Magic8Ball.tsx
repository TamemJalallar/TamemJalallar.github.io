"use client";

import { useState } from "react";

const RESPONSES = [
  "It is certain.",
  "Without a doubt.",
  "You may rely on it.",
  "Yes, definitely.",
  "Most likely.",
  "Outlook good.",
  "Ask again later.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "My reply is no.",
  "Very doubtful.",
  "Don't count on it.",
];

export default function Magic8Ball() {
  const [answer, setAnswer] = useState("Ask the Magic 8 Ball a question...");

  function shake() {
    const next = RESPONSES[Math.floor(Math.random() * RESPONSES.length)] || "";
    setAnswer(next);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Magic 8 Ball</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Ask a question and shake for a random answer.
      </p>

      <button
        type="button"
        onClick={shake}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Shake
      </button>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {answer}
      </div>
    </div>
  );
}
