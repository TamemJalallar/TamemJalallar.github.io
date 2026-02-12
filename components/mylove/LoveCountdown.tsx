"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  target: Date;
  label: string;
};

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const pad = (value: number) => value.toString().padStart(2, "0");

const buildCountdown = (target: Date): CountdownState => {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
};

export default function LoveCountdown({ target, label }: CountdownProps) {
  const [state, setState] = useState<CountdownState>(() => buildCountdown(target));

  useEffect(() => {
    const tick = () => setState(buildCountdown(target));
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [target]);

  const subtitle = useMemo(() => {
    if (state.isPast) return "We did it. Married and glowing 💍";
    return "Counting down to forever 💞";
  }, [state.isPast]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Wedding Countdown</h2>
          <p className="mt-1 text-sm text-white/70">{subtitle}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
          {label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "DAYS", value: state.days },
          { label: "HRS", value: state.hours },
          { label: "MINS", value: state.minutes },
          { label: "SECS", value: state.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center"
          >
            <div className="text-2xl font-semibold leading-none text-white">
              {pad(item.value)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.2em] leading-snug">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
