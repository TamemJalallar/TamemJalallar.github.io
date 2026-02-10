"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { fileDataToBlob, getFfmpeg, toUint8Array } from "./_ffmpeg";

const QUALITY_OPTIONS = [
  { label: "High (CRF 20)", value: 20 },
  { label: "Balanced (CRF 24)", value: 24 },
  { label: "Smaller (CRF 28)", value: 28 },
];

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

export default function VideoToMp4() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[1]?.value ?? 24);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const convert = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "mp4";
    const inputName = `input-${stamp}.${ext}`;
    const outputName = `output-${stamp}.mp4`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const args = [
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        String(quality),
        "-pix_fmt",
        "yuv420p",
      ];

      if (includeAudio) {
        args.push("-c:a", "aac", "-b:a", "128k");
      } else {
        args.push("-an");
      }

      args.push(outputName);

      try {
        await ffmpeg.exec(args);
      } catch {
        const fallbackArgs = [
          "-i",
          inputName,
          "-c:v",
          "mpeg4",
          "-q:v",
          "5",
        ];

        if (includeAudio) {
          fallbackArgs.push("-c:a", "aac", "-b:a", "128k");
        } else {
          fallbackArgs.push("-an");
        }

        fallbackArgs.push(outputName);
        await ffmpeg.exec(fallbackArgs);
      }

      const data = await ffmpeg.readFile(outputName);
      const blob = fileDataToBlob(data, "video/mp4");

      setResult({
        name: `${sanitizeFilename(file.name)}.mp4`,
        blob,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Failed to convert video. This browser may not support the required codecs.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video to MP4"
      description="Re-encode a video to MP4 locally (first run downloads codecs)."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Quality
          <select
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value) || 24)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {QUALITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={includeAudio}
            onChange={(event) => setIncludeAudio(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/20"
          />
          Keep audio
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
