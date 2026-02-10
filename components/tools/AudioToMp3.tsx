"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

const BITRATES = [96, 128, 160, 192, 256];

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

export default function AudioToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState(128);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const convert = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "mp3";
    const inputName = `input-${stamp}.${ext}`;
    const outputName = `output-${stamp}.mp3`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      await ffmpeg.exec([
        "-i",
        inputName,
        "-vn",
        "-c:a",
        "libmp3lame",
        "-b:a",
        `${bitrate}k`,
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "audio/mpeg" });

      setResult({
        name: `${sanitizeFilename(file.name)}.mp3`,
        blob,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Failed to convert audio. This browser may not support MP3 encoding.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Audio to MP3"
      description="Convert audio or video files to MP3 locally (first run downloads codecs)."
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
          Bitrate
          <select
            value={bitrate}
            onChange={(event) => setBitrate(Number(event.target.value) || 128)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {BITRATES.map((value) => (
              <option key={value} value={value}>
                {value} kbps
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void convert()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Converting..." : "Convert"}
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
