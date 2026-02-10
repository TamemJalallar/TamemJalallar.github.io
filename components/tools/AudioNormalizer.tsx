"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

type OutputFormat = "mp3" | "wav";

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

export default function AudioNormalizer() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLufs, setTargetLufs] = useState(-16);
  const [format, setFormat] = useState<OutputFormat>("mp3");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const normalize = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "wav";
    const inputName = `input-${stamp}.${ext}`;
    const outputName = `output-${stamp}.${format}`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const filter = `loudnorm=I=${targetLufs}:TP=-1.5:LRA=11`;

      const args = ["-i", inputName, "-vn", "-filter:a", filter];
      if (format === "mp3") {
        args.push("-c:a", "libmp3lame", "-b:a", "192k", outputName);
      } else {
        args.push("-c:a", "pcm_s16le", outputName);
      }

      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);
      const mime = format === "mp3" ? "audio/mpeg" : "audio/wav";
      const blob = new Blob([data], { type: mime });

      setResult({
        name: `${sanitizeFilename(file.name)}-normalized.${format}`,
        blob,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to normalize audio.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Audio Normalizer"
      description="Normalize audio loudness using FFmpeg loudnorm."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Target LUFS
          <input
            type="number"
            min={-24}
            max={-8}
            step={1}
            value={targetLufs}
            onChange={(event) => setTargetLufs(Number(event.target.value) || -16)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Output
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as OutputFormat)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => void normalize()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Normalizing..." : "Normalize"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          <div>Type: {file.type || "unknown"}</div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <div className="text-xs text-white/70">{result.name}</div>
            <div className="text-[11px] text-white/50">{formatBytes(result.size)}</div>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(result.blob, result.name)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
          >
            Download
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
