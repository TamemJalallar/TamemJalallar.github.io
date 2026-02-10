"use client";

import { useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

export default function VideoSpeedChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState(1);
  const [keepAudio, setKeepAudio] = useState(true);
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

      const filters = [`setpts=${(1 / speed).toFixed(3)}*PTS`];
      const args = [
        "-i",
        inputName,
        "-vf",
        filters.join(","),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "24",
        "-pix_fmt",
        "yuv420p",
      ];

      if (keepAudio) {
        if (speed === 1) {
          args.push("-c:a", "aac", "-b:a", "128k");
        } else if (speed === 0.5) {
          args.push("-filter:a", "atempo=0.5", "-c:a", "aac", "-b:a", "128k");
        } else if (speed === 0.75) {
          args.push("-filter:a", "atempo=0.75", "-c:a", "aac", "-b:a", "128k");
        } else if (speed === 1.25) {
          args.push("-filter:a", "atempo=1.25", "-c:a", "aac", "-b:a", "128k");
        } else if (speed === 1.5) {
          args.push("-filter:a", "atempo=1.5", "-c:a", "aac", "-b:a", "128k");
        } else if (speed === 2) {
          args.push("-filter:a", "atempo=2.0", "-c:a", "aac", "-b:a", "128k");
        } else {
          args.push("-an");
        }
      } else {
        args.push("-an");
      }

      args.push(outputName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "video/mp4" });

      setResult({
        name: `${sanitizeFilename(file.name)}-${speed}x.mp4`,
        blob,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to change speed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video Speed Changer"
      description="Re-encode a video at a different playback speed using FFmpeg."
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
          Speed
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value) || 1)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {SPEEDS.map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={keepAudio}
            onChange={(event) => setKeepAudio(event.target.checked)}
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
