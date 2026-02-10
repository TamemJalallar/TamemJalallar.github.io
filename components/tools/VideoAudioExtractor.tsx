"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { fileDataToBlob, getFfmpeg, toUint8Array } from "./_ffmpeg";

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

type OutputMode = "mp3" | "wav" | "both";

export default function VideoAudioExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<OutputMode>("mp3");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  const extract = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    setResults([]);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "mp4";
    const inputName = `input-${stamp}.${ext}`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const out: Result[] = [];

      if (mode === "mp3" || mode === "both") {
        const outputMp3 = `output-${stamp}.mp3`;
        await ffmpeg.exec([
          "-i",
          inputName,
          "-vn",
          "-c:a",
          "libmp3lame",
          "-b:a",
          "192k",
          outputMp3,
        ]);
        const data = await ffmpeg.readFile(outputMp3);
        const blob = fileDataToBlob(data, "audio/mpeg");
        out.push({
          name: `${sanitizeFilename(file.name)}.mp3`,
          blob,
          size: blob.size,
        });
        await ffmpeg.deleteFile(outputMp3);
      }

      if (mode === "wav" || mode === "both") {
        const outputWav = `output-${stamp}.wav`;
        await ffmpeg.exec([
          "-i",
          inputName,
          "-vn",
          "-c:a",
          "pcm_s16le",
          outputWav,
        ]);
        const data = await ffmpeg.readFile(outputWav);
        const blob = fileDataToBlob(data, "audio/wav");
        out.push({
          name: `${sanitizeFilename(file.name)}.wav`,
          blob,
          size: blob.size,
        });
        await ffmpeg.deleteFile(outputWav);
      }

      setResults(out);
      await ffmpeg.deleteFile(inputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to extract audio.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video Audio Extractor"
      description="Extract audio from a video file and download as MP3 or WAV."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResults([]);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Output
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as OutputMode)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="both">MP3 + WAV</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => void extract()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Extracting..." : "Extract"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          <div>Type: {file.type || "unknown"}</div>
        </div>
      ) : null}

      {results.length ? (
        <div className="mt-4 grid gap-3">
          {results.map((item) => (
            <div
              key={item.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <div className="text-xs text-white/70">{item.name}</div>
                <div className="text-[11px] text-white/50">{formatBytes(item.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(item.blob, item.name)}
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
