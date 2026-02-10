"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from "./tool-utils";

const findSegments = (data: Float32Array, sampleRate: number, threshold: number, minSilence: number) => {
  const minSamples = Math.max(1, Math.floor(minSilence * sampleRate));
  const segments: { start: number; end: number }[] = [];
  let inSound = false;
  let start = 0;
  let silenceCount = 0;

  for (let i = 0; i < data.length; i += 1) {
    const value = Math.abs(data[i] ?? 0);
    if (value > threshold) {
      if (!inSound) {
        inSound = true;
        start = i;
      }
      silenceCount = 0;
    } else if (inSound) {
      silenceCount += 1;
      if (silenceCount >= minSamples) {
        const end = i - silenceCount;
        if (end > start) segments.push({ start, end: end + 1 });
        inSound = false;
      }
    }
  }

  if (inSound) segments.push({ start, end: data.length });
  return segments;
};

const sliceToWav = (buffer: AudioBuffer, start: number, end: number) => {
  const length = Math.max(0, end - start);
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const totalSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c += 1) {
    channelData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = start; i < end; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      const sample = channelData[c]?.[i] ?? 0;
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
};

export default function AudioSegmenter() {
  const [file, setFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<{ blob: Blob; duration: number }[]>([]);
  const [threshold, setThreshold] = useState(0.03);
  const [minSilence, setMinSilence] = useState(0.6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setSegments([]);

    let audioContext: AudioContext | null = null;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await readFileAsArrayBuffer(file);
      const decoded = await audioContext.decodeAudioData(buffer.slice(0));
      const channel = decoded.getChannelData(0);

      const segmentRanges = findSegments(channel, decoded.sampleRate, threshold, minSilence);
      const slices = segmentRanges.map((seg) => {
        const blob = sliceToWav(decoded, seg.start, seg.end);
        const duration = (seg.end - seg.start) / decoded.sampleRate;
        return { blob, duration };
      });
      setSegments(slices);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to segment audio.");
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

  return (
    <ToolShell
      title="Audio Segmenter"
      description="Split audio on silence and export WAV clips."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setSegments([]);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Silence threshold
          <input
            type="number"
            min={0.005}
            max={0.1}
            step={0.005}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value) || 0.03)}
            className="ml-2 w-24 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Min silence (s)
          <input
            type="number"
            min={0.2}
            max={2}
            step={0.1}
            value={minSilence}
            onChange={(event) => setMinSilence(Number(event.target.value) || 0.6)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void analyze()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Analyzing..." : "Split"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
        </div>
      ) : null}

      {segments.length ? (
        <div className="mt-4 grid gap-3">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <div className="text-xs text-white/70">Segment {idx + 1}</div>
                <div className="text-[11px] text-white/50">{segment.duration.toFixed(2)}s</div>
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(segment.blob, `segment-${idx + 1}.wav`)}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
