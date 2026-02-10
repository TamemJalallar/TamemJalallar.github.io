"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { canvasToBlob, downloadBlob, formatBytes, readFileAsArrayBuffer } from "./tool-utils";

type WavePoint = { min: number; max: number };

type WaveformData = {
  points: WavePoint[];
  duration: number;
};

export default function AudioWaveformGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("#5f6cff");
  const [background, setBackground] = useState("#0b0b12");

  useEffect(() => {
    if (!waveform) return;
    drawWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waveform, color, background]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    waveform.points.forEach((point, index) => {
      const x = (index / waveform.points.length) * width;
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
      const samples = 500;
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

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, "waveform.png");
  };

  return (
    <ToolShell
      title="Audio Waveform Generator"
      description="Generate a clean waveform image from any audio file."
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
          onClick={() => void download()}
          disabled={!waveform}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download PNG
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {waveform ? <div>Duration: {waveform.duration.toFixed(2)}s</div> : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
        <label className="flex items-center gap-2">
          Wave color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>
        <label className="flex items-center gap-2">
          Background
          <input
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <canvas ref={canvasRef} width={900} height={240} className="w-full rounded-lg" />
      </div>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
