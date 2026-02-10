"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard } from "./tool-utils";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";

const makeStop = (color: string, stop: number) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  color,
  stop,
});

type Stop = { id: string; color: string; stop: number };

type GradientType = "linear" | "radial";

export default function GradientBuilder() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    makeStop("#ff6b6b", 0),
    makeStop("#5f6cff", 100),
  ]);
  const [copied, setCopied] = useState(false);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.stop - b.stop),
    [stops],
  );

  const gradientCss = useMemo(() => {
    const stopList = sortedStops
      .map((stop) => `${stop.color} ${Math.round(stop.stop)}%`)
      .join(", ");
    if (type === "radial") {
      return `radial-gradient(circle, ${stopList})`;
    }
    return `linear-gradient(${Math.round(angle)}deg, ${stopList})`;
  }, [angle, sortedStops, type]);

  const updateStop = (id: string, partial: Partial<Stop>) => {
    setStops((prev) => prev.map((stop) => (stop.id === id ? { ...stop, ...partial } : stop)));
  };

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops((prev) => [...prev, makeStop("#ffffff", 50)]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((stop) => stop.id !== id));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(`background: ${gradientCss};`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <ToolShell
      title="Gradient Builder"
      description="Craft CSS gradients and copy the code instantly."
    >
      <Tooltip.Provider delayDuration={200}>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-white/70">
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as GradientType)}
              className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </label>

          {type === "linear" ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-white/70">Angle</div>
              <div className="flex items-center gap-3">
                <Slider.Root
                  value={[angle]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setAngle(value[0] ?? 0)}
                  className="relative flex h-5 w-48 items-center"
                >
                  <Slider.Track className="relative h-1 w-full rounded-full bg-white/10">
                    <Slider.Range className="absolute h-full rounded-full bg-emerald-400/80" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-4 w-4 rounded-full border border-white/40 bg-white shadow" />
                </Slider.Root>
                <span className="text-xs text-white/60">{Math.round(angle)}°</span>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={addStop}
            disabled={stops.length >= 5}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
          >
            Add stop
          </button>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                {copied ? "Copied" : "Copy CSS"}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="rounded-lg border border-white/10 bg-black/80 px-2 py-1 text-xs text-white"
                sideOffset={6}
              >
                Copy the CSS background value
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <div
          className="mt-4 h-32 w-full rounded-2xl border border-white/10"
          style={{ background: gradientCss }}
        />

        <div className="mt-4 grid gap-3">
          {sortedStops.map((stop) => (
            <div
              key={stop.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <input
                type="color"
                value={stop.color}
                onChange={(event) => updateStop(stop.id, { color: event.target.value })}
                className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
              />
              <label className="text-sm text-white/70">
                Stop
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(stop.stop)}
                  onChange={(event) => updateStop(stop.id, { stop: Number(event.target.value) })}
                  className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
                />
              </label>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
          <div className="font-mono">background: {gradientCss};</div>
        </div>
      </Tooltip.Provider>
    </ToolShell>
  );
}
