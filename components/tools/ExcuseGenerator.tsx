"use client";

import { useState } from "react";
import { copyToClipboard } from "./tool-utils";

const ACTIONS = [
  "join the call",
  "send the file",
  "finish the task",
  "reply sooner",
  "submit the form",
  "start the meeting",
  "deploy the update",
  "review the doc",
];

const REASONS = [
  "my Wi-Fi dropped",
  "my laptop restarted",
  "the build was stuck",
  "the VPN disconnected",
  "my calendar double-booked me",
  "my browser crashed",
  "an update popped up",
  "the server was down",
];

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export default function ExcuseGenerator() {
  const [excuse, setExcuse] = useState("Need an excuse? Generate one.");
  const [copied, setCopied] = useState(false);

  function generate() {
    const next = `I couldn't ${pick(ACTIONS)} because ${pick(REASONS)}.`;
    setExcuse(next);
  }

  async function copy() {
    if (!excuse || excuse.startsWith("Need an excuse")) return;
    const ok = await copyToClipboard(excuse);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold">Excuse Generator</h2>
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={excuse.startsWith("Need an excuse")}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        {excuse}
      </div>
    </div>
  );
}
