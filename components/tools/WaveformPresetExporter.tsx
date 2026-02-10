"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { canvasToBlob, downloadBlob, formatBytes, readFileAsArrayBuffer } from "./tool-utils";

type WavePoint = { min: number; max: number };

type WaveformData = {
  points: WavePoint[];
  duration: number;
};

type Preset = { id: string; label: string; wave: string; background: string };

const PRESETS: Preset[] = [
  { id: "dark", label: "Dark", wave: "#60a5fa", background: "#0b0b12" },
  { id: "light", label: "Light", wave: "#111827", background: "#f8fafc" },
  { id: "brand", label: "Brand", wave: "#f97316", background: "#1f2937" },
];

export default function WaveformPresetExporter() {
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [file, setFile] = useState<File | null>(null);
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!waveform) return;
    PRESETS.forEach((preset) => {
      const canvas = canvasRefs.current[preset.id];
      if (!canvas) return;
      drawWaveform(canvas, waveform, preset.wave, preset.background);
    });
  }, [waveform]);

  const drawWaveform = (
    canvas: HTMLCanvasElement,
    data: WaveformData,
    waveColor: string,
    bgColor: string,
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.points.forEach((point, index) => {
      const x = (index / data.points.length) * width;
      const yMin = centerY + point.min * centerY;
      const yMax = centerY + point.max * centerY;
      ctx.moveTo(x, yMin);
      ctx.lineTo(x, yMax);
    });

    ctx.stroke();
  };

  const analyze = async () => {
    if (!file) return;
    setBusy(true);
    setError("");

    let audioContext: AudioContext | null = null;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await readFileAsArrayBuffer(file);
      const decoded = await audioContext.decodeAudioData(buffer.slice(0));
      const channel = decoded.getChannelData(0);
      const samples = 520;
      const blockSize = Math.floor(channel.length / samples);

      const points: WavePoint[] = [];
      for (let i = 0; i < samples; i += 1) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, channel.length);
        let min = 1;
        let max = -1;
        for (let j = start; j < end; j += 1) {
          const value = channel[j] ?? 0;
          if (value < min) min = value;
          if (value > max) max = value;
        }
        points.push({ min, max });
      }

      setWaveform({ points, duration: decoded.duration });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to analyze audio.");
    } finally {
      if (audioContext) {
        try {
          await audioContext.close();
        } catch {
          // ignore
        }
      }
      setBusy(false);
    }
  };

  const downloadPreset = async (preset: Preset) => {
    const canvas = canvasRefs.current[preset.id];
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `${preset.id}-waveform.png`);
  };

  const downloadAll = async () => {
    for (const preset of PRESETS) {
      await downloadPreset(preset);
    }
  };

  return (
    <ToolShell
      title="Waveform Preset Exporter"
      description="Generate waveform images in light, dark, and brand styles."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setWaveform(null);
            setError("");
          }}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void analyze()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Analyzing..." : "Generate"}
        </button>

        <button
          type="button"
          onClick={() => void downloadAll()}
          disabled={!waveform}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download all
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {waveform ? <div>Duration: {waveform.duration.toFixed(2)}s</div> : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {PRESETS.map((preset) => (
          <div key={preset.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>{preset.label}</span>
              <button
                type="button"
                onClick={() => void downloadPreset(preset)}
                disabled={!waveform}
                className="rounded-lg bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10 disabled:opacity-40"
              >
                Download
              </button>
            </div>
            <canvas
              ref={(node) => {
                canvasRefs.current[preset.id] = node;
              }}
              width={900}
              height={200}
              className="w-full rounded-lg border border-white/10"
            />
          </div>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
