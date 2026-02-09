"use client";

import { useEffect, useState } from "react";

const PADS = [
  { id: 0, color: "bg-emerald-500", label: "Green" },
  { id: 1, color: "bg-sky-500", label: "Blue" },
  { id: 2, color: "bg-amber-500", label: "Amber" },
  { id: 3, color: "bg-rose-500", label: "Rose" },
];

export default function EchoMemoryGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playingBack, setPlayingBack] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [message, setMessage] = useState("");

  const startGame = () => {
    const first = Math.floor(Math.random() * PADS.length);
    setSequence([first]);
    setCurrentStep(0);
    setStatus("playing");
    setMessage("");
  };

  useEffect(() => {
    if (status !== "playing" || sequence.length === 0) return;
    setPlayingBack(true);
    setCurrentStep(0);

    let index = 0;
    const interval = window.setInterval(() => {
      setActivePad(sequence[index]);
      window.setTimeout(() => setActivePad(null), 300);
      index += 1;

      if (index >= sequence.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setPlayingBack(false);
        }, 350);
      }
    }, 600);

    return () => {
      window.clearInterval(interval);
    };
  }, [sequence, status]);

  const handlePadClick = (id: number) => {
    if (status !== "playing" || playingBack) return;
    setActivePad(id);
    window.setTimeout(() => setActivePad(null), 150);

    if (id !== sequence[currentStep]) {
      setStatus("lost");
      setMessage("Wrong pad! Try again.");
      return;
    }

    if (currentStep === sequence.length - 1) {
      if (sequence.length >= 8) {
        setStatus("won");
        setMessage("You nailed the full sequence!");
      } else {
        const next = Math.floor(Math.random() * PADS.length);
        setSequence((prev) => [...prev, next]);
        setCurrentStep(0);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-sky-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Echo Memory</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Repeat the pattern. Sequence grows each round.
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            {status === "idle" ? "Start" : "Restart"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => handlePadClick(pad.id)}
                className={`flex h-28 items-center justify-center rounded-2xl text-sm font-semibold text-white transition-transform ${
                  isActive ? "scale-105" : "scale-100"
                } ${pad.color}`}
              >
                {pad.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-black/70 dark:text-white/70">
          {status === "playing"
            ? playingBack
              ? "Listen to the sequence..."
              : `Repeat ${sequence.length} step${sequence.length === 1 ? "" : "s"}.`
            : message}
          {status === "won" ? " You win!" : null}
        </div>
      </div>
    </div>
  );
}
