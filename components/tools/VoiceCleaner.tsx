"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

type Preset = {
  id: string;
  label: string;
  lowCut: number;
  highCut: number;
  gate: number;
  boost: number;
};

const PRESETS: Preset[] = [
  { id: "broadcast", label: "Broadcast", lowCut: 80, highCut: 12000, gate: -38, boost: 3 },
  { id: "podcast", label: "Podcast", lowCut: 100, highCut: 10000, gate: -42, boost: 2 },
  { id: "conference", label: "Conference", lowCut: 120, highCut: 9000, gate: -45, boost: 4 },
];

export default function VoiceCleaner() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]?.id ?? "broadcast");
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const clean = async () => {
    if (!file) return;
    setBusy(true);
    setError("");

    let audioContext: AudioContext | null = null;

    try {
      const presetConfig = PRESETS.find((p) => p.id === preset) ?? PRESETS[0];
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await readFileAsArrayBuffer(file);
      const decoded = await audioContext.decodeAudioData(buffer.slice(0));

      const offline = new OfflineAudioContext(
        decoded.numberOfChannels,
        decoded.length,
        decoded.sampleRate,
      );

      const offlineSource = offline.createBufferSource();
      offlineSource.buffer = decoded;
      const offlineLow = offline.createBiquadFilter();
      offlineLow.type = "highpass";
      offlineLow.frequency.value = presetConfig.lowCut;
      const offlineHigh = offline.createBiquadFilter();
      offlineHigh.type = "lowpass";
      offlineHigh.frequency.value = presetConfig.highCut;
      const offlineGain = offline.createGain();
      offlineGain.gain.value = Math.pow(10, presetConfig.boost / 20);

      offlineSource.connect(offlineLow);
      offlineLow.connect(offlineHigh);
      offlineHigh.connect(offlineGain);
      offlineGain.connect(offline.destination);
      offlineSource.start(0);

      const rendered = await offline.startRendering();

      const wavBuffer = encodeWav(rendered, presetConfig.gate);
      const blob = new Blob([wavBuffer], { type: "audio/wav" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(blob);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to clean audio.");
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

  const download = () => {
    if (!resultUrl || !file) return;
    fetch(resultUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        downloadBlob(new Blob([buffer], { type: "audio/wav" }), `${sanitizeFilename(file.name)}-cleaned.wav`);
      });
  };

  return (
    <ToolShell
      title="AI-Free Voice Cleaner"
      description="Noise gate + EQ presets powered by WebAudio."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            setResultUrl(null);
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Preset
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void clean()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Cleaning..." : "Clean"}
        </button>

        <button
          type="button"
          onClick={download}
          disabled={!resultUrl}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          Download WAV
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
        </div>
      ) : null}

      {resultUrl ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <audio ref={audioRef} controls className="w-full" />
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}

function encodeWav(buffer: AudioBuffer, gateDb: number) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const gateThreshold = Math.pow(10, gateDb / 20);

  const length = buffer.length;
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
  for (let i = 0; i < length; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      let sample = channelData[c]?.[i] ?? 0;
      if (Math.abs(sample) < gateThreshold) {
        sample = 0;
      }
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}
